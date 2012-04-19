# -*- coding: utf-8 -*-
import datetime
import json
import jsonfield
import tempfile
from os import path, remove
from PIL import Image
from StringIO import StringIO

from django.contrib.gis.db import models
from django.contrib.gis.db.models import GeometryField
from django.contrib.gis.geos.geometry import Point, Polygon, MultiPoint
from django.core.files import File
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db.models.fields import DateTimeField
from django.db.models.fields.files import ImageField
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.conf import settings
from django.contrib.auth.models import User
from django.utils.translation import gettext as _

from base.utils import image_resize, jsonify_fields
from knowledges.models import Career
from south.modelsinspector import add_introspection_rules

# South and PostGis integration patch
add_introspection_rules([], ["^django\.contrib\.gis"])


class Activity(models.Model):
    LAN_CHOICES = (
        ("en", _("English")),
        ("es", _("Español")),
        ("fr", _("Français")),
        ("de", _("Deutsch")),
        ("pt", _("Português")),
        ("ch", _("中國")),
        ("jp", _("日語")),
    )
    TYPE_CHOICES = (
        (1, _("Illetratum")),
        (2, _("Primary")),
        (3, _("Secondary")),
        (4, _("High School")),
        (5, _("College")),
        (6, _("Master")),
        (7, _("PhD.")),
        (8, _("Post-Doc")),
        (9, _("Professor")),
        (10, _("Emeritus")),
    )
    name = models.CharField(_("name"), max_length=255)
    career = models.ForeignKey(Career)
    language_code = models.CharField(_("language"), max_length=2,
                                    choices=LAN_CHOICES)
    timestamp = models.DateTimeField(auto_now=True)
    query = models.CharField(_("query"), max_length=255)
    level_type = models.PositiveSmallIntegerField(_("level"),
                                            choices=TYPE_CHOICES)
    level_order = models.IntegerField(_("order"), default=0)
    level_required = models.BooleanField(_("required"), default=True)
    reward = models.CharField(_("reward"), max_length=255, default="OK!")
    
    # Needed for objects permissions. It should be autoassigned to
    # the career owner user
    user = models.ForeignKey(User, verbose_name="user", null=True)

    activity_subtypes = ['linguistic', 'relational', 'geospatial', 'visual', 
                        'quiz', 'temporal']
    field_blacklist = ['activity_ptr', 'user', 'highscore', 'id', 'career',
                        'timestamp']

    @classmethod
    def serialize(cls):
        return NotImplemented

    @classmethod
    def create_from_dict(cls, career, data_dict):
        # Select proper subclass
        activity_type = data_dict.get('_type', None)
        if activity_type == 'visual':
            new_activity = Visual()
        elif activity_type == 'quiz':
            new_activity = Quiz()
        elif activity_type == 'linguistic':
            new_activity = Linguistic()
        elif activity_type == 'relational':
            new_activity = Relational()
        elif activity_type == 'geospatial':
            new_activity = Geospatial()
        elif activity_type == 'temporal':
            new_activity = Temporal()
        else:
            return ValueError

        # Populate fields from import
        data_dict.pop('_type')
        for field, value in data_dict.iteritems():
            field_type = new_activity._meta.get_field_by_name(field)[0]
            if isinstance(field_type, ImageField):
                # Convert the base64 string to a file
                file_type, file_data = value.split('base64,')
                filename = tempfile.mktemp()
                tmpfile = open(filename, 'wb')
                tmpfile.write(file_data.decode('base64'))
                tmpfile.close()
                extension = 'jpg' in file_type and 'jpg' or 'png'
                f = open(filename)
                image_field = getattr(new_activity, field)
                file_name = path.splitext(filename.rpartition('/')[-1])[0]
                suf = SimpleUploadedFile(file_name + extension, f.read(), content_type='image/' + extension)

                image_field.save("%s.%s" % (file_name, extension), suf, save=False)
                # Remove temporal file. What about working on memory?
                remove(filename)
                
            elif isinstance(field_type, GeometryField):
                value = json.loads(value)
                if value['type'] == 'Polygon':
                    points = []
                    for point in value['coordinates'][0]:
                        new_point = Point(point[0], point[1])
                        points.append(new_point)
                    polygon = Polygon(points)
                    setattr(new_activity, field, polygon)
                elif value['type'] == 'MultiPoint':
                    points = []
                    for point in value['coordinates']:
                        new_point = Point(point[0], point[1])
                        points.append(new_point)
                    multipoint = MultiPoint(points)
                    setattr(new_activity, field, multipoint)

            elif isinstance(field_type, DateTimeField):
                date = datetime.datetime.strptime(value, "%Y-%m-%dT%H:%M:%S")
                setattr(new_activity, field, date)

            else:
                setattr(new_activity, field, value)

        # Asign career fields
        new_activity.career = career
        new_activity.user = career.user

        # Save new instance
        new_activity.save()
        

    def __unicode__(self):
        return u"%s (Level:%s, Order:%s)" % (self.name,
                                            self.level_type,
                                            self.level_order)

    def size(self):
        for sub in self.activity_subtypes:
            if hasattr(self, sub):
                sub_obj = getattr(self, sub)
                if sub_obj:
                    return sub_obj.sub_activity_size()
        print "WARNING: 0 sized activity"
        return 0


    def sub_activity_size(self):
        size = 0
        fields = [f for f in self._meta.fields if not isinstance(f, ImageField)]
        for field in fields:
            size += len(unicode(getattr(self, field.name)))
        return size

    def save(self, *args, **kwargs):
        self = image_resize(self)
        self.user = self.career.user
        self.timestamp = datetime.datetime.now()
        self.career.timestamp = self.timestamp
        self.career.save()
        super(Activity, self).save(*args, **kwargs)

    def export(self):
        activity = {}
        for sub in self.activity_subtypes:
            if hasattr(self, sub):
                sub_obj = getattr(self, sub)
                exportable_fields = [\
                        f for f in sub_obj._meta.fields \
                        if f.name not in self.field_blacklist and \
                        f.name not in self.activity_subtypes]

                activity = jsonify_fields(sub_obj, exportable_fields)

                # Extra type meta field
                activity["_type"] = sub
                return activity

    class Meta:
        verbose_name_plural = "Activities"
        ordering = ['level_type', 'level_order']


def timestamp_on_delete(sender, instance, signal, *args, **kwargs):
    instance.career.timestamp = datetime.datetime.now()
    instance.career.save()
pre_delete.connect(timestamp_on_delete, sender=Activity)


class Relational(Activity):
    constraints = jsonfield.JSONField(default="[]")
    graph_nodes = jsonfield.JSONField(default="{}")
    graph_edges = jsonfield.JSONField(default="[]")
    path_limit = models.IntegerField(default=0)


class Visual(Activity):
    image = models.ImageField(upload_to="images")
    obfuscated_image = models.ImageField(upload_to="images", null=True,
                                                            blank=True)
    answers = jsonfield.JSONField(default="[]")
    correct_answer = models.CharField(max_length=80)
    time = models.CharField(max_length=10, help_text="Seconds")


class Quiz(Activity):
    image = models.ImageField(upload_to="images", null=True, blank=True)
    obfuscated_image = models.ImageField(upload_to="images", null=True,
                                                            blank=True)
    answers = jsonfield.JSONField(default="[]")
    correct_answer = models.CharField(max_length=80)
    time = models.CharField(max_length=10, help_text="Seconds",
            null=True, blank=True)

    class Meta:
        verbose_name_plural = "quizes"


class Geospatial(Activity):
    points = models.MultiPointField()
    radius = models.FloatField(help_text="Meters")
    area = models.PolygonField()
    #overriding the default manager
    objects = models.GeoManager()


class Temporal(Activity):
    image = models.ImageField(upload_to="images") 
    image_datetime = models.DateTimeField()
    query_datetime = models.DateTimeField()


class Linguistic(Activity):
    locked_text = models.CharField(max_length=255)
    image = models.ImageField(upload_to="images")
    answer = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        self.locked_text = self.locked_text.strip()
        self.answer = self.answer.strip()
        super(Linguistic, self).save(*args, **kwargs)

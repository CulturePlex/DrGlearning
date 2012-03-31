# -*- coding: utf-8 -*-
import datetime
import jsonfield
import os.path
from PIL import Image
from StringIO import StringIO

from django.contrib.gis.db import models
from django.core.files.base import ContentFile
from django.db.models.fields.files import ImageField
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.contrib.auth.models import User
from django.utils.translation import gettext as _

from base.utils import image_resize
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
    language_code = models.CharField(_("language code"), max_length=2,
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
        for sub in activity_subtypes:
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
        super(Activity, self).save(*args, **kwargs)

    def export(self):
        activity = {}
        for sub in self.activity_subtypes:
            if hasattr(self, sub):
                sub_obj = getattr(self, sub)
                exportable_fields = [\
                        f for f in self._meta.get_all_field_names() \
                        if f not in self.field_blacklist and \
                        f not in self.activity_subtypes]

                for field in exportable_fields:
                    activity[field] = getattr(sub_obj, field)
                # Extra type meta field
                activity["_type"] = sub
                return activity

    class Meta:
        verbose_name_plural = "Activities"
        ordering = ['level_type', 'level_order']


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
    locked_text = models.TextField()
    image = models.ImageField(upload_to="images")
    answer = models.TextField()

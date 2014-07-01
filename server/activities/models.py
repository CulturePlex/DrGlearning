# -*- coding: utf-8 -*-
import datetime
import json
import jsonfield
import tempfile
from os import path, remove

from django.contrib.gis.db import models
from django.contrib.gis.db.models import GeometryField
from django.contrib.gis.geos.geometry import Point, Polygon, MultiPoint
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db.models import Max, F
from django.db.models.fields import DateTimeField
from django.db.models.fields.files import ImageField
from django.db.models.signals import post_save, pre_delete
from django.conf import settings
from django.contrib.auth.models import User
from django.utils.translation import gettext as _

from base.utils import jsonify_fields
from knowledges.models import Career
from south.modelsinspector import add_introspection_rules

# South and PostGis integration patch
add_introspection_rules([], ["^django\.contrib\.gis"])


class Activity(models.Model):
    TYPE_CHOICES = (
        (1, _(u"Illetratum")),
        (2, _(u"Primary")),
        (3, _(u"Secondary")),
        (4, _(u"High School")),
        (5, _(u"College")),
        (6, _(u"Master")),
        (7, _(u"PhD.")),
        (8, _(u"Post-Doc")),
        (9, _(u"Professor")),
        (10, _(u"Emeritus")),
    )
    name = models.CharField(_("name"), max_length=255)
    career = models.ForeignKey(Career, verbose_name=_("Course"))
    language_code = models.CharField(_("language"), max_length=5,
                                     choices=Career.LAN_CHOICES, default="en",
                                     null=True, blank=True,
                                     help_text=_("Language of the "
                                                 "activity"))
    timestamp = models.DateTimeField(auto_now=True)
    query = models.CharField(_("query"), max_length=255,
                             help_text=_("Main question of the activity"))
    level_type = models.PositiveSmallIntegerField(_("level"),
                                            choices=TYPE_CHOICES,
                                            help_text=_("'Degree' of level "
                                                        "of difficulty"))
    level_order = models.IntegerField(_("order"), default=0,
                                      help_text=_("Order by which the "
                                                  "activities will be shwon "
                                                  "in the mobile application"))
    level_required = models.BooleanField(_("required"), default=True,
                                         help_text=_("Is this activity "
                                                     "required to pass the "
                                                     "level?"))
    reward = models.CharField(_("reward"), max_length=255, default=_("Nice!"),
                              help_text=_("Reward text to show when the "
                                          "activity is successfully overcame"))
    penalty = models.CharField(_("penalty"), max_length=255,
                               default=_("Ooops, try again!"),
                               help_text=_("Penalty text to show when the"
                                           "activity is not overcame"))
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
                suf = SimpleUploadedFile(file_name + extension, f.read(),
                                         content_type='image/' + extension)
                image_field.save("%s.%s" % (file_name, extension), suf,
                                 save=False)
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

    def get_activity_type(self):
        for activity_type in self.activity_subtypes:
            try:
                getattr(self, activity_type)
                return activity_type
            except Activity.DoesNotExist:
                continue

    def size(self):
        for sub in self.activity_subtypes:
            if hasattr(self, sub):
                sub_obj = getattr(self, sub)
                if sub_obj:
                    return sub_obj.sub_activity_size()
        return 0

    def sub_activity_size(self):
        size = 0
        fields = [f for f in self._meta.fields
                  if not isinstance(f, ImageField)]
        for field in fields:
            size += len(unicode(getattr(self, field.name)))
        return size

    def save(self, *args, **kwargs):
        self.user = self.career.user
        self.timestamp = datetime.datetime.now()
        self.career.timestamp = self.timestamp
        self.career.save()
        if not self.language_code and self.career.language_code:
            self.language_code = self.career.language_code
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
        verbose_name_plural = _("Activities")
        ordering = ['level_type', 'level_order']
        get_latest_by = "timestamp"


def timestamp_on_delete(sender, instance, *args, **kwargs):
    instance.career.timestamp = datetime.datetime.now()
    instance.career.save()
pre_delete.connect(timestamp_on_delete, sender=Activity)


def increment_level_order_on_create(sender, instance, created, *args, **kwgs):
    if created and instance.level_order != 0:
        activities = Activity.objects.filter(
            career=instance.career,
            level_type=instance.level_type,
        )
        annoated_activities = activities.annotate(max_level=Max('level_order'))
        max_order = annoated_activities.filter(level_order=F('max_level'))
        max_level_order = max_order.latest().max_level
        instance.level_order = max_level_order + 1
post_save.connect(increment_level_order_on_create, sender=Activity)


class Relational(Activity):
    constraints = jsonfield.JSONField(_("constraints"),
                                      default="[]",
                                      help_text=_("Set of constraints that "
                                                  "must be validated to "
                                                  "pass the activity"))
    graph_nodes = jsonfield.JSONField(_("nodes"), default="{}")
    graph_edges = jsonfield.JSONField(_("relationships"), default="[]")
    path_limit = models.IntegerField(_("Path limit"), default=10,
                                     help_text=_("Max length allowed of the "
                                                 "path to reach "
                                                 "the ending node from the "
                                                 "starting node"))


class Visual(Activity):
    image = models.ImageField(_("image"), upload_to="images")
    obfuscated_image = models.ImageField(_("obfuscated image"),
                                         upload_to="images",
                                         null=True, blank=True,
                                         help_text=_("This will be shwon "
                                                     "after the time elapsed. "
                                                     "if it is not provided, "
                                                     "one will be generated"))
    answers = jsonfield.JSONField(_("answers"), default="[]",
                                  help_text=_("Set of possible answers shown. "
                                              "You can add a maximum of %s" \
                                  % settings.MAX_ANSWERS_FOR_QUIZZ_VISUAL))
    correct_answer = models.CharField(_("right answer"), max_length=80)
    time = models.CharField(_("countdown time"), max_length=10,
                            help_text=_("Expresed in seconds"))


class Quiz(Activity):
    image = models.ImageField(_("image"), upload_to="images",
                              null=True, blank=True,
                              help_text=_("Optional image to show as tip"))
    obfuscated_image = models.ImageField(_("obfuscated image"),
                                         upload_to="images",
                                         null=True, blank=True,
                                         help_text=_("This will be shwon "
                                                     "after the time elapsed. "
                                                     "if it is not provided, "
                                                     "one will be generated"))
    answers = jsonfield.JSONField(_("possible answers"), default="[]",
                                  help_text=_("Set of possible answers shown. "
                                              "You can add a maximum of %s" \
                                  % settings.MAX_ANSWERS_FOR_QUIZZ_VISUAL))
    correct_answer = models.CharField(_("right answer"), max_length=80)
    time = models.CharField(_("countdown time"), max_length=10,
                            null=True, blank=True,
                            help_text=_("Optional time for countdown. "
                                        "Expresed in seconds"))

    class Meta:
        verbose_name_plural = _("quizes")


class Geospatial(Activity):
    points = models.MultiPointField(_("points"),
                                    help_text=_("Point or points in the World "
                                                "to find"))
    radius = models.FloatField(_("radius"),
                               help_text=_("Expreseed in meters"))
    area = models.PolygonField(_("are"),
                               help_text=_("Define the boundaries to find "
                                           "the point or points"))
    #overriding the default manager
    objects = models.GeoManager()


class Temporal(Activity):
    image = models.ImageField(_("image"), upload_to="images")
    image_datetime = models.DateTimeField(_("image date & time"),
                                          help_text=_("This date and time "
                                                      "will compared with the "
                                                      "query date and time"))
    query_datetime = models.DateTimeField(_("query date & time"),)


class Linguistic(Activity):
    locked_text = models.CharField(_("locked text"), max_length=255,
                                   help_text=_("This text will be unlocked "
                                               "using the letters provided by"
                                               "the player. It will used as "
                                               "a hint, unless it is equal to "
                                               "the answer for the query"))
    image = models.ImageField(_("image"), upload_to="images")
    answer = models.CharField(_("answer"), max_length=255,
                              help_text=_("Answer to the query. If the answer "
                                          "and the locked text are equal, the "
                                          "activity will be considered passed "
                                          "when the locked text will be "
                                          "unlocked"))

    def save(self, *args, **kwargs):
        self.locked_text = self.locked_text.strip()
        self.answer = self.answer.strip()
        super(Linguistic, self).save(*args, **kwargs)

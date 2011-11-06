# -*- coding: utf-8 -*-
import datetime
import jsonfield

from django.contrib.gis.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.contrib.auth.models import User
from django.utils.translation import gettext as _

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
    query = models.TextField()
    level_type = models.PositiveSmallIntegerField(_("type"),
                                            choices=TYPE_CHOICES)
    level_order = models.IntegerField(_("order"), default=0)
    level_required = models.BooleanField(_("required"), default=True)

    @classmethod
    def serialize(cls):
        return NotImplemented

    def __unicode__(self):
        return u"%s" % self.name


class Relational(Activity):
    constraints = jsonfield.JSONField(default="[]")
    graph_nodes = jsonfield.JSONField(default="{}")
    graph_edges = jsonfield.JSONField(default="[]")
    source_path = models.CharField(max_length=30)
    target_path = models.CharField(max_length=30)
    scored_nodes = jsonfield.JSONField(default="{}")


class Visual(Activity):
    image = models.ImageField(upload_to="images")
    obfuscated_image = models.ImageField(upload_to="images")
    answers = models.TextField(help_text="['Answer 1', 'Answer 2', ...]")
    correct_answer = models.CharField(max_length=30)
    time = models.CharField(max_length=10, help_text="Milliseconds")


class Geospatial(Activity):
    points = models.MultiPointField()
    radius = models.FloatField(help_text="Meters")
    area = models.PolygonField()


class Temporal(Activity):
    image = models.ImageField(upload_to="images") 
    image_datetime = models.DateTimeField()
    query_datetime = models.DateTimeField()


class Linguistic(Activity):
    locked_text = models.TextField()
    image = models.ImageField(upload_to="images")
    answer = models.TextField()

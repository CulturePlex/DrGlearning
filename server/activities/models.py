# -*- coding: utf-8 -*-
import datetime

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
    name = models.CharField(_("name"), max_length=255)
    career = models.ManyToManyField(Career, related_name="activities",
                                    through="Level")
    LAN_CHOICES = (
        ("en", _("English")),
        ("es", _("Español")),
        ("fr", _("Français")),
        ("de", _("Deutsch")),
        ("pt", _("Português")),
        ("ch", _("中國")),
        ("jp", _("日語")),
    )
    language_code = models.CharField(_("language code"), max_length=2,
                                    choices=LAN_CHOICES)
    timestamp = models.DateTimeField(auto_now=True)
    query = models.TextField()

    @classmethod
    def serialize(cls):
        return NotImplemented

    def __unicode__(self):
        return u"%s" % self.name


class Level(models.Model):
    activity = models.ForeignKey(Activity)
    career = models.ForeignKey(Career)
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
    type = models.PositiveSmallIntegerField(_("type"),
                                            choices=TYPE_CHOICES)
    order = models.IntegerField(_("order"), null=True, blank=True)
    required = models.BooleanField(_("required"), default=True)

    class Meta:
        ordering = ["order"]


class Relational(Activity):
    graph_nodes = models.TextField()
    graph_edges = models.TextField()
    source_path = models.CharField(max_length=30)
    target_path = models.CharField(max_length=30)
    scored_nodes = models.TextField()


class Visual(Activity):
    image = models.ImageField(upload_to="images")
    obfuscated_image = models.ImageField(upload_to="images")
    answers = models.TextField(help_text="['Answer 1', 'Answer 2', ...]")
    correct_answer = models.CharField(max_length=30)
    time = models.CharField(max_length=10, help_text="Milliseconds")


class Geospatial(Activity):
    point = models.PointField()
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

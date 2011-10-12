# -*- coding: utf-8 -*-
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.contrib.auth.models import User
from django.utils.translation import gettext as _

from knowledges.models import Career


class Activity(models.Model):
    name = models.CharField(_("name"), max_length=255)
    career = models.ManyToManyField(Career, related_name="activities",
                                    through="Level")
    language_code = models.CharField(_("language code"), max_length=20)

    @classmethod
    def serialize(cls):
        return NotImplemented


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
    graph = models.FileField(upload_to="graphs")
    queries = models.TextField(_("queries"))


class VisualMemory(Activity):
    image = models.ImageField(upload_to="images")
    right_options = models.TextField(_("right options"))
    wrong_options = models.TextField(_("wrong options"))


class GeospatialAreas(Activity):
    pass


class AfterBefore(Activity):
    pass


class HangmanPuzzle(Activity):
    image = models.ImageField(upload_to="images")
    question = models.TextField(_("question"))
    answer = models.TextField(_("answer"))

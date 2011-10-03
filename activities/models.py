# -*- coding: utf-8 -*-
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.contrib.auth.models import User
from django.utils.translation import gettext as _

from knowledges.models import Career

class Activity(models.Model):
    name = models.CharField(_('name'), max_length=255)
    career = models.ManyToManyField(Career, related_name="careers",
                                    through="Level")

    class Meta:
        abstract = True


class Level(models.Model):
    activity = models.ForeignKey(Activity)
    career = models.ForeignKey(Career)
    TYPE_CHOICES = (
        (1, _('Illetratum')),
        (2, _('Primary')),
        (3, _('Secondary')),
        (4, _('High School')),
        (5, _('College')),
        (6, _('Master')),
        (7, _('PhD.')),
        (8, _('Post-Doc')),
        (9, _('Professor')),
        (10, _('Emeritus')),
    )
    type = models.PositiveSmallIntegerField(_('type'),
                                            choices=TYPE_CHOICES)

    class Meta:
        ordering = ['type']


class RelationalActivity(Activity):

    class Meta:
        abstract = True



class VisualActivity(Activity):

    class Meta:
        abstract = True



class GeospatialActivity(Activity):

    class Meta:
        abstract = True


class TemporalActivity(Activity):

    class Meta:
        abstract = True



class MultimediaActivity(Activity):

    class Meta:
        abstract = True



class LinguisticActivity(Activity):

    class Meta:
        abstract = True


class Wordsearch(LinguisticActivity):
    pass

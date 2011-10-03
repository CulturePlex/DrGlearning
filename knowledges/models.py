# -*- coding: utf-8 -*-
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.contrib.auth.models import User
from django.utils.translation import gettext as _


class Knowledge(models.Model):
    name = models.CharField(_('name'), max_length=255)

    class Meta:
        verbose_name = _("knowledge field")
        verbose_plural_name = _("knowledge fields")

    def __unicode__(self):
        return u"%s" % self.name


class Career(models.Model):
    name = models.CharField(_('name'), max_length=255)
    user = models.ForeignKey(User, verbose_name="user")
    knowledge_field = models.ManyToManyField(KnowledgeField,
                                             verbose_name="knowledge field",
                                             related_name"knowledge_fields")

    def __unicode__(self):
        return u"%s" % self.name

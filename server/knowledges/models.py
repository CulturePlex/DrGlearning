# -*- coding: utf-8 -*-
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.contrib.auth.models import User
from django.utils.translation import gettext as _

from base.utils import image_resize


class Knowledge(models.Model):
    name = models.CharField(_('name'), max_length=255)

    class Meta:
        verbose_name = _("knowledge field")

    def __unicode__(self):
        return u"%s" % self.name

    @staticmethod
    def autocomplete_search_fields():
        return ("id__iexact", "name__icontains",)


class Career(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(default="")
    user = models.ForeignKey(User, verbose_name="user")
    positive_votes = models.IntegerField(default=0)
    negative_votes = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=False)
    image = models.ImageField(upload_to="images", blank=True, null=True)
    knowledge_field = models.ManyToManyField(Knowledge,
                                             verbose_name="knowledge field",
                                             related_name="knowledge_fields")

    def __unicode__(self):
        return u"%s" % self.name

    def save(self, *args, **kwargs):
        self = image_resize(self)
        counter = 0
        career = Career.objects.filter(user=self.user, name=self.name)
        original_name = self.name
        while career.exists():
            counter += 1
            self.name = "%s-%d" % (original_name, counter)
            career = Career.objects.filter(user=self.user, name=self.name)
        super(Career, self).save(*args, **kwargs)

    def export(self):
        exported_activities = []
        for a in self.activity_set.all():
            exported_activities.append(a.export())
        return exported_activities

    class Meta:
        unique_together = ('name', 'user')
        verbose_name = _("course")
        verbose_name_plural = _("courses")


class GenuineUser(User):
    has_authenticity = models.BooleanField(default=True)
    institution_url = models.CharField(max_length=80)

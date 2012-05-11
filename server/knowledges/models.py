# -*- coding: utf-8 -*-
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.contrib.auth.models import User
from django.utils.translation import gettext as _

from base.utils import image_resize
from knowledges.templatetags.knowledges_extras import api_url


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
    MODE_CHOICES = (
        ('explore', _("Explore")),
        ('exam', _("Exam"))
    )
    name = models.CharField(max_length=255)
    description = models.TextField(default="")
    user = models.ForeignKey(User, verbose_name="user")
    positive_votes = models.IntegerField(_("positive votes"), default=0,
                                        help_text=_("Negative votes received"))
    negative_votes = models.IntegerField(_("negative votes"), default=0,
                                        help_text=_("Negative votes received"))
    career_type = models.CharField(max_length=20,
                                   verbose_name=_("course type"),
                                   choices=MODE_CHOICES,
                                   default="explore")
    timestamp = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=False)
    image = models.ImageField(_("image"), upload_to="images",
                              blank=True, null=True)
    knowledge_field = models.ManyToManyField(Knowledge,
                                             verbose_name=_("knowledge fields"),
                                             related_name="knowledge_fields",
                                         help_text=_("Choose the 5 knowledges "
                                                     "fields that suit better "
                                                     "your course"))

    class Meta:
        unique_together = ('name', 'user')
        verbose_name = _("course")
        verbose_name_plural = _("courses")

    def __unicode__(self):
        return u"%s" % self.name

    def save(self, *args, **kwargs):
        self = image_resize(self)
        counter = 0
        career = Career.objects.filter(user=self.user, name=self.name)
        career = career.exclude(id=self.id)
        original_name = self.name
        while career:
            counter += 1
            self.name = u"%s %d" % (original_name, counter)
            career = Career.objects.filter(user=self.user, name=self.name)
        super(Career, self).save(*args, **kwargs)

    def export(self):
        exported_activities = []
        for a in self.activity_set.all():
            exported_activities.append(a.export())
        return exported_activities

    def qrcode(self):
        image_src = "http://chart.apis.google.com/chart?cht=qr&chs=80x80&chl=%s" % \
                api_url('career', self.id)
        return '<img class="course-qrcode" src="%s">' % image_src
    qrcode.allow_tags = True


class GenuineUser(User):
    has_authenticity = models.BooleanField(default=True)
    institution_url = models.CharField(max_length=80)

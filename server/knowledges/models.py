# -*- coding: utf-8 -*-
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.contrib.auth.models import User
from django.utils.translation import gettext as _

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
        ('explore', _("Explore, it allows players to play any level any time")),
        ('exam', _("Exam, it requires to pass the current level before "
                   "playing the next one"))
    )
    name = models.CharField(max_length=255)
    description = models.TextField(default="")
    user = models.ForeignKey(User, verbose_name="user")
    positive_votes = models.IntegerField(_("positive votes"), default=0,
                                        help_text=_("Negative votes received"))
    negative_votes = models.IntegerField(_("negative votes"), default=0,
                                        help_text=_("Negative votes received"))
    career_type = models.CharField(max_length=20,
                                   verbose_name=_("modality"),
                                   choices=MODE_CHOICES,
                                   default="explore")
    timestamp = models.DateTimeField(auto_now=True)
    published = models.BooleanField(_("published"), default=False,
                                    help_text=_("Whether show or not this "
                                                "course in the "
                                                "public list of courses"))
    image = models.ImageField(_("image"), upload_to="images",
                              blank=True, null=True)
    knowledge_field = models.ManyToManyField(Knowledge,
                                             verbose_name=_("knowledge fields"),
                                             related_name="careers",
                                         help_text=_("Choose the 5 knowledges "
                                                     "fields that suit better "
                                                     "your course"))
    content_url = models.TextField(_("Course"), default="",
                                   blank=True, null=True,
                                   help_text=_("URLs from YouTube, vimeo.com "
                                               "or any other oEmbed compliant "
                                               "site must work"))
    content_level1_url = models.TextField(_("Illetratum"), default="",
                                   blank=True, null=True,
                                   help_text=_("URLs from YouTube, vimeo.com "
                                               "or any other oEmbed compliant "
                                               "site must work"))
    content_level2_url = models.TextField(_("Primary"), default="",
                                   blank=True, null=True,
                                   help_text=_("URLs from YouTube, vimeo.com "
                                               "or any other oEmbed compliant "
                                               "site must work"))
    content_level3_url = models.TextField(_("Secondary"), default="",
                                   blank=True, null=True,
                                   help_text=_("URLs from YouTube, vimeo.com "
                                               "or any other oEmbed compliant "
                                               "site must work"))
    content_level4_url = models.TextField(_("High School"), default="",
                                   blank=True, null=True,
                                   help_text=_("URLs from YouTube, vimeo.com "
                                               "or any other oEmbed compliant "
                                               "site must work"))
    content_level5_url = models.TextField(_("College"), default="",
                                   blank=True, null=True,
                                   help_text=_("URLs from YouTube, vimeo.com "
                                               "or any other oEmbed compliant "
                                               "site must work"))
    content_level6_url = models.TextField(_("Master"), default="",
                                   blank=True, null=True,
                                   help_text=_("URLs from YouTube, vimeo.com "
                                               "or any other oEmbed compliant "
                                               "site must work"))
    content_level7_url = models.TextField(_("PhD."), default="",
                                   blank=True, null=True,
                                   help_text=_("URLs from YouTube, vimeo.com "
                                               "or any other oEmbed compliant "
                                               "site must work"))
    content_level8_url = models.TextField(_("Post-Doc"), default="",
                                   blank=True, null=True,
                                   help_text=_("URLs from YouTube, vimeo.com "
                                               "or any other oEmbed compliant "
                                               "site must work"))
    content_level9_url = models.TextField(_("Professor"), default="",
                                   blank=True, null=True,
                                   help_text=_("URLs from YouTube, vimeo.com "
                                               "or any other oEmbed compliant "
                                               "site must work"))
    content_level10_url = models.TextField(_("Emeritus"), default="",
                                   blank=True, null=True,
                                   help_text=_("URLs from YouTube, vimeo.com "
                                               "or any other oEmbed compliant "
                                               "site must work"))


    class Meta:
        unique_together = ('name', 'user')
        verbose_name = _("course")
        verbose_name_plural = _("courses")

    def __unicode__(self):
        return u"%s" % self.name

    def save(self, *args, **kwargs):
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


class GenuineUser(User):
    has_authenticity = models.BooleanField(default=True)
    institution_url = models.CharField(max_length=80)

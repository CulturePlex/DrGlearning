# -*- coding: utf-8 -*-
from django import forms
from django.conf import settings
from django.contrib import admin
from django.contrib.admin.widgets import AdminTextInputWidget
from django.utils.translation import gettext as _

from guardian.admin import GuardedModelAdmin

from activities.models import Activity
from knowledges.models import Knowledge, Career, GenuineUser
from knowledges.templatetags.knowledges_extras import api_url


class CareerAdminForm(forms.ModelForm):

    class Meta:
        model = Career

    def __init__(self, *args, **kwargs):
        super(CareerAdminForm, self).__init__(*args, **kwargs)
        widget = AdminTextInputWidget()
        self.fields["content_url"].widget = widget
        for i in range(1, 11):
            widget = AdminTextInputWidget()
            self.fields["content_level%s_url" % i].widget = widget

    def clean_published(self):
        published = self.cleaned_data["published"]
        if published and self.instance.activity_set.count() == 0:
            raise forms.ValidationError(_("Sorry, you can only publish "
                                          "courses with at least one activity"))
        else:
            return published

    def clean_knowledge_field(self):
        knowledge_fields = self.cleaned_data["knowledge_field"].distinct()
        if knowledge_fields.count() > settings.MAX_KNOWLEDGE_FIELDS:
            raise forms.ValidationError(_("Sorry, you can only choose %s "
                                          "different knowledge fields"
                                          % settings.MAX_KNOWLEDGE_FIELDS))
        else:
            return knowledge_fields


class CareerAdmin(GuardedModelAdmin):
    form = CareerAdminForm
    exclude = ("user", )
    readonly_fields = ("positive_votes", "negative_votes")
    # Setting this attribute to True makes the magic of "hiding" not owned objects
    user_can_access_owned_objects_only = True
    change_form_template = 'admin/knowledges/career/change_form.html'
    # grapelli
    raw_id_fields = ('knowledge_field',)
    autocomplete_lookup_fields = {
        'm2m': ['knowledge_field'],
    }
    list_display = ("name", "published", "description", "activities",
                    "qrcode")
    list_filter = ("published", "knowledge_field")
    search_fields = ("name", "published", "description")
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'knowledge_field',
                       'language_code', 'career_type', 'image',
                       ('published', 'positive_votes', 'negative_votes'),)
        }),
        (_(u"Content"), {
            'classes': ('collapse closed',),
            'fields': ('content_url',
                       'content_level1_url', 'content_level2_url',
                       'content_level3_url', 'content_level4_url',
                       'content_level5_url', 'content_level6_url',
                       'content_level7_url', 'content_level8_url',
                       'content_level9_url', 'content_level10_url',)
        }),
    )

    def get_activity_type(self, a):
        for a_type in ('relational', 'temporal', 'visual', 'linguistic',
                        'geospatial', 'quiz'):
            if hasattr(a, a_type):
                return a_type
        return None

    def change_view(self, request, object_id, extra_context=None):
        all_activities = [(a, self.get_activity_type(a)) \
                for a in Career.objects.get(pk=object_id).activity_set.all()]
        career_activities = []
        for value, text in Activity.TYPE_CHOICES:
            career_activities.append((text, [a for a in all_activities if a[0].level_type==value]))
        context = {"activities_by_level": career_activities,
                    "activities_count": len(all_activities)}
        return super(CareerAdmin, self).change_view(request, object_id,
                                                    extra_context=context)

    def save_model(self, request, obj, form, change):
        if obj.user_id == None  or not request.user.is_superuser:
            obj.user = request.user
        obj.save()

    def qrcode(self, obj):
        career_url = api_url('career', obj.id)
        image_size = "80x80"
        image_src = "http://chart.apis.google.com/chart?cht=qr&chs=%s&chl=%s" \
                    % (image_size, career_url)
        return u"""<a href="%s?course=%s" alt="%s" title="%s">
            <img class="course-qrcode" src="%s">
            </a>""" % (settings.EMULATOR_URL, career_url, obj.name, obj.name,
                       image_src)
    qrcode.allow_tags = True
    qrcode.short_description = _("QR-Code")

    def activities(self, obj):
        return obj.activity_set.count()
    activities.short_description = _("# Activities")


admin.site.register(Knowledge)
admin.site.register(Career, CareerAdmin)
admin.site.register(GenuineUser)

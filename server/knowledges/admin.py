# -*- coding: utf-8 -*-
from django.contrib import admin

from guardian.admin import GuardedModelAdmin

from knowledges.models import Knowledge, Career, GenuineUser
from activities.models import Activity


class CareerAdmin(GuardedModelAdmin):
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
    list_display = ("name", "published", "description")
    list_filter = ("published", )
    search_fields = ("name", "published", "description")

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


admin.site.register(Knowledge)
admin.site.register(Career, CareerAdmin)
admin.site.register(GenuineUser)

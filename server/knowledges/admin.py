# -*- coding: utf-8 -*-
from django.contrib import admin

from knowledges.models import Knowledge, Career, GenuineUser
from activities.models import Activity


class CareerAdmin(admin.ModelAdmin):

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
        context = {"activities_by_level": career_activities}
        return super(CareerAdmin, self).change_view(request, object_id,
                                                    extra_context=context)


admin.site.register(Knowledge)
admin.site.register(Career, CareerAdmin)
admin.site.register(GenuineUser)

# -*- coding: utf-8 -*-
from django.contrib import admin

from knowledges.models import Knowledge, Career
from activities.models import (Relational, Visual, Geospatial,
                               Temporal, Linguistic, Activity)


BLACK_LIST = ["id", "activity_ptr"]

def getLocalFields(model):
    return [f.name for f in model._meta.local_fields if f.editable and f.name not in BLACK_LIST]

def getFieldSets(model):
    return (
        (None, {
            'fields': getLocalFields(Activity)
        }),
        ('Specific fields', {
            'classes': ('collapse',),
            'fields': getLocalFields(model)
        }),
    )


class RelationalInline(admin.StackedInline):
    model = Relational
    fieldsets = getFieldSets(model)
    extra = 1


class VisualInline(admin.StackedInline):
    model = Visual
    fieldsets = getFieldSets(model)
    extra = 1


class GeospatialInline(admin.StackedInline):
    model = Geospatial
    fieldsets = getFieldSets(model)
    extra = 1


class TemporalInline(admin.StackedInline):
    model = Temporal
    fieldsets = getFieldSets(model)
    extra = 1


class LinguisticInline(admin.StackedInline):
    model = Linguistic
    fieldsets = getFieldSets(model)
    extra = 1


class CareerAdmin(admin.ModelAdmin):
    inlines = [
        RelationalInline,
        VisualInline,
        GeospatialInline,
        TemporalInline,
        LinguisticInline,
    ]

    class Media:
        js = ['js/collapsed_stacked_inlines.js']


admin.site.register(Knowledge)
admin.site.register(Career, CareerAdmin)

# -*- coding: utf-8 -*-
from django.contrib import admin

from activities.models import (Relational, Visual, Geospatial,
                               Temporal, Linguistic, Level)


class LevelInline(admin.TabularInline):
    model = Level
    extra = 1


class ActivityAdmin(admin.ModelAdmin):
    inlines = (LevelInline,)
    list_filter = ['career']


class RelationalAdmin(ActivityAdmin):
    pass


class VisualAdmin(ActivityAdmin):
    pass


class GeospatialAdmin(ActivityAdmin):
    pass


class TemporalAdmin(ActivityAdmin):
    pass


class LinguisticAdmin(ActivityAdmin):
    pass


admin.site.register(Relational, RelationalAdmin)
admin.site.register(Visual, VisualAdmin)
admin.site.register(Geospatial, GeospatialAdmin)
admin.site.register(Temporal, TemporalAdmin)
admin.site.register(Linguistic, LinguisticAdmin)

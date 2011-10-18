# -*- coding: utf-8 -*-
from django.contrib import admin

from activities.models import (Relational, VisualMemory, GeospatialAreas,
                               AfterBefore, HangmanPuzzle, Level)


class LevelInline(admin.TabularInline):
    model = Level
    extra = 1


class ActivityAdmin(admin.ModelAdmin):
    inlines = (LevelInline,)
    list_filter = ['career']


class RelationalAdmin(ActivityAdmin):
    pass


class VisualMemoryAdmin(ActivityAdmin):
    pass


class GeospatialAreasAdmin(ActivityAdmin):
    pass


class AfterBeforeAdmin(ActivityAdmin):
    pass


class HangmanPuzzleAdmin(ActivityAdmin):
    pass


admin.site.register(Relational, RelationalAdmin)
admin.site.register(VisualMemory, VisualMemoryAdmin)
admin.site.register(GeospatialAreas, GeospatialAreasAdmin)
admin.site.register(AfterBefore, AfterBeforeAdmin)
admin.site.register(HangmanPuzzle, HangmanPuzzleAdmin)

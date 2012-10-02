from django.contrib import admin
from django.contrib.admin import SimpleListFilter
from django.utils.translation import ugettext_lazy as _


from guardian.admin import GuardedModelAdmin

from activities.models import Career
from players.models import Player, HighScore


# Filters

class CareerListFilter(SimpleListFilter):
    # Human-readable title which will be displayed in the
    # right admin sidebar just above the filter options.
    title = _('Course')

    # Parameter for the filter that will be used in the URL query.
    parameter_name = 'course'

    def lookups(self, request, model_admin):
        if not request.user.is_superuser:
            careers = request.user.career_set.all()
        else:
            careers = Career.objects.all()
        return ((career["id"], career["name"])
                for career in careers.values("id", "name"))

    def queryset(self, request, queryset):
        if not request.user.is_superuser:
            qs = queryset.filter(activity__career__user=request.user)
            if self.value():
                return qs.filter(activity__career__id=self.value())
            else:
                return qs
        return queryset


class PlayerListFilter(SimpleListFilter):
    # Human-readable title which will be displayed in the
    # right admin sidebar just above the filter options.
    title = _('Player')

    # Parameter for the filter that will be used in the URL query.
    parameter_name = 'player'

    def lookups(self, request, model_admin):
        players = Player.objects.all()
        if request.user.is_superuser:
            lookup = {"highscore__activity__career__user__id": request.user.id}
            players = players.filter(**lookup).distinct()
            return ((player.id, player.get_name()) for player in players)
        else:
            return players

    def queryset(self, request, queryset):
        if not request.user.is_superuser:
            qs = queryset.filter(activity__career__user=request.user)
            if self.value():
                return qs.filter(player__id=self.value())
            else:
                return qs
        return queryset


## Admins

class HighScoreAdmin(GuardedModelAdmin):

    class Meta:
        model = HighScore

    # user_can_access_owned_objects_only = True
    # user_owned_objects_field = "activity.career.user"
    list_display = ("player_name", "activity", "career", "score")
    list_filter = (CareerListFilter, PlayerListFilter)
    search_fields = ("activity__name", "activity__career__name")
    # # exclude = ('user',)
    save_as = True

    def career(self, obj):
        return u"{0}".format(obj.activity.career)
    career.admin_order_field = "activity__career__name"
    career.short_description = _("Course")

    def player_name(self, obj):
        return u"{}".format(obj.player.get_name())
    player_name.admin_order_field = 'player__display_name'
    player_name.short_description = _("Player")


admin.site.register(Player)
admin.site.register(HighScore, HighScoreAdmin)

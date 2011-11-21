from tastypie import fields

from tastypie.authorization import Authorization
from tastypie.resources import ModelResource

from activities.api import ActivityResource
from players.models import Player, HighScore


class PlayerResource(ModelResource):

    class Meta:
        queryset = Player.objects.all()


class HighScoreResource(ModelResource):
    player = fields.ForeignKey(PlayerResource, 'player')
    activity = fields.ForeignKey(ActivityResource, 'activity')

    class Meta:
        queryset = HighScore.objects.all()
        authorization = Authorization()

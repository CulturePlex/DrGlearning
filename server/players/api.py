from datetime import datetime

from tastypie import fields
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource

from activities.api import ActivityResource
from activities.models import Activity
from base.utils import dehydrate_fields
from players.models import Player, HighScore


def is_valid_jsonp(request_type, request, required_fields):
    #TODO Add security token test
    for rf in required_fields:
        if rf not in request.GET:
            return False
    return (request_type == "list"
            and "callback" in request.GET)


class PlayerResource(ModelResource):

    class Meta:
        queryset = Player.objects.all()

    def dispatch(self, request_type, request, **kwargs):
        required_fields = ('code',)
        if is_valid_jsonp(request_type, request, required_fields):
            p, c = Player.objects.get_or_create(code=request.GET["code"])
            kwargs["pk"] = p.id
            request_type = "detail"
        return super(PlayerResource, self).dispatch(request_type,
                                                    request,
                                                    **kwargs)

    def dehydrate(self, bundle):
        return dehydrate_fields(bundle)


class ScoreResource(ModelResource):
    player = fields.ForeignKey(PlayerResource, 'player')
    activity = fields.ForeignKey(ActivityResource, 'activity')

    def dispatch(self, request_type, request, **kwargs):
        required_fields = ('player_code', 'activity_id', 'score', 'token')
        if is_valid_jsonp(request_type, request, required_fields):
            player = Player.objects.get(code=request.GET["player_code"])
            if player.token == request.GET["token"]:
                activity = Activity.objects.get(pk=request.GET["activity_id"])
                activity_timestamp = datetime.now()
                if request.GET["timestamp"]:
                    try:
                        timestamp = float(request.GET["timestamp"])
                        activity_timestamp = datetime.fromtimestamp(timestamp)
                    except TypeError:
                        pass
                hs = HighScore(player=player,
                               activity=activity,
                               score=request.GET["score"],
                               activity_timestamp=activity_timestamp)
                hs.save()
                kwargs["pk"] = hs.id
                request_type = "detail"
        return super(ScoreResource, self).dispatch(request_type,
                                                   request,
                                                   **kwargs)

    class Meta:
        queryset = HighScore.objects.all()

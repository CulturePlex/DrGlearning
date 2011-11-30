from tastypie import fields

from tastypie.authorization import Authorization
from tastypie.resources import ModelResource

from activities.api import ActivityResource
from activities.models import Activity
from players.models import Player, HighScore


def is_valid_jsonp(request_type, request, required_fields):
    #TODO Add security token test
    for rf in required_fields:
        if rf not in request.GET:
            return False
    return request_type=="list" and \
                "callback" in request.GET


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


class HighScoreResource(ModelResource):
    player = fields.ForeignKey(PlayerResource, 'player')
    activity = fields.ForeignKey(ActivityResource, 'activity')

    def dispatch(self, request_type, request, **kwargs):
        required_fields = ('player_code', 'activity_id', 'score')
        if is_valid_jsonp(request_type, request, required_fields):
            player = Player.objects.get(code=request.GET["player_code"])
            activity = Activity.objects.get(pk=request.GET["activity_id"])
            hs = HighScore(player=player,
                            activity=activity,
                            score=request.GET["score"])
            hs.save()
            kwargs["pk"] = hs.id
            request_type = "detail"
        return super(HighScoreResource, self).dispatch(request_type,
                                                    request,
                                                    **kwargs)

    class Meta:
        queryset = HighScore.objects.all()

import json
from datetime import datetime

from tastypie import fields
from tastypie.resources import ModelResource

from activities.api import ActivityResource
from activities.models import Activity
from base.utils import dehydrate_fields
from knowledges.models import Career
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

    def __init__(self, *args, **kwargs):
        super(PlayerResource, self).__init__(*args, **kwargs)
        self.send_token = False

    def dispatch(self, request_type, request, **kwargs):
        # required_fields = ('code', )
        if "code" in request.GET and "callback" in request.GET:
            importing = json.loads(request.GET.get("import", "false").lower())
            code = request.GET["code"]
            if importing:
                players = Player.objects.filter(code=code)
                if len(players) == 1:
                    self.send_token = True
                    kwargs["pk"] = players[0].id
            else:
                p, created = Player.objects.get_or_create(code=code)
                kwargs["pk"] = p.id
                self.send_token = created
                if "token" in request.GET and p.token == request.GET["token"]:
                    for attr in ["display_name", "email"]:
                        if attr in request.GET:
                            setattr(p, attr, request.GET.get(attr))
                    if "options" in request.GET:
                        options = p.options
                        options.update(json.loads(request.GET["options"]))
                        p.options = options
                    p.save()
            request_type = "detail"
        return super(PlayerResource, self).dispatch(request_type,
                                                    request,
                                                    **kwargs)

    def dehydrate(self, bundle):
        # Remove non-existing careers
        player_careers = bundle.obj.options.get("careers", [])
        careers = Career.objects.in_bulk(player_careers).keys()
        player_careers.sort()
        careers.sort()
        if player_careers != careers:
            bundle.obj.options["careers"] = careers
            bundle.obj.save()
        # We don't want to remove the token, so we do this after the saving
        if not self.send_token:
            bundle.obj.token = None
        return dehydrate_fields(bundle)


class ScoreResource(ModelResource):
    player = fields.ForeignKey(PlayerResource, 'player')
    activity = fields.ForeignKey(ActivityResource, 'activity')

    class Meta:
        queryset = HighScore.objects.all()
        filtering = {
            'player': ('exact', 'in', 'range'),
            'activity': ('exact', 'in', 'range'),
            'activity__career': ('exact', 'in', 'range'),
        }

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
                is_passed = request.GET.get("is_passed", "false").lower()
                hs = HighScore(player=player,
                               activity=activity,
                               score=request.GET["score"],
                               is_passed=json.loads(is_passed),
                               activity_timestamp=activity_timestamp)
                hs.save()
                kwargs["pk"] = hs.id
                request_type = "detail"
        return super(ScoreResource, self).dispatch(request_type,
                                                   request,
                                                   **kwargs)

    def dehydrate(self, bundle):
        bundle.data['career_id'] = bundle.obj.activity.career.id
        bundle.data['activity_id'] = bundle.obj.activity.id
        return bundle

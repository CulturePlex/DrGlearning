import json
from datetime import datetime
from hashlib import sha1

from django.db.models import Count, Avg, Max
from django.db.models.query import QuerySet

from tastypie import fields
from tastypie import http
from tastypie.exceptions import ImmediateHttpResponse
from tastypie.resources import Bundle, ModelResource, Resource

from activities.api import ActivityResource
from activities.models import Activity
from base.utils import dehydrate_fields
from knowledges.models import Career
from players.models import Player, HighScore
from players.utils import get_top_players


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
                # Check if course is private
                career_code_encoded = activity.career.code.encode("utf8")
                career_code = sha1(career_code_encoded).hexdigest()
                if (len(career_code_encoded) > 0 and career_code
                        and career_code != request.GET.get("career_code", "")):
                    msg = json.dumps({
                        "status_code": 403,
                        "message": u"The course is private",
                    })
                    raise ImmediateHttpResponse(
                        response=http.HttpForbidden(msg)
                    )
                # Check if course is published
                if not activity.career.published:
                    msg = json.dumps({
                        "status_code": 409,
                        "message": u"The course is unpublished",
                    })
                    raise ImmediateHttpResponse(
                        response=http.HttpConflict(msg)
                    )
                # Create the actual score
                activity_timestamp = datetime.now()
                if request.GET["timestamp"]:
                    try:
                        timestamp = float(request.GET["timestamp"])
                        activity_timestamp = datetime.fromtimestamp(timestamp)
                    except TypeError:
                        pass
                is_passed = request.GET.get("is_passed", "false").lower()
                remaining_attempts = request.GET.get("remaining_attempts",
                                                     None)
                hs = HighScore(player=player,
                               activity=activity,
                               score=request.GET["score"],
                               is_passed=json.loads(is_passed),
                               remaining_attempts=remaining_attempts,
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


class HighScoreResource(Resource):
    code = fields.CharField(attribute='code')
    display_name = fields.CharField(attribute='display_name')
    sum_score = fields.FloatField(attribute='sum_score')
    # career_id = fields.IntegerField(attribute='career_id',blank=False, null=False)
    # level_id = fields.IntegerField(attribute='level_id', blank=False, null=False)
    # top = fields.IntegerField(attribute='top', blank=False, null=False)

    class Meta:
        resource_name = 'top'
        object_class = Player
        # authorization = Authorization()

    # The following methods will need overriding regardless of your
    # data source.
    def detail_uri_kwargs(self, bundle_or_obj):
        kwargs = {}
        return kwargs

    def get_object_list(self, request):
        career_id = request.GET.get("career", None)
        if not career_id:
            return ()
        else:
            level_type = request.GET.get("level_type", None)
            first_n = max(request.GET.get("first_n", 5), 50)
            top_players = get_top_players(
                career=career_id,
                level_type=level_type,
                first_n=first_n,
                exclude_empty_names=False,
            )
            return top_players

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def obj_get(self, bundle, **kwargs):
        return Player.objects.get(pk=kwargs['pk'])

    def dehydrate(self, bundle):
        player_code = bundle.request.GET.get("player_code", None)
        if player_code is not None:
            bundle.data['is_player'] = (bundle.obj.code == player_code)
        else:
            bundle.data['is_player'] = False
        return bundle

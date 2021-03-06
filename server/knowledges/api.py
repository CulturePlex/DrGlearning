import base64
import re
from datetime import datetime
from mimetypes import guess_extension, guess_type

from players.utils import get_top_players
from django.db import models

from django.db.models.fields.files import ImageField
from django.core.files.uploadedfile import SimpleUploadedFile

from tastypie import fields
from tastypie.bundle import Bundle
from tastypie.authentication import BasicAuthentication, ApiKeyAuthentication
from tastypie.authorization import DjangoAuthorization
from tastypie.models import ApiKey
from tastypie.resources import ModelResource, Resource, ALL_WITH_RELATIONS

from tastypie import http
from tastypie.exceptions import ImmediateHttpResponse

from tastypie.resources import NOT_AVAILABLE, ObjectDoesNotExist, NotFound

from tastypie.paginator import Paginator

from activities.api import ActivityUpdateResource
from activities.models import (
    Activity, Quiz, Visual, Temporal, Geospatial, Relational, Linguistic
)
from base.utils import dehydrate_fields, get_oembed
from knowledges.models import Knowledge, Career


def base64_hydrate(hydrated_bundle):
    if hydrated_bundle:
        image_data = hydrated_bundle.data['image']
        # In this point, image_data can be string or SimpleUploadedFile
        if not hasattr(image_data, "name") and image_data[0] != "/":
            base64_match = re.search(r'base64,(.*)', image_data)
            image_type, xxx = guess_type(image_data)
            image_ext = guess_extension(image_type).replace("jpe", "jpg")
            image_str = base64_match.group(1)
            image_name = "{}{}".format(
                datetime.now().strftime("%Y%m%d%H%M%S"),
                image_ext
            )
            uploaded_image = SimpleUploadedFile(
                image_name,
                base64.b64decode(image_str),
                image_type or "application/octet-stream"
            )
            hydrated_bundle.obj.image = uploaded_image
            hydrated_bundle.data['image'] = uploaded_image
    return hydrated_bundle

class ApiTokenResource(ModelResource):
    class Meta:
        queryset = ApiKey.objects.all()
        resource_name = "editor/token"
        include_resource_uri = False
        fields = ["key"]
        list_allowed_methods = ["get"]
        detail_allowed_methods = ["get"]
        authentication = BasicAuthentication()

    def get_list(self, request, **kwargs):
        obj = ApiKey.objects.get(user=request.user)
        bundle = self.build_bundle(obj=obj, request=request)
        bundle = self.full_dehydrate(bundle)
        bundle = self.alter_detail_data_to_serialize(request, bundle)
        return self.create_response(request, bundle)


class KnowledgeResource(ModelResource):

    class Meta:
        queryset = Knowledge.objects.filter(careers__published=True).distinct()
        filtering = {
            "name": ('exact', 'startswith', 'endswith', 'icontains',
                     'contains'),
            "id": ('exact', 'in'),
        }
        list_allowed_methods = ['get']
        detail_allowed_methods = ['get']


class EmbedResource(Resource):

    class Meta:
        resource_name = 'embed'
        include_resource_uri = True

    def alter_detail_data_to_serialize(self, request, data):
        width = request.GET.get("deviceWidth", 200)
        height = request.GET.get("deviceHeight", 200)
        data.data["main_url"] = data.obj.content_url
        if data.obj.content_url:
            data.data["main"] = get_oembed(data.obj.content_url,
                                           maxwidth=width, maxheight=height,
                                           format="json")
        else:
            data.data["main"] = None
        for i in xrange(1, 11):
            level_url = getattr(data.obj, "content_level%s_url" % i)
            data.data["level%s_url" % i] = level_url
            if level_url:
                data.data["level%s" % i] = get_oembed(level_url,
                                                      format="json",
                                                      maxwidth=width,
                                                      maxheight=height)
            else:
                data.data["level%s" % i] = None
            description_level = getattr(data.obj, "description_level%s" % i)
            data.data["level%s_description" % i] = description_level
        # Update downloads
        # TODO: Trello#120
        #data.obj.total_downloads += 1
        #data.obj.save()
        return data

    def obj_get(self, request=None, **kwargs):
        if "pk" in kwargs:
            obj = Career.objects.get(pk=kwargs["pk"])
        else:
            obj = None
        return obj

    def get_resource_uri(self, bundle_or_obj):
        kwargs = {
            'resource_name': self._meta.resource_name,
        }
        if isinstance(bundle_or_obj, Bundle):
            if isinstance(bundle_or_obj.obj, int):
                kwargs['pk'] = bundle_or_obj.obj
            else:
                kwargs['pk'] = bundle_or_obj.obj.pk
        else:
            kwargs['pk'] = bundle_or_obj.id
        if self._meta.api_name is not None:
            kwargs['api_name'] = self._meta.api_name
        return self._build_reverse_url("api_dispatch_detail", kwargs=kwargs)


class CareerResource(ModelResource):
    knowledges = fields.ManyToManyField(KnowledgeResource,
                                        'knowledge_field',
                                        full=True)
    activities = fields.ManyToManyField(ActivityUpdateResource,
                                        'activity_set',
                                        full=True)
    contents = fields.OneToOneField(EmbedResource, 'pk', full=True)

    class Meta:
        filtering = {
            "name": ('exact', 'startswith', 'endswith', 'icontains',
                     'contains'),
            "knowledges": ALL_WITH_RELATIONS,
        }
        queryset = Career.objects.all()
        list_allowed_methods = ['get']
        detail_allowed_methods = ['get']
        # excludes = ["content_url"]
        # for i in xrange(1, 11):
        #     excludes.append("content_level%s_url" % i)
        excludes = ('code', 'content_url',
                    'description_level1', 'content_level1_url',
                    'description_level2', 'content_level2_url',
                    'description_level3', 'content_level3_url',
                    'description_level4', 'content_level4_url',
                    'description_level5', 'content_level5_url',
                    'description_level6', 'content_level6_url',
                    'description_level7', 'content_level7_url',
                    'description_level8', 'content_level8_url',
                    'description_level9', 'content_level9_url',
                    'description_level10', 'content_level10_url')

    def get_object_list(self, request):
        if 'testing' in request.GET:
            return Career.objects.all()
        else:
            return Career.objects.filter(published=True)

    def dehydrate(self, bundle):
        # Career creator name
        bundle.data["creator"] = (bundle.obj.user.get_full_name() or
                                  bundle.obj.user.username)
        # Career size in bytes, and levels
        size = 0
        levels = []
        for activity in bundle.data["activities"]:
            size += activity.obj.size()
            if activity.obj.level_type not in levels:
                levels.append(activity.obj.level_type)
        fields = [f for f in bundle.obj._meta.fields
                  if not isinstance(f, ImageField)]
        for field in fields:
            size += len(unicode(getattr(bundle.obj, field.name)))
        bundle.data["size"] = size
        bundle.data["levels"] = sorted(levels)
        if bundle.obj.code:
            bundle.data["has_code"] = True
        else:
            bundle.data["has_code"] = False
        bundle.obj.code = None
        # bundle.data["contents"]= EmbedResource().get_resource_uri(bundle.obj)
        return dehydrate_fields(bundle)

    def alter_list_data_to_serialize(self, request, data):
        # Filter careers without activities
        careers_objects = data["objects"]
        filtered_careers = [c for c in careers_objects
                            if c.obj.activity_set.count() > 0]
        data["objects"] = filtered_careers
        return data


class EditorKnowledgeResource(ModelResource):

    class Meta:
        queryset = Knowledge.objects.all().distinct()
        filtering = {
            "name": ('exact', 'startswith', 'endswith', 'icontains',
                     'contains'),
            "id": ('exact', 'in'),
        }
        list_allowed_methods = ['get', 'put', 'post']
        detail_allowed_methods = ['get', 'put', 'post']
        resource_name = "editor/knowledge"
        authentication = ApiKeyAuthentication()
        authorization = DjangoAuthorization()


class EditorCareerResource(ModelResource):
    knowledges = fields.ManyToManyField(EditorKnowledgeResource,
                                        'knowledge_field',
                                        full=False)
    activities = fields.ManyToManyField(
        "knowledges.api.EditorActivityResource",
        'activity_set',
        full=True
    )

    class Meta:
        filtering = {
            "name": ('exact', 'startswith', 'endswith', 'icontains',
                     'contains'),
            "knowledges": ALL_WITH_RELATIONS,
        }
        always_return_data = True
        queryset = Career.objects.all()
        list_allowed_methods = ['get', 'put', 'post','delete']
        detail_allowed_methods = ['get', 'put', 'post','delete']
        resource_name = "editor/career"
        authentication = ApiKeyAuthentication()
        authorization = DjangoAuthorization()

    def get_object_list(self, request):
        return super(EditorCareerResource, self).get_object_list(request).filter(user=request.user)

    def dehydrate(self, bundle):
        levels = []
        for activity in bundle.data["activities"]:
            if activity.obj.level_type not in levels:
                levels.append(activity.obj.level_type)
        bundle.data["levels"] = sorted(levels)
        return dehydrate_fields(bundle)

    def hydrate(self, bundle):
        bundle.obj.user = bundle.request.user
        return bundle

class EditorActivityResource(ModelResource):

    career = fields.ForeignKey(EditorCareerResource, 'career', full=False)

    class Meta:
        queryset = Activity.objects.all()
        filtering = {
            "career": ALL_WITH_RELATIONS,
            "level_type": ('exact'),
        }
        list_allowed_methods = ['get', 'put', 'post', 'delete']
        detail_allowed_methods = ['get', 'put', 'post', 'delete']
        resource_name = "editor/activity"
        authentication = ApiKeyAuthentication()
        authorization = DjangoAuthorization()

    def get_object_list(self, request):
        return super(EditorActivityResource, self).get_object_list(request).filter(user=request.user)

    def dehydrate(self, bundle):
        # Set specific activity information
        if hasattr(bundle.obj, "relational"):
            child_obj = bundle.obj.relational
            bundle.data["activity_type"] = "relational"
        elif hasattr(bundle.obj, "temporal"):
            child_obj = bundle.obj.temporal
            bundle.data["activity_type"] = "temporal"
        elif hasattr(bundle.obj, "visual"):
            child_obj = bundle.obj.visual
            bundle.data["activity_type"] = "visual"
        elif hasattr(bundle.obj, "linguistic"):
            child_obj = bundle.obj.linguistic
            bundle.data["activity_type"] = "linguistic"
        elif hasattr(bundle.obj, "quiz"):
            child_obj = bundle.obj.quiz
            bundle.data["activity_type"] = "quiz"
        elif hasattr(bundle.obj, "geospatial"):
            child_obj = bundle.obj.geospatial
            bundle.data["activity_type"] = "geospatial"
        else:
            bundle.data["activity_type"] = "unknown"
            return bundle
        return dehydrate_fields(bundle, child_obj)


class EditorQuizActivityResource(ModelResource):
    career = fields.ForeignKey(EditorCareerResource, 'career', full=False)

    class Meta:
        queryset = Quiz.objects.all()
        filtering = {
            "career": ALL_WITH_RELATIONS,
            "level_type": ('exact'),
        }
        list_allowed_methods = ['get', 'put', 'post']
        detail_allowed_methods = ['get', 'put', 'post']
        resource_name = "editor/quiz"
        authentication = ApiKeyAuthentication()
        authorization = DjangoAuthorization()

    def dehydrate(self, bundle):
        child_obj = bundle.obj.quiz
        return dehydrate_fields(bundle, child_obj)


class EditorVisualActivityResource(ModelResource):
    career = fields.ForeignKey(EditorCareerResource, 'career', full=False)

    class Meta:
        queryset = Visual.objects.all()
        filtering = {
            "career": ALL_WITH_RELATIONS,
            "level_type": ('exact'),
        }
        list_allowed_methods = ['get', 'put', 'post']
        detail_allowed_methods = ['get', 'put', 'post']
        resource_name = "editor/visual"
        authentication = ApiKeyAuthentication()
        authorization = DjangoAuthorization()

    def dehydrate(self, bundle):
        child_obj = bundle.obj.visual
        return dehydrate_fields(bundle, child_obj)

    def hydrate(self, bundle):
        hydrated_bundle = super(EditorVisualActivityResource,
                                self).hydrate(bundle)
        return base64_hydrate(hydrated_bundle)


class EditorTemporalActivityResource(ModelResource):
    career = fields.ForeignKey(EditorCareerResource, 'career', full=False)

    class Meta:
        queryset = Temporal.objects.all()
        filtering = {
            "career": ALL_WITH_RELATIONS,
            "level_type": ('exact'),
        }
        list_allowed_methods = ['get', 'put', 'post']
        detail_allowed_methods = ['get', 'put', 'post']
        resource_name = "editor/temporal"
        authentication = ApiKeyAuthentication()
        authorization = DjangoAuthorization()

    def dehydrate(self, bundle):
        child_obj = bundle.obj.temporal
        return dehydrate_fields(bundle, child_obj)

    def hydrate(self, bundle):
        hydrated_bundle = super(EditorTemporalActivityResource,
                                self).hydrate(bundle)
        return base64_hydrate(hydrated_bundle)


class EditorLinguisticActivityResource(ModelResource):
    career = fields.ForeignKey(EditorCareerResource, 'career', full=False)

    class Meta:
        queryset = Linguistic.objects.all()
        filtering = {
            "career": ALL_WITH_RELATIONS,
            "level_type": ('exact'),
        }
        list_allowed_methods = ['get', 'put', 'post']
        detail_allowed_methods = ['get', 'put', 'post']
        resource_name = "editor/linguistic"
        authentication = ApiKeyAuthentication()
        authorization = DjangoAuthorization()

    def dehydrate(self, bundle):
        child_obj = bundle.obj.linguistic
        return dehydrate_fields(bundle, child_obj)

    def hydrate(self, bundle):
        hydrated_bundle = super(EditorLinguisticActivityResource,
                                self).hydrate(bundle)
        return base64_hydrate(hydrated_bundle)


class EditorGeospatialActivityResource(ModelResource):
    career = fields.ForeignKey(EditorCareerResource, 'career', full=False)

    class Meta:
        queryset = Geospatial.objects.all()
        filtering = {
            "career": ALL_WITH_RELATIONS,
            "level_type": ('exact'),
        }
        list_allowed_methods = ['get', 'put', 'post']
        detail_allowed_methods = ['get', 'put', 'post']
        resource_name = "editor/geospatial"
        authentication = ApiKeyAuthentication()
        authorization = DjangoAuthorization()

    def dehydrate(self, bundle):
        child_obj = bundle.obj.geospatial
        return dehydrate_fields(bundle, child_obj)


class EditorRelationalActivityResource(ModelResource):
    career = fields.ForeignKey(EditorCareerResource, 'career', full=False)

    class Meta:
        queryset = Relational.objects.all()
        filtering = {
            "career": ALL_WITH_RELATIONS,
            "level_type": ('exact'),
        }
        list_allowed_methods = ['get', 'put', 'post']
        detail_allowed_methods = ['get', 'put', 'post']
        resource_name = "editor/relational"
        authentication = ApiKeyAuthentication()
        authorization = DjangoAuthorization()

    def dehydrate(self, bundle):
        child_obj = bundle.obj.relational
        return dehydrate_fields(bundle, child_obj)


class ScoresObject(object):

    def __init__(self, scores=None):
        self.scores = scores


class TopScoresResource(Resource):
    scores = fields.ListField(attribute='scores')

    class Meta:
        resource_name = 'topscores'
        object_class = ScoresObject
        authentication = ApiKeyAuthentication()
        authorization = DjangoAuthorization()
        paginator_class = Paginator

    def detail_uri_kwargs(self, bundle_or_obj):
        kwargs = {}

        if isinstance(bundle_or_obj, Bundle):
            kwargs['pk'] = bundle_or_obj.obj.uuid
        else:
            kwargs['pk'] = bundle_or_obj.uuid
        return kwargs

    def obj_get(self, bundle, **kwargs):
        # TODO: Put the career_id as a GET parameter
        career_id = bundle.request.path_info.split("/")[4]
        top_players = get_top_players(career=career_id,
                                      exclude_empty_names=False)
        scores = []
        for top_player in top_players:
            top_player_name = (
                top_player.display_name or top_player.email or top_player.code
            )
            scores.append({
                "name": top_player_name,
                "sum_score": top_player.sum_score,
            })
        return ScoresObject(scores=scores)

    def get_resource_uri(self, bundle_or_obj):
        return bundle_or_obj.request.path_info
        
class DaysObject(object):

    def __init__(self, days=None):
        self.days = days

class DaysResource(Resource):
    days = fields.ListField(attribute='days')

    class Meta:
        resource_name = 'days'
        object_class = DaysObject
        authentication = ApiKeyAuthentication()
        authorization = DjangoAuthorization()
        paginator_class = Paginator

    def detail_uri_kwargs(self, bundle_or_obj):
        kwargs = {}

        if isinstance(bundle_or_obj, Bundle):
            kwargs['pk'] = bundle_or_obj.obj.uuid
        else:
            kwargs['pk'] = bundle_or_obj.uuid
        return kwargs

    def obj_get(self, bundle, **kwargs):
        # TODO: Put the career_id as a GET parameter
        career_id = bundle.request.path_info.split("/")[4]
        #stats_days = get_top_players(career=career_id,
        #                              exclude_empty_names=False)
        days = []
        #for stats_day in stats_days:
        #    day_number = stats_day.day_number
        #    day_attempts = stats_day.day_attempts
        #    days.append({
        #        "day": day_number,
        #        "sum_score": day_attempts,
        #    })
        days.append({
                "day": 0,
                "num_attempts": 7,
            })
        days.append({
                "day": 1,
                "num_attempts": 17,
            })
        days.append({
                "day": 2,
                "num_attempts": 72,
            })
        days.append({
                "day": 3,
                "num_attempts": 17,
            })
        days.append({
                "day": 4,
                "num_attempts": 87,
            })
        days.append({
                "day": 5,
                "num_attempts": 74,
            })
        days.append({
                "day": 6,
                "num_attempts": 12,
            })
        return DaysObject(days=days)

    def get_resource_uri(self, bundle_or_obj):
        return bundle_or_obj.request.path_info
        
class HoursObject(object):

    def __init__(self, hours=None):
        self.hours = hours

class HoursResource(Resource):
    hours = fields.ListField(attribute='hours')

    class Meta:
        resource_name = 'hours'
        object_class = HoursObject
        authentication = ApiKeyAuthentication()
        authorization = DjangoAuthorization()
        paginator_class = Paginator

    def detail_uri_kwargs(self, bundle_or_obj):
        kwargs = {}

        if isinstance(bundle_or_obj, Bundle):
            kwargs['pk'] = bundle_or_obj.obj.uuid
        else:
            kwargs['pk'] = bundle_or_obj.uuid
        return kwargs

    def obj_get(self, bundle, **kwargs):
        # TODO: Put the career_id as a GET parameter
        career_id = bundle.request.path_info.split("/")[4]
        #stats_days = get_top_players(career=career_id,
        #                              exclude_empty_names=False)
        hours = []
        #for stats_hour in stats_hours:
        #    hour_time = stats_day.day_number
        #    hour_attempts = stats_day.day_attempts
        #    hours.append({
        #        "day": day_number,
        #        "sum_score": day_attempts,
        #    })
        hours.append({
                "time": "12:01:00",
                "num_attempts": 7,
            })
        hours.append({
                "time": "12:11:00",
                "num_attempts": 17,
            })
        hours.append({
                "time": "12:01:00",
                "num_attempts": 72,
            })
        hours.append({
                "time": "13:01:00",
                "num_attempts": 17,
            })
        hours.append({
                "time": "13:01:00",
                "num_attempts": 87,
            })
        hours.append({
                "time": "14:01:00",
                "num_attempts": 74,
            })
        hours.append({
                "time": "14:01:00",
                "num_attempts": 12,
            })
        hours.append({
                "time": "15:01:00",
                "num_attempts": 7,
            })
        hours.append({
                "time": "16:11:00",
                "num_attempts": 17,
            })
        hours.append({
                "time": "16:01:00",
                "num_attempts": 72,
            })
        hours.append({
                "time": "17:01:00",
                "num_attempts": 17,
            })
        hours.append({
                "time": "17:01:00",
                "num_attempts": 87,
            })
        hours.append({
                "time": "18:01:00",
                "num_attempts": 74,
            })
        hours.append({
                "time": "18:01:00",
                "num_attempts": 12,
            })
        hours.append({
                "time": "20:01:00",
                "num_attempts": 7,
            })
        hours.append({
                "time": "21:11:00",
                "num_attempts": 17,
            })
        hours.append({
                "time": "21:17:00",
                "num_attempts": 72,
            })
        hours.append({
                "time": "22:01:00",
                "num_attempts": 17,
            })
        hours.append({
                "time": "22:01:00",
                "num_attempts": 87,
            })
        hours.append({
                "time": "22:11:00",
                "num_attempts": 74,
            })
        hours.append({
                "time": "23:01:00",
                "num_attempts": 12,
            })
        hours.append({
                "time": "23:01:00",
                "num_attempts": 7,
            })
        hours.append({
                "time": "23:11:00",
                "num_attempts": 17,
            })
        hours.append({
                "time": "23:01:00",
                "num_attempts": 72,
            })
        hours.append({
                "time": "23:01:00",
                "num_attempts": 17,
            })
        return HoursObject(hours=hours)

    def get_resource_uri(self, bundle_or_obj):
        return bundle_or_obj.request.path_info

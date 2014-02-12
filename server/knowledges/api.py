from hashlib import sha1

from django.db.models.fields.files import ImageField
from django.http import HttpResponse

from tastypie import fields
from tastypie.bundle import Bundle
from tastypie.resources import ModelResource, Resource, ALL_WITH_RELATIONS

from activities.api import ActivityUpdateResource
from base.utils import dehydrate_fields, get_oembed
from knowledges.models import Knowledge, Career
from tastypie.exceptions import NotFound
from tastypie.authentication import BasicAuthentication, ApiKeyAuthentication
from tastypie.authorization import DjangoAuthorization
from tastypie.models import ApiKey


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
        #if kwargs["pk"] != "auth":
        #    raise NotImplementedError("Resource not found")
        print 'addddd'
        obj = ApiKey.objects.get(user=request.user)
        #import ipdb
        #ipdb.set_trace()
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
        height= request.GET.get("deviceHeight", 200)
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
        bundle.data["creator"] = bundle.obj.user.get_full_name() or \
                                                    bundle.obj.user.username
        # Career size in bytes, and levels
        size = 0
        levels = []
        for activity in bundle.data["activities"]:
            size += activity.obj.size()
            if activity.obj.level_type not in levels:
                levels.append(activity.obj.level_type)
        fields = [f for f in bundle.obj._meta.fields if not isinstance(f, ImageField)]
        for field in fields:
            size += len(unicode(getattr(bundle.obj, field.name)))
        bundle.data["size"] = size
        bundle.data["levels"] = sorted(levels)
        if bundle.obj.code:
            bundle.data["has_code"] = True
        else:
            bundle.data["has_code"] = False
        bundle.obj.code = None
        # bundle.data["contents"] = EmbedResource().get_resource_uri(bundle.obj)
        return dehydrate_fields(bundle)

    def alter_list_data_to_serialize(self, request, data):
        # Filter careers without activities
        careers_objects = data["objects"]
        filtered_careers = [c for c in careers_objects \
                if c.obj.activity_set.count() > 0]
        data["objects"] = filtered_careers
        return data


class EditorCareerResource(ModelResource):
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
        list_allowed_methods = ['get','put']
        detail_allowed_methods = ['get','put']
        resource_name = "editor/career"
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
        authentication = ApiKeyAuthentication()
        authorization = DjangoAuthorization()
        max_limit = None

    def get_object_list(self, request):
        if 'testing' in request.GET:
            return Career.objects.all()
        else:
            return Career.objects.filter(published=True)

    def dispatch(self, request_type, request, **kwargs):
        # required_fields = ('code', )
        response = super(EditorCareerResource, self).dispatch(request_type,
                                                      request,
                                                      **kwargs)
        # Carrer protected by code
        if ("pk" in kwargs and "code" in request.GET and
                "callback" in request.GET):
            career = Career.objects.get(pk=kwargs["pk"])
            if sha1(career.code).hexdigest() != request.GET.get("code", ""):
                return HttpResponse("Resource protected by code", status=401)
        return response

    def dehydrate(self, bundle):
        # Career creator name
        bundle.data["creator"] = bundle.obj.user.get_full_name() or \
                                                    bundle.obj.user.username
        # Career size in bytes, and levels
        size = 0
        levels = []
        for activity in bundle.data["activities"]:
            size += activity.obj.size()
            if activity.obj.level_type not in levels:
                levels.append(activity.obj.level_type)
        fields = [f for f in bundle.obj._meta.fields if not isinstance(f, ImageField)]
        for field in fields:
            size += len(unicode(getattr(bundle.obj, field.name)))
        bundle.data["size"] = size
        bundle.data["levels"] = sorted(levels)
        if bundle.obj.code:
            bundle.data["has_code"] = True
        else:
            bundle.data["has_code"] = False
        bundle.obj.code = None
        # bundle.data["contents"] = EmbedResource().get_resource_uri(bundle.obj)
        return dehydrate_fields(bundle)

    def alter_list_data_to_serialize(self, request, data):
        # Filter careers without activities
        careers_objects = data["objects"]
        filtered_careers = [c for c in careers_objects \
                if c.obj.activity_set.count() > 0]
        data["objects"] = filtered_careers
        return data

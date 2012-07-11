from django.db.models.fields.files import ImageField

from tastypie import fields
from tastypie.resources import ModelResource, ALL_WITH_RELATIONS

from activities.api import ActivityUpdateResource
from base.utils import dehydrate_fields, get_oembed
from knowledges.models import Knowledge, Career


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


class CareerResource(ModelResource):
    knowledges = fields.ManyToManyField(KnowledgeResource,
                                        'knowledge_field',
                                        full=True)
    activities = fields.ManyToManyField(ActivityUpdateResource,
                                        'activity_set',
                                        full=True)

    class Meta:
        filtering = {
            "name": ('exact', 'startswith', 'endswith', 'icontains',
                     'contains'),
            "knowledges": ALL_WITH_RELATIONS,
        }
        queryset = Career.objects.all()
        list_allowed_methods = ['get']
        detail_allowed_methods = ['get']

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
        return dehydrate_fields(bundle)

    def alter_detail_data_to_serialize(self, request, data):
        width = request.GET.get("deviceWidth", 200)
        height= request.GET.get("deviceHeight", 200)
        if data.data["content_url"]:
            data.data["content"] = get_oembed(data.data["content_url"],
                                              maxwidth=width, maxheight=height,
                                              format="json")
        else:
            data.data["content"] = None
        for i in xrange(1, 11):
            level_url = data.data["content_level%s_url" % i]
            if level_url:
                data.data["content_level%s" % i] = get_oembed(level_url,
                                                              format="json",
                                                              maxwidth=width,
                                                              maxheight=height)
            else:
                data.data["content_level%s" % i] = None
        return data

    def alter_list_data_to_serialize(self, request, data):
        # Filter careers without activities
        careers_objects = data["objects"]
        filtered_careers = [c for c in careers_objects \
                if c.obj.activity_set.count() > 0]
        data["objects"] = filtered_careers
        return data

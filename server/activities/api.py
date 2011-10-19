from tastypie import fields
from tastypie.resources import ModelResource


from activities.models import Activity, Level, Relational

class ActivityResource(ModelResource):

    class Meta:
        queryset = Activity.objects.all()


class RelationalResource(ModelResource):
    class Meta:
        queryset = Relational.objects.all()


class LevelResource(ModelResource):
    activity = fields.ForeignKey(ActivityResource, 'activity')
    #relational_activity = fields.ForeignKey(RelationalResource, 'activity')

    class Meta:
        queryset = Level.objects.all()

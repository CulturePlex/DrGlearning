# -*- coding: utf-8 -*-
from django.conf import settings
from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin

from tastypie.api import Api

from knowledges.api import KnowledgeResource, CareerResource, EmbedResource, EditorCareerResource, ApiTokenResource, EditorActivityResource, EditorKnowledgeResource, EditorQuizActivityResource, EditorTemporalActivityResource
from activities.api import ActivityResource, ActivityUpdateResource
from players.api import ScoreResource, PlayerResource, HighScoreResource
# from admin import admin_site
admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(KnowledgeResource())
v1_api.register(CareerResource())
v1_api.register(EmbedResource())
v1_api.register(ActivityResource())
v1_api.register(ActivityUpdateResource())
v1_api.register(PlayerResource())
v1_api.register(ScoreResource())
v1_api.register(HighScoreResource())
v1_api.register(EditorKnowledgeResource())
v1_api.register(EditorCareerResource())
v1_api.register(EditorActivityResource())
v1_api.register(EditorQuizActivityResource())
v1_api.register(EditorTemporalActivityResource())
v1_api.register(ApiTokenResource())

urlpatterns = patterns('',
    url(r'^grappelli/', include('grappelli.urls')),

    # base
     url(r'^', include('base.urls')),
#    url(r'^', include(admin.site.urls)),

    # mining
    url(r'^mining/', include('mining.urls')),

    # accounts
    url(r'^accounts/', include('accounts.urls')),
    url(r'^accounts/', include('userena.urls')),

    # i18n
    url(r'^i18n/', include('django.conf.urls.i18n')),

    # messaging
    url(r'^messages/', include('userena.contrib.umessages.urls')),

    # knowledge
    url(r'^knowledges/', include('knowledges.urls')),

    # api
    (r'^api/', include(v1_api.urls)),

    # admin_media
    url(r'^admin/', include(admin.site.urls)),
    # url(r'^admin/', include(admin_site.urls)),
)

urlpatterns += patterns('django.contrib.flatpages.views',
    url(r'^support/$', 'flatpage', {'url': '/support/'}, name='support'),
)

if settings.DEBUG:
    urlpatterns += patterns('',

        # static server
        url(r'^static/(?P<path>.*)$', 'django.views.static.serve',
            {'document_root': settings.STATIC_ROOT}),

        # static media server
        url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
            {'document_root': settings.MEDIA_ROOT}),
   )

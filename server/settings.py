# -*- coding: utf-8 -*-
from os import path

from django.utils.translation import gettext_lazy as _

DEBUG = True
TEMPLATE_DEBUG = DEBUG
ugettext = lambda s: s

PROJECT_NAME = u"Dr. Glearning"
PROJECT_ROOT = path.dirname(path.abspath(__file__))
GRAPPELLI_ADMIN_TITLE = PROJECT_NAME

ADMINS = (
    ('CulturePlex Lab', 'admins@cultureplex.ca'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.spatialite', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': path.join(PROJECT_ROOT, 'drglearning.sqlite'),          # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/Toronto'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-ca'
LANGUAGES = (
  ('en', ugettext('English')),
# Not spanish for the time being
#  ('es', ugettext('Español')),
)

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = path.join(PROJECT_ROOT, 'media')

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = '/media/'

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = path.join(PROJECT_ROOT, 'static')

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/static/'

# URL prefix for admin static files -- CSS, JavaScript and images.
# Make sure to use a trailing slash.
# Examples: "http://foo.com/static/admin/", "/static/admin/".
#ADMIN_MEDIA_PREFIX = '/static/admin/'
ADMIN_MEDIA_PREFIX = STATIC_URL + "grappelli/"

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = '9s-ja-w*5/4+asw9e58gfa-*4f58e+9r5gdf4584*nttqq_pr6'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    # "django.core.context_processors.auth",
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.request",
    "django.core.context_processors.csrf",
    "base.context_processors.project_name",
    "base.context_processors.current_date",
    "base.context_processors.google_api_key",
    "base.context_processors.google_analytics_code",
    "base.context_processors.debug",
    "base.context_processors.logout",
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'base64imagesizer.middleware.Base64ImageSizer'
)

ROOT_URLCONF = 'urls'

TEMPLATE_DIRS = (
    # Override brand
    path.join(PROJECT_ROOT, 'base', 'templates'),
)

INSTALLED_APPS = (
    'grappelli',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django.contrib.admindocs',
    'userena',
    'userena.contrib.umessages',
    'django.contrib.gis',
    'guardian',
    'easy_thumbnails',
    'sorl.thumbnail',
    'base',
    'accounts',
    'knowledges',
    'activities',
    'players',
    'south',
    'tastypie',
    'olwidget',
)

AUTHENTICATION_BACKENDS = (
    'userena.backends.UserenaAuthenticationBackend',
    'guardian.backends.ObjectPermissionBackend',
    'django.contrib.auth.backends.ModelBackend',
)

SESSION_COOKIE_NAME = "drglearning"
LANGUAGE_COOKIE_NAME = SESSION_COOKIE_NAME + "_language"

ANONYMOUS_USER_ID = -1
AUTH_PROFILE_MODULE = "accounts.UserProfile"
LOGIN_REDIRECT_URL = '/dashboard/' # '/accounts/%(username)s/'
LOGIN_URL = '/accounts/signin/'
LOGOUT_URL = '/accounts/signout/'

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

# Userena settings
USERENA_DEFAULT_PRIVACY = "open"
USERENA_DISABLE_PROFILE_LIST = False
USERENA_WITHOUT_USERNAMES = True
USERENA_LANGUAGE_FIELD = "language"
USERENA_SIGNIN_REDIRECT_URL = LOGIN_REDIRECT_URL

# Accounts settings
ACCOUNT_FREE = {
    "name": "Free account",
    "type": 1,  # Free
    "careers": 10,
    "storage": 100,
}

#API KEYS
GOOGLE_API = "http://maps.google.com/maps/api/js?v=3&sensor=false"
GOOGLE_API_KEY = 'AIzaSyD1ibezws-sdp2Suvn97eSakILyQsY8Wno'
GOOGLE_ANALYTICS_CODE = "UA-1613313-11"

EMULATOR_URL = "http://beta.drglearning.com/client/"

try:
    from local_settings import *
except ImportError:
    pass

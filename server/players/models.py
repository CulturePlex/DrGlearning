import datetime
import hashlib

from django.db import models
from django.conf import settings

from base.utils import image_resize
from activities.models import Activity


class Player(models.Model):
    code = models.CharField(unique=True, max_length=128)
    display_name = models.CharField(max_length=30, blank=True)
    email = models.CharField(max_length=30, blank=True)
    image = models.ImageField(upload_to="images", null=True, blank=True)
    token = models.CharField(max_length=128, default="")

    def __unicode__(self):
        return self.code

    def save(self, *args, **kwargs):
        self = image_resize(self)
        if not self.id and self.code and not self.token:
            token_key = u"%s-%s-%s" \
                        % (settings.SECRET_KEY,
                           datetime.datetime.now().isoformat(),
                           self.id)
            token = hashlib.sha512(token_key).hexdigest()
            self.token = token
        super(Player, self).save(*args, **kwargs)


class HighScore(models.Model):
    player = models.ForeignKey(Player)
    activity = models.ForeignKey(Activity)
    timestamp = models.DateTimeField(auto_now=True)
    activity_timestamp = models.DateTimeField(null=True, blank=True)
    score = models.FloatField()

    def __unicode__(self):
        return u"%.2f %s (%s)" % (self.score, self.player, self.activity)

import datetime
import hashlib
import jsonfield

from django.db import models
from django.conf import settings

from activities.models import Activity


class Player(models.Model):
    code = models.CharField(unique=True, max_length=128)
    display_name = models.CharField(max_length=30, blank=True)
    email = models.CharField(max_length=30, blank=True)
    image = models.ImageField(upload_to="images", null=True, blank=True)
    token = models.CharField(max_length=128, default="")
    options = jsonfield.JSONField(default=u'{}')

    def __unicode__(self):
        return self.code

    def save(self, *args, **kwargs):
        if not self.id and self.code and not self.token:
            token_key = u"%s-%s-%s" \
                        % (settings.SECRET_KEY,
                           datetime.datetime.now().isoformat(),
                           self.id)
            token = hashlib.sha512(token_key).hexdigest()
            self.token = token
        super(Player, self).save(*args, **kwargs)

    def get_name(self):
        if self.display_name and self.email:
            return u"{0} ({1})".format(self.display_name, self.email)
        elif self.display_name or self.email:
            return u"{0}".format(self.display_name or self.email)
        else:
            return u"{0}...".format(self.code[:10])


class HighScore(models.Model):
    player = models.ForeignKey(Player)
    activity = models.ForeignKey(Activity)
    timestamp = models.DateTimeField(auto_now=True)
    activity_timestamp = models.DateTimeField(null=True, blank=True)
    score = models.FloatField()
    is_passed = models.NullBooleanField(null=True, blank=True)

    def __unicode__(self):
        return u"%.2f %s (%s)" % (self.score, self.player.get_name(),
                                  self.activity)

    class Meta:
        ordering = ['score']

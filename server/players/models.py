from django.db import models

from base.utils import image_resize
from activities.models import Activity


class Player(models.Model):
    code = models.CharField(unique=True, max_length=100)
    display_name = models.CharField(max_length=30, blank=True)
    email = models.CharField(max_length=30, blank=True)
    image = models.ImageField(upload_to="images", null=True)

    def __unicode__(self):
        return self.code

    def save(self, *args, **kwargs):
        self = image_resize(self)
        super(Player, self).save(*args, **kwargs)


class HighScore(models.Model):
    player = models.ForeignKey(Player)
    activity = models.ForeignKey(Activity)
    timestamp = models.DateTimeField(auto_now=True)
    score = models.FloatField()

    def __unicode__(self):
        return "%.2f %s (%s)" % (self.score, self.player, self.activity)

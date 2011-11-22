from django.contrib import admin

from players.models import Player, HighScore

admin.site.register(Player)
admin.site.register(HighScore)

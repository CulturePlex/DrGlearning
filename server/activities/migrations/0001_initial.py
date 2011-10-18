# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'Activity'
        db.create_table('activities_activity', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('language_code', self.gf('django.db.models.fields.CharField')(max_length=20)),
        ))
        db.send_create_signal('activities', ['Activity'])

        # Adding model 'Level'
        db.create_table('activities_level', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('activity', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['activities.Activity'])),
            ('career', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['knowledges.Career'])),
            ('type', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
            ('order', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('required', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal('activities', ['Level'])

        # Adding model 'Relational'
        db.create_table('activities_relational', (
            ('activity_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['activities.Activity'], unique=True, primary_key=True)),
            ('graph', self.gf('django.db.models.fields.files.FileField')(max_length=100)),
            ('queries', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal('activities', ['Relational'])

        # Adding model 'VisualMemory'
        db.create_table('activities_visualmemory', (
            ('activity_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['activities.Activity'], unique=True, primary_key=True)),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
            ('right_options', self.gf('django.db.models.fields.TextField')()),
            ('wrong_options', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal('activities', ['VisualMemory'])

        # Adding model 'GeospatialAreas'
        db.create_table('activities_geospatialareas', (
            ('activity_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['activities.Activity'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('activities', ['GeospatialAreas'])

        # Adding model 'AfterBefore'
        db.create_table('activities_afterbefore', (
            ('activity_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['activities.Activity'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('activities', ['AfterBefore'])

        # Adding model 'HangmanPuzzle'
        db.create_table('activities_hangmanpuzzle', (
            ('activity_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['activities.Activity'], unique=True, primary_key=True)),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
            ('question', self.gf('django.db.models.fields.TextField')()),
            ('answer', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal('activities', ['HangmanPuzzle'])


    def backwards(self, orm):
        
        # Deleting model 'Activity'
        db.delete_table('activities_activity')

        # Deleting model 'Level'
        db.delete_table('activities_level')

        # Deleting model 'Relational'
        db.delete_table('activities_relational')

        # Deleting model 'VisualMemory'
        db.delete_table('activities_visualmemory')

        # Deleting model 'GeospatialAreas'
        db.delete_table('activities_geospatialareas')

        # Deleting model 'AfterBefore'
        db.delete_table('activities_afterbefore')

        # Deleting model 'HangmanPuzzle'
        db.delete_table('activities_hangmanpuzzle')


    models = {
        'activities.activity': {
            'Meta': {'object_name': 'Activity'},
            'career': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'activities'", 'symmetrical': 'False', 'through': "orm['activities.Level']", 'to': "orm['knowledges.Career']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language_code': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        'activities.afterbefore': {
            'Meta': {'object_name': 'AfterBefore', '_ormbases': ['activities.Activity']},
            'activity_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['activities.Activity']", 'unique': 'True', 'primary_key': 'True'})
        },
        'activities.geospatialareas': {
            'Meta': {'object_name': 'GeospatialAreas', '_ormbases': ['activities.Activity']},
            'activity_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['activities.Activity']", 'unique': 'True', 'primary_key': 'True'})
        },
        'activities.hangmanpuzzle': {
            'Meta': {'object_name': 'HangmanPuzzle', '_ormbases': ['activities.Activity']},
            'activity_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['activities.Activity']", 'unique': 'True', 'primary_key': 'True'}),
            'answer': ('django.db.models.fields.TextField', [], {}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'question': ('django.db.models.fields.TextField', [], {})
        },
        'activities.level': {
            'Meta': {'ordering': "['order']", 'object_name': 'Level'},
            'activity': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['activities.Activity']"}),
            'career': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['knowledges.Career']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'order': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'required': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'type': ('django.db.models.fields.PositiveSmallIntegerField', [], {})
        },
        'activities.relational': {
            'Meta': {'object_name': 'Relational', '_ormbases': ['activities.Activity']},
            'activity_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['activities.Activity']", 'unique': 'True', 'primary_key': 'True'}),
            'graph': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            'queries': ('django.db.models.fields.TextField', [], {})
        },
        'activities.visualmemory': {
            'Meta': {'object_name': 'VisualMemory', '_ormbases': ['activities.Activity']},
            'activity_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['activities.Activity']", 'unique': 'True', 'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'right_options': ('django.db.models.fields.TextField', [], {}),
            'wrong_options': ('django.db.models.fields.TextField', [], {})
        },
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        'auth.permission': {
            'Meta': {'ordering': "('content_type__app_label', 'content_type__model', 'codename')", 'unique_together': "(('content_type', 'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'knowledges.career': {
            'Meta': {'object_name': 'Career'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'knowledge_field': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'knowledge_fields'", 'symmetrical': 'False', 'to': "orm['knowledges.Knowledge']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"})
        },
        'knowledges.knowledge': {
            'Meta': {'object_name': 'Knowledge'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        }
    }

    complete_apps = ['activities']

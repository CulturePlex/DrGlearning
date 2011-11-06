# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Deleting model 'Level'
        db.delete_table('activities_level')

        # Adding field 'Activity.career'
        db.add_column('activities_activity', 'career', self.gf('django.db.models.fields.related.ForeignKey')(default=1, to=orm['knowledges.Career']), keep_default=False)

        # Adding field 'Activity.level_type'
        db.add_column('activities_activity', 'level_type', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=1), keep_default=False)

        # Adding field 'Activity.level_order'
        db.add_column('activities_activity', 'level_order', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True), keep_default=False)

        # Adding field 'Activity.level_required'
        db.add_column('activities_activity', 'level_required', self.gf('django.db.models.fields.BooleanField')(default=True), keep_default=False)


    def backwards(self, orm):
        
        # Adding model 'Level'
        db.create_table('activities_level', (
            ('career', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['knowledges.Career'])),
            ('required', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('activity', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['activities.Activity'])),
            ('type', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
            ('order', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
        ))
        db.send_create_signal('activities', ['Level'])

        # Deleting field 'Activity.career'
        db.delete_column('activities_activity', 'career_id')

        # Deleting field 'Activity.level_type'
        db.delete_column('activities_activity', 'level_type')

        # Deleting field 'Activity.level_order'
        db.delete_column('activities_activity', 'level_order')

        # Deleting field 'Activity.level_required'
        db.delete_column('activities_activity', 'level_required')


    models = {
        'activities.activity': {
            'Meta': {'object_name': 'Activity'},
            'career': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['knowledges.Career']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language_code': ('django.db.models.fields.CharField', [], {'max_length': '2'}),
            'level_order': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'level_required': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'level_type': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'query': ('django.db.models.fields.TextField', [], {}),
            'timestamp': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        'activities.geospatial': {
            'Meta': {'object_name': 'Geospatial', '_ormbases': ['activities.Activity']},
            'activity_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['activities.Activity']", 'unique': 'True', 'primary_key': 'True'}),
            'area': ('django.contrib.gis.db.models.fields.PolygonField', [], {}),
            'points': ('django.contrib.gis.db.models.fields.MultiPointField', [], {}),
            'radius': ('django.db.models.fields.FloatField', [], {})
        },
        'activities.linguistic': {
            'Meta': {'object_name': 'Linguistic', '_ormbases': ['activities.Activity']},
            'activity_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['activities.Activity']", 'unique': 'True', 'primary_key': 'True'}),
            'answer': ('django.db.models.fields.TextField', [], {}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'locked_text': ('django.db.models.fields.TextField', [], {})
        },
        'activities.relational': {
            'Meta': {'object_name': 'Relational', '_ormbases': ['activities.Activity']},
            'activity_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['activities.Activity']", 'unique': 'True', 'primary_key': 'True'}),
            'constraints': ('jsonfield.fields.JSONField', [], {'default': "'[]'"}),
            'graph_edges': ('jsonfield.fields.JSONField', [], {'default': "'[]'"}),
            'graph_nodes': ('jsonfield.fields.JSONField', [], {'default': "'{}'"}),
            'scored_nodes': ('jsonfield.fields.JSONField', [], {'default': "'{}'"}),
            'source_path': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'target_path': ('django.db.models.fields.CharField', [], {'max_length': '30'})
        },
        'activities.temporal': {
            'Meta': {'object_name': 'Temporal', '_ormbases': ['activities.Activity']},
            'activity_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['activities.Activity']", 'unique': 'True', 'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'image_datetime': ('django.db.models.fields.DateTimeField', [], {}),
            'query_datetime': ('django.db.models.fields.DateTimeField', [], {})
        },
        'activities.visual': {
            'Meta': {'object_name': 'Visual', '_ormbases': ['activities.Activity']},
            'activity_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['activities.Activity']", 'unique': 'True', 'primary_key': 'True'}),
            'answers': ('django.db.models.fields.TextField', [], {}),
            'correct_answer': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'obfuscated_image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'time': ('django.db.models.fields.CharField', [], {'max_length': '10'})
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
            'description': ('django.db.models.fields.TextField', [], {'default': "''"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'knowledge_field': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'knowledge_fields'", 'symmetrical': 'False', 'to': "orm['knowledges.Knowledge']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'negative_votes': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'positive_votes': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'timestamp': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"})
        },
        'knowledges.knowledge': {
            'Meta': {'object_name': 'Knowledge'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        }
    }

    complete_apps = ['activities']

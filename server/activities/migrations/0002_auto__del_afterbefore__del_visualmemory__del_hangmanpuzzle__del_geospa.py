# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Deleting model 'AfterBefore'
        db.delete_table('activities_afterbefore')

        # Deleting model 'VisualMemory'
        db.delete_table('activities_visualmemory')

        # Deleting model 'HangmanPuzzle'
        db.delete_table('activities_hangmanpuzzle')

        # Deleting model 'GeospatialAreas'
        db.delete_table('activities_geospatialareas')

        # Adding model 'Linguistic'
        db.create_table('activities_linguistic', (
            ('activity_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['activities.Activity'], unique=True, primary_key=True)),
            ('locked_text', self.gf('django.db.models.fields.TextField')()),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
            ('answer', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal('activities', ['Linguistic'])

        # Adding model 'Geospatial'
        db.create_table('activities_geospatial', (
            ('activity_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['activities.Activity'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('activities', ['Geospatial'])

        # Adding model 'Temporal'
        db.create_table('activities_temporal', (
            ('activity_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['activities.Activity'], unique=True, primary_key=True)),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
            ('image_datetime', self.gf('django.db.models.fields.DateTimeField')()),
            ('query_datetime', self.gf('django.db.models.fields.DateTimeField')()),
        ))
        db.send_create_signal('activities', ['Temporal'])

        # Adding model 'Visual'
        db.create_table('activities_visual', (
            ('activity_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['activities.Activity'], unique=True, primary_key=True)),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
            ('obfuscated_image', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
            ('answers', self.gf('django.db.models.fields.TextField')()),
            ('correct_answer', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('time', self.gf('django.db.models.fields.CharField')(max_length=10)),
        ))
        db.send_create_signal('activities', ['Visual'])

        # Deleting field 'Relational.graph'
        db.delete_column('activities_relational', 'graph')

        # Deleting field 'Relational.queries'
        db.delete_column('activities_relational', 'queries')

        # Adding field 'Relational.graph_nodes'
        db.add_column('activities_relational', 'graph_nodes', self.gf('django.db.models.fields.TextField')(default=''), keep_default=False)

        # Adding field 'Relational.graph_edges'
        db.add_column('activities_relational', 'graph_edges', self.gf('django.db.models.fields.TextField')(default=''), keep_default=False)

        # Adding field 'Relational.source_path'
        db.add_column('activities_relational', 'source_path', self.gf('django.db.models.fields.CharField')(default='', max_length=30), keep_default=False)

        # Adding field 'Relational.target_path'
        db.add_column('activities_relational', 'target_path', self.gf('django.db.models.fields.CharField')(default='', max_length=30), keep_default=False)

        # Adding field 'Relational.scored_nodes'
        db.add_column('activities_relational', 'scored_nodes', self.gf('django.db.models.fields.TextField')(default=''), keep_default=False)

        # Adding field 'Activity.timestamp'
        db.add_column('activities_activity', 'timestamp', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, default=datetime.datetime(2011, 10, 25, 16, 56, 48, 99542), blank=True), keep_default=False)

        # Adding field 'Activity.query'
        db.add_column('activities_activity', 'query', self.gf('django.db.models.fields.TextField')(default=''), keep_default=False)

        # Changing field 'Activity.language_code'
        db.alter_column('activities_activity', 'language_code', self.gf('django.db.models.fields.CharField')(max_length=2))


    def backwards(self, orm):
        
        # Adding model 'AfterBefore'
        db.create_table('activities_afterbefore', (
            ('activity_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['activities.Activity'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('activities', ['AfterBefore'])

        # Adding model 'VisualMemory'
        db.create_table('activities_visualmemory', (
            ('right_options', self.gf('django.db.models.fields.TextField')()),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
            ('activity_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['activities.Activity'], unique=True, primary_key=True)),
            ('wrong_options', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal('activities', ['VisualMemory'])

        # Adding model 'HangmanPuzzle'
        db.create_table('activities_hangmanpuzzle', (
            ('answer', self.gf('django.db.models.fields.TextField')()),
            ('question', self.gf('django.db.models.fields.TextField')()),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
            ('activity_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['activities.Activity'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('activities', ['HangmanPuzzle'])

        # Adding model 'GeospatialAreas'
        db.create_table('activities_geospatialareas', (
            ('activity_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['activities.Activity'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('activities', ['GeospatialAreas'])

        # Deleting model 'Linguistic'
        db.delete_table('activities_linguistic')

        # Deleting model 'Geospatial'
        db.delete_table('activities_geospatial')

        # Deleting model 'Temporal'
        db.delete_table('activities_temporal')

        # Deleting model 'Visual'
        db.delete_table('activities_visual')

        # User chose to not deal with backwards NULL issues for 'Relational.graph'
        raise RuntimeError("Cannot reverse this migration. 'Relational.graph' and its values cannot be restored.")

        # User chose to not deal with backwards NULL issues for 'Relational.queries'
        raise RuntimeError("Cannot reverse this migration. 'Relational.queries' and its values cannot be restored.")

        # Deleting field 'Relational.graph_nodes'
        db.delete_column('activities_relational', 'graph_nodes')

        # Deleting field 'Relational.graph_edges'
        db.delete_column('activities_relational', 'graph_edges')

        # Deleting field 'Relational.source_path'
        db.delete_column('activities_relational', 'source_path')

        # Deleting field 'Relational.target_path'
        db.delete_column('activities_relational', 'target_path')

        # Deleting field 'Relational.scored_nodes'
        db.delete_column('activities_relational', 'scored_nodes')

        # Deleting field 'Activity.timestamp'
        db.delete_column('activities_activity', 'timestamp')

        # Deleting field 'Activity.query'
        db.delete_column('activities_activity', 'query')

        # Changing field 'Activity.language_code'
        db.alter_column('activities_activity', 'language_code', self.gf('django.db.models.fields.CharField')(max_length=20))


    models = {
        'activities.activity': {
            'Meta': {'object_name': 'Activity'},
            'career': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'activities'", 'symmetrical': 'False', 'through': "orm['activities.Level']", 'to': "orm['knowledges.Career']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language_code': ('django.db.models.fields.CharField', [], {'max_length': '2'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'query': ('django.db.models.fields.TextField', [], {}),
            'timestamp': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        'activities.geospatial': {
            'Meta': {'object_name': 'Geospatial', '_ormbases': ['activities.Activity']},
            'activity_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['activities.Activity']", 'unique': 'True', 'primary_key': 'True'})
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
            'graph_edges': ('django.db.models.fields.TextField', [], {}),
            'graph_nodes': ('django.db.models.fields.TextField', [], {}),
            'scored_nodes': ('django.db.models.fields.TextField', [], {}),
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
            'description': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '1000'}),
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

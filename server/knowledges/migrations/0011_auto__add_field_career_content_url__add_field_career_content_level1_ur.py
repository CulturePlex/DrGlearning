# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding field 'Career.content_url'
        db.add_column('knowledges_career', 'content_url', self.gf('django.db.models.fields.TextField')(default='', null=True, blank=True), keep_default=False)

        # Adding field 'Career.content_level1_url'
        db.add_column('knowledges_career', 'content_level1_url', self.gf('django.db.models.fields.TextField')(default='', null=True, blank=True), keep_default=False)

        # Adding field 'Career.content_level2_url'
        db.add_column('knowledges_career', 'content_level2_url', self.gf('django.db.models.fields.TextField')(default='', null=True, blank=True), keep_default=False)

        # Adding field 'Career.content_level3_url'
        db.add_column('knowledges_career', 'content_level3_url', self.gf('django.db.models.fields.TextField')(default='', null=True, blank=True), keep_default=False)

        # Adding field 'Career.content_level4_url'
        db.add_column('knowledges_career', 'content_level4_url', self.gf('django.db.models.fields.TextField')(default='', null=True, blank=True), keep_default=False)

        # Adding field 'Career.content_level5_url'
        db.add_column('knowledges_career', 'content_level5_url', self.gf('django.db.models.fields.TextField')(default='', null=True, blank=True), keep_default=False)

        # Adding field 'Career.content_level6_url'
        db.add_column('knowledges_career', 'content_level6_url', self.gf('django.db.models.fields.TextField')(default='', null=True, blank=True), keep_default=False)

        # Adding field 'Career.content_level7_url'
        db.add_column('knowledges_career', 'content_level7_url', self.gf('django.db.models.fields.TextField')(default='', null=True, blank=True), keep_default=False)

        # Adding field 'Career.content_level8_url'
        db.add_column('knowledges_career', 'content_level8_url', self.gf('django.db.models.fields.TextField')(default='', null=True, blank=True), keep_default=False)

        # Adding field 'Career.content_level9_url'
        db.add_column('knowledges_career', 'content_level9_url', self.gf('django.db.models.fields.TextField')(default='', null=True, blank=True), keep_default=False)

        # Adding field 'Career.content_level10_url'
        db.add_column('knowledges_career', 'content_level10_url', self.gf('django.db.models.fields.TextField')(default='', null=True, blank=True), keep_default=False)


    def backwards(self, orm):
        
        # Deleting field 'Career.content_url'
        db.delete_column('knowledges_career', 'content_url')

        # Deleting field 'Career.content_level1_url'
        db.delete_column('knowledges_career', 'content_level1_url')

        # Deleting field 'Career.content_level2_url'
        db.delete_column('knowledges_career', 'content_level2_url')

        # Deleting field 'Career.content_level3_url'
        db.delete_column('knowledges_career', 'content_level3_url')

        # Deleting field 'Career.content_level4_url'
        db.delete_column('knowledges_career', 'content_level4_url')

        # Deleting field 'Career.content_level5_url'
        db.delete_column('knowledges_career', 'content_level5_url')

        # Deleting field 'Career.content_level6_url'
        db.delete_column('knowledges_career', 'content_level6_url')

        # Deleting field 'Career.content_level7_url'
        db.delete_column('knowledges_career', 'content_level7_url')

        # Deleting field 'Career.content_level8_url'
        db.delete_column('knowledges_career', 'content_level8_url')

        # Deleting field 'Career.content_level9_url'
        db.delete_column('knowledges_career', 'content_level9_url')

        # Deleting field 'Career.content_level10_url'
        db.delete_column('knowledges_career', 'content_level10_url')


    models = {
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
            'Meta': {'unique_together': "(('name', 'user'),)", 'object_name': 'Career'},
            'career_type': ('django.db.models.fields.CharField', [], {'default': "'explore'", 'max_length': '20'}),
            'content_level10_url': ('django.db.models.fields.TextField', [], {'default': "''", 'null': 'True', 'blank': 'True'}),
            'content_level1_url': ('django.db.models.fields.TextField', [], {'default': "''", 'null': 'True', 'blank': 'True'}),
            'content_level2_url': ('django.db.models.fields.TextField', [], {'default': "''", 'null': 'True', 'blank': 'True'}),
            'content_level3_url': ('django.db.models.fields.TextField', [], {'default': "''", 'null': 'True', 'blank': 'True'}),
            'content_level4_url': ('django.db.models.fields.TextField', [], {'default': "''", 'null': 'True', 'blank': 'True'}),
            'content_level5_url': ('django.db.models.fields.TextField', [], {'default': "''", 'null': 'True', 'blank': 'True'}),
            'content_level6_url': ('django.db.models.fields.TextField', [], {'default': "''", 'null': 'True', 'blank': 'True'}),
            'content_level7_url': ('django.db.models.fields.TextField', [], {'default': "''", 'null': 'True', 'blank': 'True'}),
            'content_level8_url': ('django.db.models.fields.TextField', [], {'default': "''", 'null': 'True', 'blank': 'True'}),
            'content_level9_url': ('django.db.models.fields.TextField', [], {'default': "''", 'null': 'True', 'blank': 'True'}),
            'content_url': ('django.db.models.fields.TextField', [], {'default': "''", 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'default': "''"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'knowledge_field': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'careers'", 'symmetrical': 'False', 'to': "orm['knowledges.Knowledge']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'negative_votes': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'positive_votes': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'published': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'timestamp': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"})
        },
        'knowledges.genuineuser': {
            'Meta': {'object_name': 'GenuineUser', '_ormbases': ['auth.User']},
            'has_authenticity': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'institution_url': ('django.db.models.fields.CharField', [], {'max_length': '80'}),
            'user_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['auth.User']", 'unique': 'True', 'primary_key': 'True'})
        },
        'knowledges.knowledge': {
            'Meta': {'object_name': 'Knowledge'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        }
    }

    complete_apps = ['knowledges']

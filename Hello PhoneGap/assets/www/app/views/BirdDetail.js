aplic.views.BirdDetail = Ext.extend(Ext.Panel, {

	styleHtmlContent:true,
	scroll: 'vertica l',
	items: [{
		tpl:[
		'<tpl name>',
		'<div class="field"><span class="label">{name} </span></div>',
		'</tpl>',
		'<tpl latin>',
		'<div class="field"><span class="label">{latin} </span></div>',
		'</tpl>',
		'<tpl imagen>',
		'<div class="field"><span class="label"><img src="img/aves/{imagen}" width="60%"> </span></div>',
		'</tpl>',
		'<tpl texto>',
		'<div class="field"><span class="label">{texto} </span></div>',
		'</tpl>',
		]
	}

	],
	updateWithRecord: function(record) {
		Ext.each(this.items.items, function(item) {
			item.update(record.data);
		});
		var toolbar = this.getDockedItems()[0];
		//toolbar.setTitle(record.get('name') + ' ' + record.get('breed'));
		//toolbar.getComponent('edit').record = record;
	},
});
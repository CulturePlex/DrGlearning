Ext.define('DrGlearning.view.CareerDescription', {
    extend: 'Ext.Panel',
	xtype: 'careerdescription',
    

    config: {
        layout: 'fit',
        defaults: {
            flex: 1
        },
		html:'Aquí va a ir la descripción churrita'
    },
	updateWithRecord: function(record) {
		Ext.each(this.items.items, function(item) {
			item.update(record.data);
		});
		var toolbar = this.getDockedItems()[0];
		//toolbar.setTitle(record.get('name') + ' ' + record.get('breed'));
		//toolbar.getComponent('edit').record = record;
	},
});
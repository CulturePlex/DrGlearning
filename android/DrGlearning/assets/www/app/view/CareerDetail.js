Ext.define('DrGlearning.view.CareerDetail', {
    extend: 'Ext.Panel',
	xtype: 'careerdetail',
    requires: [
		'DrGlearning.view.CareerDescription',
		'DrGlearning.model.Level',
		'DrGlearning.store.Levels'
    ],
    config: {
    	career:null,
        layout: 'vbox',
        defaults: {
            flex: 1
        },
        items: [
		{
           xtype: 'careerdescription',
        },
        {
        	xtype: 'carousel',
            ui: 'light',
            direction: 'horizontal',
			items:[{
				html:'Nivel 1:Iletrado'
			}]
    	}]
	}
});
Ext.define('DrGlearning.view.CareerDetail', {
    extend: 'Ext.Panel',
	xtype: 'careerdetail',
    requires: [
		'DrGlearning.view.CareerDescription',
		'DrGlearning.model.Level',
		'DrGlearning.store.Levels'
    ],
	listeners : {
	    render : function(c) {
	        c.getEl().on('click', function(){ console.log('asd'); }, c);
	    }
	},
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
	}],
	},
	
});
Ext.define('DrGlearning.view.LevelDetail', {
    extend: 'Ext.Panel',
	xtype: 'leveldetail',
    requires: [
		'DrGlearning.view.LevelDescription'
    ],
    config: {
    	career:null,
        layout: 'vbox',
        defaults: {
            flex: 1
        },
        items: [
		{
           xtype: 'leveldescription',
           flex: 1,
           
        },
        {
        	xtype: 'carousel',
            ui: 'light',
            direction: 'horizontal',
            items: [{
		        html: 'Actividad 1: Geospatial'
		    }, {
		        html: 'Actividad 2: Relational'
		    }, {
		        html: 'Actividad 3: Linguistic'
		    }, {
		        html: 'Actividad 4: Visual'
		    }, {
		        html: 'Actividad 5: Temporal'
		    }]
        }	
		]
    },
    updateLevel: function(newLevel) {
        var description = this.down('leveldescription');
        
        
    },
});
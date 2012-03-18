Ext.define('DrGlearning.view.LevelDetail', {
    extend: 'Ext.Panel',
	xtype: 'leveldetail',
    requires: [
		'DrGlearning.view.LevelDescription',
    ],
    config: {
        layout: 'vbox',
        defaults: {
            flex: 1
        },
        items: [
		{
           xtype: 'leveldescription',
        },
        {
        	xtype: 'carousel',
            //ui: 'light',
            direction: 'horizontal',
    	}	
		]
    }
});
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
		   height:'20%'
        },
        {
			ui:'activities',
        	xtype: 'list',
			customId:'activitiesList',
			store:'Activities',
			disableSelection: true,
			itemTpl: new Ext.XTemplate(
		    '<tpl for=".">',
				'<tpl if= "successful == true">',
					'<div style="background-color:#90EE90;">',
							'<div><b>{name}</b></div>',
							'<font size="3" color="grey">{query} </font>',
					'</div>',
				'</tpl>',
				'<tpl if= "successful == false">',
					'<div>',
							'<div><b>{name}</b></div>',
							'<font size="3" color="grey">{query} </font>',
					'</div>',
				'</tpl>',
		    '</tpl>'
		),
    	}	
		]
    }
});
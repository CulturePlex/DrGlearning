Ext.define('DrGlearning.view.CareersFrame', {
    extend: 'Ext.Container',
    xtype: 'careersframe',
    config: {
    	fullscreen: true,
        items: [
            {
            xtype: 'toolbar',
            docked: 'top',
            items: [{
                xtype: 'spacer'
            }, {
                xtype: 'title',
                title: i18n.gettext("Dr. Glearning"),
            }, {
                xtype: 'spacer'
            }]
        }, {
            xtype: 'toolbar',
            docked: 'top',
			ui:'neutral',
            id: 'toolbarTopNormal',
            items: [{
                xtype: 'selectfield',
                name: 'state',
				width: '40%',
                options: [ {
                    text: i18n.gettext('All'),
                    value: 'all'
                },
				{
                    text: i18n.gettext('In progress'),
                    value: 'inProgress'
                }, 
				{
                    text: i18n.gettext('Not Yet'),
                    value: 'notYet'
                }]
            }, {
                xtype: 'spacer'
            }, {
                xtype: 'button',
                text: i18n.gettext('Add Career'),
                id: 'addCareer'
            }]
        
        }, {
            xtype: 'toolbar',
            docked: 'top',
            id: 'toolbarTopAdd',
			ui:'neutral',
            items: [{
                xtype: 'searchfield',
                placeHolder: 'Search',
				width: '40%',
                name: 'searchfield',
                id: 'searchbox',
            }, {
                xtype: 'spacer'
            }, {
                xtype: 'selectfield',
                name: 'knnowledge_field',
				width: '40%', 
                options: []
            }, ]
        
        }, {
            xtype: 'toolbar',
            docked: 'bottom',
            id: 'toolbarBottomAdd',
            items: [{
                xtype: 'button',
                name: 'back',
                id: 'back',
				text: i18n.gettext('Back'),
				ui: 'back'
            }]
        
        },{
            xtype: 'careerslistempty',
			layout: 'vbox',
			items:[{xtype:'spacer'},
					{xtype:'container',
					layout: 'hbox',		
					items: [
						{xtype:'spacer'},
						{
							xtype:'panel',
							html:'<p align="center" >'+i18n.gettext("No careers installed, click on Add Career Button to start")+'</p>'
						},
						{xtype:'spacer'}
					]},
					{xtype:'container',
					layout: 'hbox',		
					items: [
						{xtype:'spacer'},
						{
							xtype:'button',
							text:i18n.gettext('Add Career'),
							width:'150px',
							align:'center',
							customId:'addCareer'
						},	
						{xtype:'spacer'}
					]},
					
					{xtype:'spacer'}
				]
        },{
            xtype: 'careerslist',
        },{
            xtype: 'toolbar',
            docked: 'bottom',
            
            layout: {
                type: 'hbox',
                pack:'center',
                align: 'center'
            },
            id: 'toolbarBottomSettings',
            items: [{
                id: 'settings',
               	text: i18n.gettext('Settings'),
            	xtype:'button',
				
            	//xtype:'panel',
				//html:'<font color="white">'+i18n.gettext('CulturePlex Lab.')+'</font>',
            	
            },
			{
                id: 'updateAll',
               	text: i18n.gettext('Update all'),
            	xtype:'button',
				
            	//xtype:'panel',
				//html:'<font color="white">'+i18n.gettext('CulturePlex Lab.')+'</font>',
            	
            }]
        
        }
        ],
        
        layout: 'fit'
    }
});

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
                title: 'Dr. Glearning',
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
                    text: 'All',
                    value: 'all'
                },
				{
                    text: 'In progress',
                    value: 'inProgress'
                }, 
				{
                    text: 'Not Yet',
                    value: 'notYet'
                }]
            }, {
                xtype: 'spacer'
            }, {
                xtype: 'button',
                text: 'Add Career',
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
                options: [{
                    text: 'Mathematics',
                    value: 'both'
                }, {
                    text: 'Physics',
                    value: 'male'
                }]
            }, ]
        
        }, {
            xtype: 'toolbar',
            docked: 'bottom',
            id: 'toolbarBottomAdd',
            items: [{
                xtype: 'button',
                name: 'back',
                id: 'back',
				text: 'back',
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
							text:'Add Career',
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
                type: 'vbox',
                pack:'center',
                align: 'center'
            },
            id: 'toolbarBottomSettings',
            items: [{
                //id: 'settings',
               	//text: 'Settings',
				xtype:'panel',
				html:'<font color="white">CulturePlex Lab.</font>',

            }]
        
        }
        
        /*{
        	xtype: 'tabpanel',
        	docked: 'bottom',
        	tabBar: {
                docked: 'bottom',
                layout: {
                    pack: 'center'
                }
            },
            defaults: {
                scrollable: true
            },
            items: [
                {
                    title: 'About',
                    iconCls: 'info',
                    cls: 'card1'
                },
                {
                    title: 'Favorites',
                    iconCls: 'favorites',
                    cls: 'card2'
                }
            ]
        	
        }*/],
        
        layout: 'fit'
    }
});

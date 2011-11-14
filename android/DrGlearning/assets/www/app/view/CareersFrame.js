Ext.define('DrGlearning.view.CareersFrame', {
    extend: 'Ext.Container',
    xtype: 'careersframe',
    requires: ['DrGlearning.view.CareersList', ],
    config: {
        items: [{
            xtype: 'toolbar',
            ui: 'green',
            docked: 'top',
            items: [{
                xtype: 'spacer'
            }, {
                xtype: 'title',
                title: 'Dr. Glearning'
            }, {
                xtype: 'spacer'
            }]
        }, {
            xtype: 'toolbar',
            docked: 'top',
            ui: 'gray',
            id: 'toolbarTopNormal',
            items: [{
                xtype: 'selectfield',
                name: 'state',
				
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
            ui: 'gray',
            id: 'toolbarTopAdd',
            items: [{
                xtype: 'searchfield',
                placeHolder: 'Search',
                name: 'searchfield',
                id: 'searchbox',
            }, {
                xtype: 'spacer'
            }, {
                xtype: 'selectfield',
                name: 'knnowledge_field',
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
            ui: 'gray',
            id: 'toolbarBottomAdd',
            items: [{
                xtype: 'button',
                name: 'back',
                id: 'back',
				text: 'back',
				ui: 'back'
            }]
        
        }, {
            xtype: 'careerslist'
        }],
        
        layout: 'fit'
    }
});

Ext.define('DrGlearning.view.ActivityFrame', {
    extend: 'Ext.Container',
    xtype: 'activityframe',
    
    config: {
        fullscreen: true,
        items: [
            {
                ref: 'toolbar',
                xtype: 'toolbar',
                docked: 'top',
                name: 'up',
                items: [
                    {
                        xtype: 'title',
                        customId: 'title',
                        name: 'title',
                        title: i18n.gettext('Activity Name'),
                        centered: true
                    }
                ]
            },
            {
                xtype:'panel',
                id:'activity',
                customId:'activity'
            }
            
        ],

        layout: 'fit'
    }
});

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
                        title: 'Activity Name',
						width: '100%',
						centered: true
                    }
                ]
            },
			{
				xtype:'component',
				id:'activity',
				customId:'activity'
			}
			
        ],

        layout: 'fit'
    }
});
Ext.define('DrGlearning.view.ActivityFrame', {
    extend: 'Ext.Container',
	xtype: 'activityframe',
    
	config: {
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
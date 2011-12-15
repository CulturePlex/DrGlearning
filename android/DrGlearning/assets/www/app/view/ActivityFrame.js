Ext.define('DrGlearning.view.ActivityFrame', {
    extend: 'Ext.Container',
	xtype: 'activityframe',
    requires: [
		'DrGlearning.view.activities.ActivityContent',	
    ],
	config: {
        items: [
            {
				ref: 'toolbar',
                xtype: 'toolbar',
                ui   : 'green',
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
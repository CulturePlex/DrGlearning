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
                    { xtype: 'spacer', width: 35 },
                    { xtype: 'spacer' },
                    {
                        xtype: 'title',
						id: 'title',
						name: 'title',
                        title: 'Activity Name'
                    },
                    { xtype: 'spacer' }
                  
                ]
            },
			{
				xtype:'component',
				id:'activity'
			}
			
        ],

        layout: 'fit'
    }
});
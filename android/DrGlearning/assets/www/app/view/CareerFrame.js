Ext.define('DrGlearning.view.CareerFrame', {
    extend: 'Ext.Container',
	xtype: 'careerframe',
    requires: [
		'DrGlearning.view.CareerDetail',	
    ],
	config: {
        items: [
            {
				ref: 'toolbar',
                xtype: 'toolbar',
                docked: 'top',
				name: 'up',
                items: [
                    { xtype: 'spacer', width: 35 },
                    { xtype: 'spacer' },
                    {
                        xtype: 'title',
						id: 'title',
						name: 'title',
                        title: 'Career Name'
                    },
                    { xtype: 'spacer' }
                  
                ]
            },
			{
                xtype: 'toolbar',
                docked: 'bottom',
                items:[
                    {
                        xtype: 'button',
						id: 'backToCareers',
                        text: 'Back',
						ui:'back',
                        
                    },
					{
						 xtype: 'spacer' 
					},
					{
                        xtype: 'button',
                        text: 'Start',
						id: 'startLevel'
                        
                    }
					]
                
            },
			{
				xtype: 'careerdetail',
				
				
			}
        ],

        layout: 'fit'
    }
});
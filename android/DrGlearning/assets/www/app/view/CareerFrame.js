Ext.define('DrGlearning.view.CareerFrame', {
    extend: 'Ext.Container',
	xtype: 'careerframe',
    requires: [
		'DrGlearning.view.CareerDetail',	
    ],
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
						id: 'title',
						name: 'title',
                        title: 'Career Name',
						maxWidth: '100%',
						centered:true,
                    },
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
						id: 'startLevel',
						customId: 'startLevel'
                        
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
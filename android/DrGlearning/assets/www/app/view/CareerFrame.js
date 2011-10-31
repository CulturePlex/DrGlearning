Ext.define('DrGlearning.view.CareerFrame', {
    extend: 'Ext.Container',
	xtype: 'careerframe',
    requires: [
		'DrGlearning.view.CareerDetail',	
		
		'DrGlearning.view.CareerDescription'
    ],
	config: {
        items: [
            {
                xtype: 'toolbar',
                ui   : 'green',
                docked: 'top',
                items: [
                    { xtype: 'spacer', width: 35 },
                    { xtype: 'spacer' },
                    {
                        xtype: 'title',
                        title: 'Career Name'
                    },
                    { xtype: 'spacer' }
                  
                ]
            },
			{
                xtype: 'toolbar',
                docked: 'bottom',
                ui: 'gray',
                items:[
                    {
                        xtype: 'button',
						id: 'back',
                        text: 'Back',
						ui:'back',
						controller: 'DrGlearning.controller.Career',
						action: 'index',
                        
                    },
					{
						 xtype: 'spacer' 
					},
					{
                        xtype: 'button',
                        text: 'Start',
                        
                    },
					{
						xtype: 'spacer' 
					},
                    {
                        xtype: 'button',
                        text: 'Add Career'
                    }
					]
                
            },
			{
				xtype: 'careerdetail'
			}
        ],

        layout: 'fit'
    }
});
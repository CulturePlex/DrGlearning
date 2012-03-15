Ext.define('DrGlearning.view.LevelFrame', {
    extend: 'Ext.Container',
	xtype: 'levelframe',
    requires: [
		'DrGlearning.view.LevelDetail',	
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
						id: 'backtolevels',
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
						id: 'startActivity'
                        
                  	}
					]
                
            },
			{
				xtype: 'leveldetail',
			}
        ],

        layout: 'fit'
    }
});
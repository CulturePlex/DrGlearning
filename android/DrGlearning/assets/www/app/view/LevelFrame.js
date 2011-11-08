Ext.define('DrGlearning.view.LevelFrame', {
    extend: 'Ext.Container',
	xtype: 'levelframe',
    requires: [
		'DrGlearning.view.LevelDetail',	
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
						id: 'backtocareer',
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
						id: 'startLevel'
                        
                  	}
					]
                
            },
			{
				xtype: 'leveldetail',
			}
        ],

        layout: 'fit'
    },
	updateCareerAndLevel: function(newCareer,newLevel) {
		var detail= this.down('leveldetail');
		detail.updateLevel(newLevel);
		this.down('title[id=title]').setTitle(newCareer.data.name);
    },
});
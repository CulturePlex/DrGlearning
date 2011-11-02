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
						id: 'back',
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
                        
                    },
					{
						xtype: 'spacer' 
					},
                    {
                        xtype: 'button',
                        text: 'Add Career',
						id: 'addCareer'
                    }
					]
                
            },
			{
				xtype: 'careerdetail',
				
				
			}
        ],

        layout: 'fit'
    },
	updateCareer: function(newCareer) {
		var detail= this.down('careerdetail');
		detail.updateCareer(newCareer);
		this.down('title[id=title]').setTitle(newCareer.data.name);
    },
});
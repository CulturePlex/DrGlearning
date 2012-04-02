Ext.define('DrGlearning.view.activities.Linguistic', {

    extend: 'Ext.Panel',
    xtype: 'linguistic',
    config: {
        id: 'activity',
        customId: 'activity',
        fullscreen: true,
		scrollable:true,
        layout: 'vbox',
        items: [
							{
							    xtype: 'toolbar',
								ui:'neutral',
								customId: 'query',
								name: 'query',
							},	
                     		{
                	        	xtype: 'panel',
                	        	id: 'image',
                	        	customId: 'image',
                	        },{
								xtype: 'fieldset',
								layout: 'hbox',
								items: [
								        {
								        	xtype: 'label',
								        	html: 'TIP: ',
								        	flex: 0
								        },{
								        	xtype: 'label',
								        	customId: 'loqued',
								        	flex: 1
								        }]
                	        },{
										xtype: 'fieldset',
										title: 'Insert a character:',
										layout: 'hbox',
										items: [
									    {
									        xtype: 'textfield',
									        customId: 'letter',
									        name: 'letter',
									        maxLength: 1,
									        width: '80%',
									        flex: 0
									    },{
			        						xtype: 'button',
			        						customId: 'try',
			        						text: 'Try',
			        						width: '20%',
			        						flex: 1
			        					}
									    ]
									},
        		            {
        		                xtype: 'label',
        		                customId: 'responses',
        		            },
        		            
        		            
        		           
                	   
            
			{
                xtype: 'toolbar',
                docked: 'bottom',
                items:[
                    {
						xtype: 'button',
						customId: 'backtolevel',
						text: 'Back',
						ui: 'back',
						controller: 'DrGlearning.controller.Career',
						action: 'index'
					},
					{
						 xtype: 'spacer' 
					},{
						xtype: 'button',
						customId: 'solve',
						text: 'Solve',
					},
					]
                
            }
		]
    },


});

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
                xtype: 'container',
                docked: 'top',
                ui: 'neutral',
				customId: 'query',
				layout: {
		            type: 'hbox',
					pack : 'center' 
		        },

            },
                     		{
                	        	xtype: 'panel',
                	        	id: 'image',
                	        	customId: 'image',
                	        	margin: 10,
                	        },{
								xtype: 'container',
								layout: 'hbox',
								items: [
								        {
								        	xtype: 'label',
								        	html: 'TIP: ',
								        	margin: 10,
								        	
								        },{
								        	xtype: 'label',
								        	customId: 'loqued',
								        	margin: 10,
								        	
								        }]
                	        },{
										xtype: 'container',
										layout: 'hbox',
										items: [
										{
									        xtype: 'textfield',
									        customId: 'letter',
									        name: 'letter',
									        label: 'CHAR:',
									        labelWidth: '40%',
									        maxLength: 1,
									        width: '60%',
									        margin: 10,
									        flex: 2
									    },{
			        						xtype: 'button',
			        						customId: 'try',
			        						text: 'Try',
			        						flex: 1,
			        						margin: 10,
			        						width: '20%'
			        							
			        					}
									    ]
									},
        		            {
        		                xtype: 'label',
        		                customId: 'responses',
        		                margin: 10,
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

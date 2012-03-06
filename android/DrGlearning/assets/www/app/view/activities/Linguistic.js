Ext.define('DrGlearning.view.activities.Linguistic', {
    
    extend: 'Ext.Panel',
    xtype : 'linguistic',
    config: {
        id:'activity',
        customId:'activity',
        fullscreen: true,
        layout: 'vbox',
        items: [
							{
							    xtype: 'label',
								customId: 'query',
								name: 'query',
							    title: 'Error'
							},	
                     		{
                	        	xtype: 'panel',
                	        	customId: 'image',
                	        	layout: 'vbox',
                	        	/*items: [
                	        	        {
                	        	        	xtype: 'panel',
                            	        	customId: 'image2',
                            	        	layout: 'hbox',
                            	        	items:[{xtype: 'label',html:'hola'},{xtype: 'label',html:'hola'},{xtype: 'label',html:'hola'}
                            	        	       ]
                	        		    },{
                	        	        	xtype: 'panel',
                            	        	customId: 'image3',
                            	        	layout: 'hbox',
                            	        	items:[{xtype: 'label',html:'hola'},{xtype: 'label',html:'hola'},{xtype: 'label',html:'hola'}
                            	        	      
                            	        	      ]
                	        		    } 
                	        	        
                	        	        ]*/
                			},{
        		                xtype: 'label',
        		                customId: 'loqued',
        		            },{
        		            	xtype: 'fieldset',
        		            	title: 'Insert a character:',
        		            	items: [
        		                {
        		                    xtype: 'textfield',
        		                    customId: 'letter',
        		                    name: 'letter',
        		                    maxLength: 1,
        		                },
        		                ]
        		            },{
        		                xtype: 'label',
        		                customId: 'responses',
        		            },{
        						xtype: 'button',
        						customId: 'try',
        						text: 'Try',
        					}
        		            
        		            
        		           
                	   
            ,
			{
                xtype: 'toolbar',
                docked: 'bottom',
                ui: 'gray',
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
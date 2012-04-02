Ext.define('DrGlearning.view.activities.Relational', {

	extend : 'Ext.Container',
	xtype : 'relational',
	customId:'activity',
	config : {
		id:'activity',
		customId:'activity',
	   layout : {
       type: 'vbox',
       align: 'middle'
   },
		fullscreen : true,
		scrollable: true,
		items : [ {
			xtype : 'panel',
			id : 'contentSencha',
			customId : 'contentSencha',
			layout : 'fit',
			fullscreen : true,
			initialize : function() {
				/*var sketch=Ext.getCmp('contentSencha').getEl();
				
				//Initializing Canvas and sketch
                //var canvas = document.getElementById("sketch");
                //var p = new Processing(canvas, sketchProc);

				//console.log("cargada!!!!!");
				//console.log(this.element.dom);
				//console.log(this.down("canvas"));
				//console.log(this.getEl().down('[class="pako"'));
				if(sketch==undefined){
					//console.log("Pero no existe :C");
				}else{
					//console.log("Y tenemos un canvas!!!");
				}
				//prueba();*/
			}
		}, 
		{
                xtype: 'container',
                docked: 'top',
                ui: 'neutral',
				customId: 'query',
				layout: {
		            type: 'hbox',
					pack : 'center' 
		        },

				height:60,
                               
            },{
			xtype : 'toolbar',
			docked : 'bottom',
			items : [ {
				xtype : 'button',
				text : 'Back',
				ui : 'back',
				customId: 'backtolevel',
				controller : 'DrGlearning.controller.Career',
				action : 'index'
			}, {
				xtype : 'spacer'
			} ]

		},
		{
			xtype : 'toolbar',
			docked : 'bottom',
			ui:'neutral',
			customId:'constraintsbar',
			 defaults: {
                iconMask: true
            }
		},
		{
			xtype : 'container',
			docked : 'bottom',
			ui:'neutral',
			customId:'scorebar',
			 defaults: {
                iconMask: true
            }
		}
		 ]
	}
});

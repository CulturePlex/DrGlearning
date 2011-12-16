Ext.define('DrGlearning.view.activities.Relational', {

	extend : 'Ext.Panel',
	xtype : 'relational',
	customId:'activity',
	config : {
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
				var sketch=Ext.getCmp('contentSencha').getEl();
				
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
				//prueba();
			}
		}, {
			xtype : 'toolbar',
			docked : 'top',
			ui : 'gray',
			items : [ {
				xtype : 'label',
				id : 'query',
				name : 'query',
				title : 'Relational Test',
				
			} ]

		}, {
			xtype : 'toolbar',
			docked : 'bottom',
			ui : 'gray',
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

		} ]
	}
});

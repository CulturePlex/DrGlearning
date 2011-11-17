Ext.define('DrGlearning.view.activities.Relational', {

	extend : 'Ext.Panel',
	xtype : 'relational',
	config : {
		layout : 'fit',
		fullscreen : true,
		items : [ {
			xtype : 'panel',
			id : 'contentSencha',
			layout : 'fit',
			fullscreen : true,
			onRender : function() {
				var sketch=Ext.getCmp('contentSencha').getEl();
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
			},
		}, {
			xtype : 'toolbar',
			docked : 'top',
			ui : 'gray',
			items : [ {
				xtype : 'title',
				id : 'query',
				name : 'query',
				title : 'Relational Test'
			} ]

		}, {
			xtype : 'toolbar',
			docked : 'bottom',
			ui : 'gray',
			items : [ {
				xtype : 'button',
				id : 'backtolevel',
				text : 'Back',
				ui : 'back',
				controller : 'DrGlearning.controller.Career',
				action : 'index',
			}, {
				xtype : 'spacer'
			} ]

		} ]
	},

});
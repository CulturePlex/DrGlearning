aplic.views.CareersInstalledView = Ext.extend(Ext.Panel, {
	dockedItems: [{
		xtype: 'toolbar',
		items: [{
			xtype: 'selectfield',
			name:'estado',
			options:[{
				text:'In Progress',
				value:'comun'
			},{
				text:'No Yet',
				value:'cientifico',
			}],
			width:170

		},{
            text: 'Add Career',
            ui: 'normal',
            
        }
		

		]
	}],
	layout: 'card',

	cardSwitchAnimation: 'slide',
	initComponent: function() {
		//put instances of cards into app.views namespace
		Ext.apply(aplic.views, {
			careersList: new aplic.views.CareersList(),
			
		});

		//put instances of cards into viewport
		Ext.apply(this, {
			items: [
			aplic.views.careersList,
			]
		});
		console.log('Dentro de Marco: ' + aplic.views);
		aplic.views.CareersInstalledView.superclass.initComponent.apply(this, arguments);
	}
});
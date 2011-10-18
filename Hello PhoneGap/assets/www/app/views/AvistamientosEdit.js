aplic.views.AvistamientosEdit = Ext.extend(Ext.form.FormPanel, {

	listeners: {
		body: {
			//delegate: '#as', //bind to the underlying el property on the panel
			tap: function(e) {
				if(e.target.name=='fecha') {
					aplic.controllers.dateTimePicker.show();
				}
				if(e.target.name=='nombreAve') {
					Ext.dispatch({
						controller: aplic.controllers.avistamientos,
						action: 'seleccionaraveEdit',
						animation: {
							type:'slide',
							direction:'left'
						}
					});
				}
				
				if(e.target.className=='x-button-label') {
					Ext.dispatch({
						controller: aplic.controllers.avistamientos,
						edit:true,
						action: 'abrirMapa',
						animation: {
							type:'slide',
							direction:'left',
							
						}
					});
				}
				console.log(e);

			}
		}
	},
	scroll:'vertical',
	dockedItems: [{
		xtype: 'toolbar',
		title: 'Avistamiento',
		items: [{
			id: 'saliredit',
			text: 'Cancel',
			ui: 'back',
			listeners: {
				'tap': function () {
					Ext.dispatch({
						controller: aplic.controllers.avistamientos,
						action: 'volveradetail',
						animation: {
							type:'slide',
							direction:'right'
						}
					});
				}
			}
		},{
			xtype:'spacer'
		},{
			id: 'salvaredit',
			text: 'Guardar',
			ui: 'action',
			listeners: {
				'tap': function () {
					Ext.dispatch({
						controller: aplic.controllers.avistamientos,
						action: 'salvar',
						animation: {
							type:'slide',
							direction:'right'
						}
					});
				}
			}
		}
		]
	}],
	submitOnAction: true,

	items: [{
		name : 'idAve',
		label: 'Ave',
		xtype: 'hiddenfield',
		message: 'nombre de ave incorrecto'
	},{
		name : 'imagenAve',
		label: 'Ave',
		xtype: 'hiddenfield',
		message: 'nombre de ave incorrecto'
	},{
		name : 'nombreAve',
		label: 'Ave',
		disabled: 'disabled',
		disabledCls:'',
		xtype: 'field',
	},{
		name : 'nombreAveLatin',
		label: 'Ave',
		xtype: 'hiddenfield',

	},{
		name : 'descripcion',
		label: 'Detalles',
		xtype: 'textfield'
	},{
		name : 'fecha',
		label: 'Fecha/Hora',
		xtype: 'textfield'
	},{
		name : 'conteo',
		label: 'Conteo',
		xtype: 'selectfield',
		options: [{

			text: '1',
			value: 1

		},{

			text: '2',
			value: 2

		},{

			text: '3',
			value: 3

		},{

			text: '4',
			value: 4

		},{

			text: '5',
			value: 5

		},{

			text: '6',
			value: 6

		},{

			text: '7',
			value: 7

		},{

			text: '8',
			value: 8

		},{

			text: '9',
			value: 9

		},{

			text: '10',
			value: 10

		},{

			text: '11',
			value: 11

		},{

			text: '12',
			value: 12

		}]
	},{
		xtype:'textfield',
		label:'Lugar',
		name: 'lugar'
	},{
		name : 'lugarx',
		label: 'Latitud',
		xtype: 'hiddenfield'
	},{
		name : 'lugary',
		label: 'Longitud',
		xtype: 'hiddenfield'
	},{
		name:'botonmapa',
		xtype:'button',

		text:'Seleccionar posición'

	}],

	initComponent: function() {
		
		aplic.views.AvistamientosEdit.superclass.initComponent.call(this,arguments);
		
		

	},
});
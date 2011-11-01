aplic.views.AvistamientosNew = Ext.extend(Ext.form.FormPanel, {
	scroll:'vertical',

	listeners: {
		body: {
			//delegate: '#as', //bind to the underlying el property on the panel
			tap: function(e) {
				if(e.target.name=='fecha') {
					aplic.controllers.dateTimePicker1.show();
				}
				if(e.target.name=='nombreAve') {
					e.stopPropagation();
					e.preventDefault();
					Ext.dispatch({
						controller: aplic.controllers.avistamientos,
						action: 'seleccionarave',
						animation: {
							type:'slide',
							direction:'left'
						}
					});
				}
				if(e.target.className=='x-button-label') {
					Ext.dispatch({
						controller: aplic.controllers.avistamientos,
						edit:false,
						action: 'abrirMapa',
						animation: {
							type:'slide',
							direction:'left'
						}
					});
				}
				console.log(e);
			}
		}
	},
	dockedItems: [{
		xtype: 'toolbar',
		title: 'N. Avistamiento',
		items: [{
			id: 'cancelar',
			text: 'Cancel',
			ui: 'back',
			listeners: {
				'tap': function () {
					Ext.dispatch({
						controller: aplic.controllers.avistamientos,
						action: 'index',
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
			id: 'salva',
			text: 'Guardar',
			ui: 'normal',
			listeners: {
				'tap': function () {
					Ext.dispatch({
						controller: aplic.controllers.avistamientos,
						action: 'salvarnuevo',
						animation: {
							type:'slide',
							direction:'left'
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

	},{
		name : 'imagenAve',
		label: 'Ave',
		xtype: 'hiddenfield',

	},{
		name : 'nombreAveLatin',
		label: 'Ave',
		xtype: 'hiddenfield',

	},{
		name : 'nombreAve',
		label: 'Ave',
		disabled: 'true',
		disabledCls:'',
		xtype: 'textfield',
		

	},{
		xtype:'textfield',
		label:'Detalles',
		name: 'descripcion'
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
		xtype:'hiddenfield',
		label:'Latitud',
		name: 'lugarx',
		
	},{
		xtype:'hiddenfield',
		label:'Longitud',
		name: 'lugary'
	},{
		name:'botonmapa',
		xtype:'button',

		text:'Seleccionar posición'

	}],

	updateWithRecord: function(record) {
		this.load(record);
		//this.lugarx=this.getRecord().data.lugarx;

	},
	initComponent: function() {
		aplic.views.AvistamientosNew.superclass.initComponent.call(this,arguments);


	},
});
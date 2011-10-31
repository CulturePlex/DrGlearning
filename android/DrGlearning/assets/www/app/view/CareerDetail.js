var carousel1 = Ext.create('Ext.Carousel', {
            defaults: {
                cls: 'card'
            },
            items: [{
                html: 'Nivel 1'
            }, {
                html: 'Nivel 2'
            }, {
                html: 'Nivel 3'
            }, {
                html: 'Nivel 4'
            }, {
                html: 'Nivel 5'
            }, {
                html: 'Nivel 6'
            }]
        });


Ext.define('DrGlearning.view.CareerDetail', {
    extend: 'Ext.Panel',
	xtype: 'careerdetail',
    requires: [
	'DrGlearning.view.CareerDescription'
		
    ],

    config: {
        layout: 'fit',
        defaults: {
            flex: 1
        },
        items: [
			carousel1
		
		]
    }
});
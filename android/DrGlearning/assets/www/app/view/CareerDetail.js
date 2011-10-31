var carousel1 = Ext.create('Ext.Carousel', {
            defaults: {
                cls: 'card'
            },
            items: [{
                html: 'Nivel 1: Illetratum'
            }, {
                html: 'Nivel 2: Primary'
            }, {
                html: 'Nivel 3: Secondary'
            }, {
                html: 'Nivel 4: High School'
            }, {
                html: 'Nivel 5: College'
            }, {
                html: 'Nivel 6: Master'
            }]
        });

Ext.define('DrGlearning.view.CareerDetail', {
    extend: 'Ext.Panel',
	xtype: 'careerdetail',
    requires: [
	'DrGlearning.view.CareerDescription'
		
    ],
    config: {
    	career:null,
        layout: 'vbox',
        defaults: {
            flex: 1
        },
        items: [
		{
           xtype: 'careerdescription',
           flex: 1,
           
        },
        carousel1	
		]
    },
    updateCareer: function(newCareer) {
        var description = this.down('careerdescription');
        description.setData(newCareer.data);
        
    },
});
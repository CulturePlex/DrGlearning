Ext.define('DrGlearning.view.CareerDetail', {
    extend: 'Ext.Panel',
	xtype: 'careerdetail',
    requires: [
		'DrGlearning.view.CareerDescription',
		'DrGlearning.view.LevelsCarousel'
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
        {
        	xtype: 'carousel',
            ui: 'light',
            direction: 'horizontal',
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
        }	
		]
    },
    updateCareer: function(newCareer) {
        var description = this.down('careerdescription');
        description.setData(newCareer.data);
        
    },
});
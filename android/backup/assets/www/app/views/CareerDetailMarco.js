aplic.views.CareerDetailMarco = Ext.extend(Ext.Panel, {
    dockedItems: [{
        xtype: 'toolbar',
		title:'in a career',
        
        items: [{
            text: 'Back',
            ui: 'back',
            listeners: {
                'tap': function(){
                    Ext.dispatch({
                        controller: aplic.controllers.careers,
                        action: 'index',
                        animation: {
                            type: 'slide',
                            direction: 'right'
                        }
                    });
                }
            }
        }]
    }],
    layout: 'card',
    
    cardSwitchAnimation: 'slide',
    initComponent: function(){
        //put instances of cards into app.views namespace
        Ext.apply(aplic.views, {
        
            careerDetail: new aplic.views.CareerDetail(),
        
        
        });
        
        //put instances of cards into view
        Ext.apply(this, {
            items: [aplic.views.careerDetail ]
        });
        console.log('Dentro de Marcoii: ' + aplic.views);
        aplic.views.CareerDetailMarco.superclass.initComponent.apply(this, arguments);
    }
});

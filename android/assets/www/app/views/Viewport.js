aplic.views.Viewport = Ext.extend(Ext.Panel, {
    dockedItems: [{
        dock: 'top',
        xtype: 'toolbar',
        html: "Dr GLearning",
        height: '29'
    
    }],
    fullscreen: true,
    layout: 'card',
    
    cardSwitchAnimation: 'slide',
    initComponent: function(){
        //put instances of cards into app.views namespace
        Ext.apply(aplic.views, {
            careersInstalledView: new aplic.views.CareersInstalledView(),
            careerDetailMarco: new aplic.views.CareerDetailMarco(),
        });
        
        //put instances of cards into viewport
        Ext.apply(this, {
            items: [aplic.views.careersInstalledView, aplic.views.careerDetailMarco, ]
        });
        console.log('Dentro de viewPort : ' + aplic.views);
        aplic.views.Viewport.superclass.initComponent.apply(this, arguments);
        
    }
});

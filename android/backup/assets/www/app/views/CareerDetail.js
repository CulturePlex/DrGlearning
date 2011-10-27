aplic.views.CareerDetail = Ext.extend(Ext.Panel, {

    styleHtmlContent: true,
    
    
    updateWithRecord: function(record){
        Ext.each(this.items.items, function(item){
            item.update(record.data);
        });
        
    },
    initComponent: function(){
        //put instances of cards into app.views namespace
        Ext.apply(aplic.views, {
        
            levelsList: new aplic.views.LevelsList(),
        
        
        });
        
        //put instances of cards into view
        Ext.apply(this, {
            items: [aplic.views.levelsList]
        });
        aplic.views.CareerDetail.superclass.initComponent.apply(this, arguments);
    }
});

Ext.define('DrGlearning.view.CareersListItem', {
    extend: 'Ext.dataview.DataItem',
    xtype: 'careerslistitem',
    config: {
        dataMap: {
            getName: {
                setHtml: 'name'
            },
            getDescription: {
                setHtml: 'description'
            },
            getCreator: {
                setHtml: 'creator'
            }
			
        
        },
        
        baseCls: Ext.baseCSSPrefix + 'list-item',
        
        name: {
            cls: 'name'
        },
        description: {
            cls: 'description'
        },
        creator: {
            cls: 'creator'
        },
        layout: {
            type: 'vbox',
            pack: 'center'
        }
    },
    
    applyName: function(config){
        return Ext.factory(config, Ext.Component, this.getName());
    },
    
    updateName: function(newName){
        if (newName) {
            this.add(newName);
        }
    },
    
    applyDescription: function(config){
        return Ext.factory(config, Ext.Component, this.getDescription());
    },
    
    updateDescription: function(newDescription){
        if (newDescription) {
            this.add(newDescription);
        }
    },
    
    applyCreator: function(config){
        return Ext.factory(config, Ext.Component, this.getCreator());
    },
    
    updateCreator: function(newCreator){
        if (newCreator) {
            this.add(newCreator);
        }
    }
    
    
});

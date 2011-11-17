Ext.define('DrGlearning.view.activities.ActivityContent', {
   extend: 'Ext.Component',
    xtype: 'activitycontent',
    requires: ['Ext.XTemplate'],
    config: {
        cls: 'detail-card',
        styleHtmlContent: true,        
		items: [
			{
                xtype: 'toolbar',
                docked: 'bottom',
                ui: 'gray',
                items:[
                    {
						xtype: 'button',
						customId: 'backtolevel',
						text: 'Back',
						ui: 'back',
					}]
                
            }
		]
    }
	
    
});
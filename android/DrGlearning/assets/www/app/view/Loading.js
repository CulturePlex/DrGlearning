Ext.define('DrGlearning.view.Loading', {
    extend: 'Ext.Container',
	xtype: 'loading',
    config: {
        fullscreen: true,
        layout: 'fit',
        items: [{
            xtype:'panel',
            html: '<img src="resources/images/splash.png" />',
            id: 'loadingpanel',
        }]
    }
});
Ext.define('DrGlearning.view.Loading', {
    extend: 'Ext.Container',
	xtype: 'loading',
    config: {
        fullscreen: true,
        layout: 'fit',
        items: [{
            xtype:'panel',
			width:'100%',
            html: '<img src="resources/images/splash.png" width="100%"/>',
            id: 'loadingpanel',
			fullscreen: true,
        	layout: 'fit',
        }]
    }
});
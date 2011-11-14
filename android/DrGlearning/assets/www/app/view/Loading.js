Ext.define('DrGlearning.view.Loading', {
    extend: 'Ext.Container',
	xtype: 'loading',
    config: {
        fullscreen: true,
        layout: 'fit',
        items: [{
            xtype: 'toolbar',
            ui: 'green',
            docked: 'top',
            items: [{
                xtype: 'spacer'
            }, {
                xtype: 'title',
                title: 'Dr. Glearning'
            }, {
                xtype: 'spacer'
            }]
        },{
            xtype:'label',
            text: 'Loading'
        }]
    }
});
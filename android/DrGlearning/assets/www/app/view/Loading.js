Ext.define('DrGlearning.view.Loading', {
    extend: 'Ext.Container',
	xtype: 'loading',
    config: {
        fullscreen: true,
        layout: 'fit',
        //style: {backgroundimage:'url(resources/images/splash.jpg)'},
        //style: {borderColor:'#000000', borderStyle:'solid', borderWidth:'1px'},
        items: [{
            xtype:'label',
            text: 'Loading'
        }]
    }
});
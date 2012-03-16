Ext.define('DrGlearning.view.CareerDescription', {
   extend: 'Ext.Component',
    xtype: 'careerdescription',
    requires: ['Ext.XTemplate'],
    config: {
        cls: 'card',
        styleHtmlContent: true,
        tpl: Ext.create('Ext.XTemplate',
            "<p font-size:'18' >{description}</p>"
        )
    }
});
Ext.define('DrGlearning.view.CareerDescription', {
   extend: 'Ext.Component',
    xtype: 'careerdescription',
    requires: ['Ext.XTemplate'],

    config: {
        cls: 'detail-card',
        styleHtmlContent: true,

        tpl: Ext.create('Ext.XTemplate',
            '<h1>{name}</h1>',
            '<p><strong>Overview</strong><br />{description}</p>'
            // {compiled: true}
        )
    }
});
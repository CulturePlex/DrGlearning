Ext.define('DrGlearning.view.CareerDescription', {
   extend: 'Ext.Component',
    xtype: 'careerdescription',
    requires: ['Ext.XTemplate'],
    config: {
        cls: 'detail-card',
        styleHtmlContent: true,
        tpl: Ext.create('Ext.XTemplate',
            '<p>{description}</p><div style="position:absolute;margin:0 auto 0 auto; width:100%;bottom:50%;">Levels:</div>'
        )
    }
});
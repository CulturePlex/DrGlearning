Ext.define('DrGlearning.view.CareerDescription', {
    extend: 'Ext.Component',
    xtype: 'careerdescription',
    requires: ['Ext.XTemplate'],

    config: {
        cls: 'detail-card',
        styleHtmlContent: true,

        tpl: Ext.create('Ext.XTemplate',
            'Descripción de la carrera'
        )
    }
});
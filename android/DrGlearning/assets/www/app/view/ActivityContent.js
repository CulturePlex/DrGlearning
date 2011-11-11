Ext.define('DrGlearning.view.ActivityContent', {
   extend: 'Ext.Component',
    xtype: 'activitycontent',
    requires: ['Ext.XTemplate'],
    config: {
        cls: 'detail-card',
        styleHtmlContent: true,
        tpl: Ext.create('Ext.XTemplate',
            '<p>Aquí ponemos los detalles de la actividad... {description}</p>'
        )
    }
});
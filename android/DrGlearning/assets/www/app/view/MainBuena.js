Ext.define('DrGlearning.view.MainBuena', {
    extend: 'Ext.Container',
    requires: [
        'DrGlearning.view.CareersList',
        'DrGlearning.view.CareersTop'
    ],

    config: {
        fullscreen: true,
        layout: 'fit',
        items: [
            {
                xtype : 'careerstop',
                docked: 'top'
            },
            {
                xtype: 'careerslist'
            }
        ]
    }
});
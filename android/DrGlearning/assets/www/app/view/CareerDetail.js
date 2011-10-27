Ext.define('DrGlearning.view.CareerDetail', {
    extend: 'Ext.Panel',
    xtype: 'careerdetail',

    fullscreen: true,

    items: [
        {
            dock : 'top',
            xtype: 'toolbar',
            title: 'Standard Titlebar'
        },
        {
            dock : 'top',
            xtype: 'toolbar',
            ui   : 'light',
            items: [
                {
                    text: 'Test Button'
                }
            ]
        }
    ],

    html: 'Testing'
    
});

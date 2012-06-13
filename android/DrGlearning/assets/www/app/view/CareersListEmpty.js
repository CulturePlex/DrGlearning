try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.view.CareersListEmpty', {
            extend: 'Ext.Panel',
            xtype: 'careerslistempty',
            items:[
                {xtype:'button',
                text:''}
                ]
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}

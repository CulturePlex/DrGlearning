try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.view.Loading', {
            extend: 'Ext.Panel',
            xtype: 'loading',
            config: {
                id: 'loadingpanel',
                fullscreen: true,
                style: 'background:transparent'
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}

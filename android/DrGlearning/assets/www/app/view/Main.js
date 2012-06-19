try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.view.Main', {
            extend: 'Ext.Container',
            requires: [
                'DrGlearning.view.CareersFrame',
                'DrGlearning.view.CareerFrame',
                'DrGlearning.view.Loading'
            ],
            config: {
                fullscreen: true,
                layout: 'fit'
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}

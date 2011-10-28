Ext.define('DrGlearning.view.Main', {
    extend: 'Ext.Container',
    requires: [
		'DrGlearning.view.CareersFrame',
		'DrGlearning.view.CareerFrame'
    ],

    config: {
        fullscreen: true,
        layout: 'fit'
    }
});
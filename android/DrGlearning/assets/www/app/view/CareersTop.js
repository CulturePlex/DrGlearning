/**
 * @class kiva.views.LoanFilter
 * @extends Ext.form.Panel
 * 
 * This form enables the user to filter the types of Loans visible to those that they are interested in.
 * 
 * We add a custom event called 'filter' to this class, and fire it whenever the user changes any of the
 * fields. The loans controller listens for this event and filters the Ext.data.Store that contains the
 * Loans based on the values selected (see the onFilter method in app/controllers/loans.js).
 * 
 */

try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.view.CareersTop', {
            extend: 'Ext.Container',
            xtype: 'careerstop',

            config: {
                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        ui: 'gray',
                        items:[
                            {
                                xtype: 'selectfield',
                                name: 'estado',
                                options: [
                                    {text: i18n.gettext('In progress'), value: 'both'},
                                    {text: i18n.gettext('Not yet started'), value: 'male'}
                                ]
                            },
                            { xtype: 'spacer' },
                            {
                                xtype: 'button',
                                text: i18n.gettext('Add course')
                            }
                            ]
                        
                    }
                ],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                }
            },
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}

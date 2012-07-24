/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/
/*global
    Ext Jed i18n FBL DEBUG PhoneGap MathJax JSON console printStackTrace alert StackTrace DrGlearning
*/

try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.view.Info', {
            extend: 'Ext.Panel',
            xtype: 'learn',
            config: {
                // Make it modal so you can click the mask to hide the overlay
                modal: true,
                hideOnMaskTap: true,
                showAnimation: {
                    type: 'popIn',
                    duration: 250,
                    easing: 'ease-out'
                },
                hideAnimation: {
                    type: 'popOut',
                    duration: 250,
                    easing: 'ease-out'
                },
                padding: 5,
                height: 250,
                width: 250,
                centered: true,
                // Make it hidden by default
                // Set the width and height of the panel
                layout: 'fit',
                scrollable: true,
                // Here we specify the #id of the element we created in `index.html`
                // Style the content and make it scrollable
                // Insert a title docked at the top with a title
                items: [
                    {
                        docked: 'bottom',
                        xtype: 'toolbar',
                        items: [
                            {xtype: 'spacer'},
                            {xtype: 'button',
                            text: i18n.gettext('Close'),
                            listeners : {
                                tap : function () {
                                    this.parent.parent.hide();
                                }
                            }
                            },
                            {xtype: 'spacer'}
                        ]
                    }
                ]
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}

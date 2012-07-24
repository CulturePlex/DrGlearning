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

        Ext.define('DrGlearning.view.Learn', {
            extend: 'Ext.Panel',
            xtype: 'learn',
            config: {
                cls: 'learnPanel',
                // Make it modal so you can click the mask to hide the overlay
//                modal: true,
//                hideOnMaskTap: true,
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
                padding: 0,
                
                centered: true,
                // Make it hidden by default
                // Set the width and height of the panel
//                layout: 'fit',
                // Here we specify the #id of the element we created in `index.html`
                contentEl: 'content',
                // Style the content and make it scrollable
                styleHtmlContent: false,
                scrollable: true,
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
                                    DrGlearning.app.getController('GlobalSettingsController').learnParent.show();
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

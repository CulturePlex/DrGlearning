/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/
/*global
    Ext Jed i18n FBL DEBUG yepnope PhoneGap MathJax JSON console printStackTrace alert StackTrace
*/

try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.view.Terms', {
            extend: 'Ext.Panel',
            xtype: 'terms',
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
                    centered: true,
                    
                    //html: '<iframe name="i1" src="terms.txt" width= 240 height= 200 frameborder="0" />',
                    //'<iframe src="http://www.facebook.com/plugins/like.php?href=YOUR_URL" scrolling="no" frameborder="0" style="border:none; width:450px; height:80px"></iframe>'
                    // Make it hidden by default
                    hidden: true,

                    // Set the width and height of the panel
                    width: 300,
                    height: 269,

                    // Here we specify the #id of the element we created in `index.html`
                    //contentEl: 'content',

                    // Style the content and make it scrollable
                    styleHtmlContent: true,
                    scrollable: true,

                    // Insert a title docked at the top with a title
                    items: [
                        {
                            docked: 'top',
                            xtype: 'toolbar',
                            title: i18n.gettext('Terms and Conditions')
                        },
                        {
                            docked: 'bottom',
                            xtype: 'toolbar',
                            items: [
                                {xtype: 'spacer'},
                                {
                                    xtype: 'button',
                                    text: i18n.gettext('I Agree'),
                                    ui: 'confirm',
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

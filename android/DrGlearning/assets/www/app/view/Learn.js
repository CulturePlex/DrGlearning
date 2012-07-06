try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.view.Learn', {
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
                    padding: 0,
                    centered:true,
                    
                    //html: '<iframe name="i1" src="terms.txt" width= 240/>',
                    //'<iframe src="http://www.facebook.com/plugins/like.php?href=YOUR_URL" scrolling="no" frameborder="0" style="border:none; width:450px; height:80px"></iframe>'
                    // Make it hidden by default
                    hidden: true,

                    // Set the width and height of the panel
                    width: 300,
                    height: 209,

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
                                {xtype:'spacer'},
                                {xtype: 'button',
                                text: i18n.gettext('Close'),
                                listeners : {
                                     tap : function() {
                                           this.parent.parent.hide();
                                     }
                                 }
                                },
                                {xtype:'spacer'}
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

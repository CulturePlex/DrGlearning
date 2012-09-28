/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace console
*/ 

try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.view.Settings', {
            extend : 'Ext.Container',
            xtype : 'settings',
            config: {
                fullscreen: true,
                items: 
                [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        layout: 'vbox',
                        items: 
                        [
                            {
                                xtype: 'spacer'
                            }, {
                                xtype: 'title',
                                title: i18n.gettext("Settings")
                            }, {
                                xtype: 'spacer'
                            }
                        ]
                    }, {
                        xtype: 'spacer'
                    }, {
                        xtype: 'selectfield',
                        id: 'locale',
                        inputCls: localStorage.alignCls,
                        labelCls: localStorage.alignCls,
                        label: i18n.gettext('Language'),
                        margin: 5,
                        value: localStorage.locale || "en",
                        options: [
                            {text: 'لغة_عربية', value: 'ar'},
                            {text: 'English', value: 'en'},
                            {text: 'Español', value: 'es_ES'},
                            {text: 'Français', value: 'fr'}
                            // {text: 'Português', value: 'pt_BR'}
                        ]
                    }, {
                        xtype : 'textfield',
                        label : i18n.gettext('Username'),
                        name : 'username',
                        id : 'username',
                        margin: 5
                    }, {
                        xtype : 'textfield',
                        label : i18n.gettext('Email'),
                        name : 'email',
                        id : 'email',
                        margin: 5
                    }, {
                        xtype : 'spacer',
                    }, {
                        xtype : 'button',
                        margin: 5,
                        text : i18n.gettext('Import user'),
                        id : 'import'
                    },{
                        xtype : 'button',
                        margin: 5,
                        text : i18n.gettext('Export user'),
                        id : 'export'
                    }, 
                    {
                        xtype: 'toolbar',
                        docked: 'bottom',
                        items:
                        [
                            {
                                xtype: 'button',
                                id: 'backFromSettings',
                                text: i18n.gettext('Back'),
                                ui: 'back'
                            },
                            {
                                xtype: 'spacer' 
                            },
                            {
                                xtype: 'button',
                                text: i18n.gettext('Save'),
                                id: 'saveSettings'
                            }
                        ]
                    }
                ]
            },
            animationDuration : 300,
            /*
             * show: function(animation) { //this.callParent();
             * 
             * Ext.Animator.run([{ element : this.element, xclass :
             * 'Ext.fx.animation.SlideIn', direction: Ext.os.deviceType == "Phone" ?
             * "up" : "left", duration : this.animationDuration }, { element :
             * 'ext-mask-1', xclass : 'Ext.fx.animation.FadeIn', duration:
             * this.animationDuration }]); },
             * 
             * hide: function(animation) { var me = this, mask =
             * Ext.getCmp('ext-mask-1');
             * 
             * //we fire this event so the controller can deselect all items
             * immediately. this.fireEvent('hideanimationstart', this);
             * 
             * //show the mask element so we can animation it out (it is already shown
             * at this point) mask.show();
             * 
             * Ext.Animator.run([{ element : me.element, xclass :
             * 'Ext.fx.animation.SlideOut', duration : this.animationDuration,
             * preserveEndState: false, direction: Ext.os.deviceType == "Phone" ? "down" :
             * "right", onEnd: function() { me.setHidden(true); mask.setHidden(true); } }, {
             * element : 'ext-mask-1', xclass : 'Ext.fx.animation.FadeOut', duration:
             * this.animationDuration }]); },
             */
            initialize : function () {
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}

var UserSettings = {
    saveSettings : function () {
        var usernameField = $('#username').val();
        var emailField = $('#email').val();
        var changed = false;
        if (emailField !== localStorage.email || usernameField !== localStorage.display_name)
        {
            changed = true;
            localStorage.display_name = usernameField;
            localStorage.email = emailField;
        }
        /*var locale = view.down('selectfield[id=locale]').getValue();
        if (localStorage.locale !== locale) {
            if (locale === "ar")
            {
                localStorage.alignCls = 'rightalign';
            } else
            {
                localStorage.alignCls = 'leftalign';
            }
            localStorage.locale = locale;
            Ext.Msg.alert(i18n.gettext('Language changed'), i18n.gettext('You need to restart the app to see the changes.'), function () {

            });
        }*/
        if (changed)
        {
            this.updateUserSettings();
        }
    },
    updateUserSettings: function () {
        var HOST = GlobalSettings.getServerURL();
        jQuery.ajax({
            url: HOST + '/api/v1/player/?format=jsonp',
            dataType : 'jsonp',
            data: {
                code: localStorage.uniqueid,
                token: localStorage.token,
                email: localStorage.email,
                display_name: localStorage.display_name
            },
            success: function (response) {
                console.log('User data sent');
            }
        });
        
    },
}

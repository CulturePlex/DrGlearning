Ext.define('DrGlearning.store.Levels', {
    extend  : 'Ext.data.Store',
    requires: ['DrGlearning.model.Level'],
    config: {
        model: 'DrGlearning.model.Level',
        autoLoad: true,
        autoSync: true,
        data : [
                {
            "customId":"1",
            "name":i18n.gettext("Illetratum"),
            "description":i18n.gettext("Don't know anything about this? Learn your basics here!")
        },
        {
            "customId":"2",
            "name":i18n.gettext("Primary"),
            "description":i18n.gettext("Now you have an idea. But there’s so much more to learn!")
        },
        {
            "customId":"3",
            "name":i18n.gettext("Secondary"),
            "description":i18n.gettext("Keep going!")
        },
        {
            "customId":"4",
            "name":i18n.gettext("High School"),
            "description":i18n.gettext("For every thing you know there is another one you don’t!")
        },
        {
            "customId":"5",
            "name":i18n.gettext("College"),
            "description":i18n.gettext("You’ve done your courses. Now is the time to prove it!")
        },
        {
            "customId":"6",
            "name":i18n.gettext("Master"),
            "description":i18n.gettext("I’m starting to think you might be good after all")
        },
        {
            "customId":"7",
            "name":i18n.gettext("PhD"),
            "description":i18n.gettext("If you’re still here you must really love this")
        },
        {
            "customId":"8",
            "name":i18n.gettext("Post-Doc"),
            "description":i18n.gettext("Think you're an expert? Can you become a professor now?")
        },
        {
            "customId":"9",
            "name":i18n.gettext("Professor"),
            "description":i18n.gettext("Want to try to teach me a lesson?")
        },
        {
            "customId":"10",
            "name":i18n.gettext("Emeritus"),
            "description":i18n.gettext("Nobody knows more about this than you? We'll see…")
        }
            ]

    },
    
    listeners: { 
        exception: function(){ 
          console.log('store exception'); 
        } 
    }
});

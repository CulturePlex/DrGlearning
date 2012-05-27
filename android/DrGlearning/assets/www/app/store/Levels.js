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
            "name":"Illetratum",
            "description":"Don’t know anything about this? Learn your basics here!"
        },
        {
            "customId":"2",
            "name":"Primary",
            "description":"Now you have an idea. But there’s so much more to learn!"
        },
        {
            "customId":"3",
            "name":"Secondary",
            "description":"Keep going!"
        },
        {
            "customId":"4",
            "name":"High School",
            "description":"For every thing you know there is another one you don’t!"
        },
        {
            "customId":"5",
            "name":"College",
            "description":"You’ve done your courses. Now is the time to prove it!"
        },
        {
            "customId":"6",
            "name":"Master",
            "description":"I’m starting to think you might be good after all."
        },
        {
            "customId":"7",
            "name":"PhD",
            "description":"If you’re still here you must really love this."
        },
        {
            "customId":"8",
            "name":"Post-Doc",
            "description":"Think you're an expert? Can you become a professor now?"
        },
        {
            "customId":"9",
            "name":"Professor",
            "description":"Want to try to teach me a lesson?"
        },
        {
            "customId":"10",
            "name":"Emeritus",
            "description":"Nobody knows more about this than you? We’ll see…"
        }
	        ]

    },
    
    listeners: { 
        exception: function(){ 
          console.log('store exception'); 
        } 
    }
});

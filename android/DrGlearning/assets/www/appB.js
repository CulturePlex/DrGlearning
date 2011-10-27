/**
 * 
 */
Ext.application({
	 name: 'app',
	    launch: function() {
	        this.launched = true;
	        this.mainLaunch();
	    },
	    mainLaunch: function() {
	        if (!device || !this.launched) {return;}
	        console.log('mainLaunch');
	    }
});
//Global Settings controller
var GlobalSettings = {
    //Method to get the server URL
    getServerURL: function () {
      //return 'http://drglearning.testing.cultureplex.ca';
      return 'http://beta.drglearning.com';
      //return 'http://0.0.0.0:8000';
    },
    //Method to know if we are playing on a device.
    isDevice: function () {
        if (window.device === undefined) {
            return false;
        } else {
            return true;
        }
    },
    //Mehtod to show a modal panel for console logs
    showModal: function (){
        $("body").append('<div class="modalWindow"/>');
        $.mobile.showPageLoadingMsg("b", "This is only a test", true);

    },
    //Method to hide the modal panel
    hideModal: function (){
        $(".modalWindow").remove();
        $.mobile.hidePageLoadingMsg();
    },
    //Functions needed
	hashCode: function (str) { // java String#hashCode
		var hash = 0;
		for (var i = 0; i < str.length; i++) {
		   hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		return hash;	
	},
	intToARGB:function (i){
		return ((i>>24)&0xFF).toString(16) + 
			   ((i>>16)&0xFF).toString(16) + 
			   ((i>>8)&0xFF).toString(16) + 
			   (i&0xFF).toString(16);
	}

}

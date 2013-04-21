var GlobalSettings = {
    getServerURL: function () {
      //return 'http://drglearning.testing.cultureplex.ca';
      return 'http://beta.drglearning.com';
      //return 'http://0.0.0.0:8000';
    },
    isDevice: function () {
        if (window.device === undefined) {
            return false;
        } else {
            return true;
        }
    },
    showModal: function (){
        $("body").append('<div class="modalWindow"/>');
        $.mobile.showPageLoadingMsg("b", "This is only a test", true);

    },
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

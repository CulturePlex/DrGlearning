//Ext.require('Phonegap');
Ext.define('DrGlearning.controller.LoadingController', {
    extend: 'Ext.app.Controller',
    config: {
    	refs: 
    	        {
    				loading : 'loading',
    	            loadingpanel: 'loadingpanel',
    	        }
    },

    init: function(){
	},
	
	onLaunch: function() {
		//Add trim to prototype
		String.prototype.trim = function(){ return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/[\n\r]$/,"");}

		//Aplication start
		Ext.create('DrGlearning.view.Loading');
		this.getLoading().show();
		console.log('Loading...');
		//view.show();
		
		var careersStore = Ext.getStore('Careers');
		careersStore.load();
		Ext.getStore('Activities').load();
		var usersStore = Ext.getStore('Users');
		//console.log(usersStore);
		//Create user if needed
		if(usersStore.getCount()==0 ){
			//First calculate max localstorage size
			Ext.Viewport.setMasked({
	    	    xtype: 'loadmask',
	    	    message: 'Calculating freespace...',
	 	       	indicator: true
	    	});
			//this.getApplication().getController('MaxStorageSizeController').initTest(this);
			localStorage.maxSize=2600000;
			localStorage.actualSize=0;
			console.log("New user");
			if(this.getApplication().getController('GlobalSettingsController').isDevice()){
				var digest=this.SHA1(window.device.uuid+" "+new Date().getTime());	
			}else{
				var digest=this.SHA1("test"+" "+new Date().getTime());
			}
			console.log(digest);
			//var userModel=Ext.ModelManager.getModel('DrGlearning.model.User');
			//user.set('uniqueid:', digest);
			var userModel=new DrGlearning.model.User({
				uniqueid:digest
			});
			userModel.save();
			
		}

		if(this.getApplication().getController('GlobalSettingsController').hasNetwork()){
				//console.log("Listo0");
				//Register user if needed
				var user=usersStore.first();
				if(user != undefined && user.data.serverid==""){
					console.log("Registering user");
					var HOST = this.getApplication().getController('GlobalSettingsController').getServerURL();
					Ext.data.JsonP.request({
						scope: this,
					    url: HOST+"/api/v1/player/?format=jsonp",
					    params: {
					    	code: user.data.uniqueid,
					    	display_name: user.data.name,
					    	email: user.data.email
					    },
					    success: function(response){
					    	console.log("User successfully registered");
							console.log(response.id);
					    	user.data.serverid=response.id;
					    	user.save();
					    	usersStore.sync();
					    }
					});
					usersStore.sync();
				}
	            	//Career request
					var HOST = this.getApplication().getController('GlobalSettingsController').getServerURL();
	    			Ext.data.JsonP.request({
	                    url: HOST+"/api/v1/career/?format=jsonp",
	                    scope   : this,
	                    success:function(response, opts){
	                    	console.log("Careers retrieved");
	                    	var careers=response["objects"];
	                    	for (cont in careers) {
	                    		var career=careers[cont];
	                    		//its a new career?
	                    		console.log(career.id);
	                    		console.log("Careers stored "+careersStore.getCount());
	                    		if(careersStore.findExact('id',parseInt(career.id))==-1){
	                    			console.log("New Career found -> id="+career.id);
	                    			var careerModel=new DrGlearning.model.Career({
	                    					id : career.id,
	                        				negative_votes : career.negative_votes,
	                        				positive_votes : career.positive_votes,
	                        				name : career.name,
	                        				description : career.description,
	                        				creator : career.creator,
	                        				resource_uri : career.resource_uri,
	                        				knowledges : career.knowledges,
	                        				timestamp : career.timestamp,
	                        				installed : false,
	                    					started : false,
	                    					update : false,
	                    					size: career.size
	                    			});
	                    			var activities=new Array();
	                    			for(cont in career.activities){
	                    				activities[cont]=career.activities[cont].full_activity_url;
	                    			}
	                    			careerModel.set('activities',activities);
	                    			careerModel.save();
	                    			console.log("Careers stored after add = "+careersStore.getCount());
	                    		}else{
	                    			console.log("Career already exist -> id="+career.id);
	                    			//Watch for updates
	                    			var careerModel=careersStore.getById(career.id);
	                    			//console.log("actual timestamp: "+careerModel.data.timestamp+" - new timestamp: "+career.timestamp);
	                    			//console.log(" "+Date.parse(careerModel.data.timestamp)+" vs "+Date.parse(career.timestamp));
	                    			console.log("Actual timestamp "+careerModel.data.timestamp);
                    				console.log("Server timestamp "+career.timestamp);
                    				console.log(careerModel.data.timestamp);
                    				console.log(career.timestamp);
                    				console.log(careerModel.data.timestamp<career.timestamp);
                    				if(careerModel.data.timestamp<career.timestamp){
	                    				console.log("Checking for update.")
	    								//careerModel.data.update=true;
	    								careerModel.save();
		                    		}
                    			}
	                    	}
	                    	console.log("Careers stored after loading = "+careersStore.getCount());
	                    	//if(localStorage.maxSize!=undefined){
	                    		this.getLoading().hide();
	                    		Ext.Viewport.setMasked(false);
	                    		this.getApplication().getController('CareersListController').initializate();
	                    		this.getApplication().getController('CareersListController').index();
	                    		
	                    			
	            	          		
	                    	//}
	                    			

	                    }
	                });
	    			//Ext.Viewport.setMasked(false);
		    	  	//console.log();
		    	  	//console.log("Listo1");
	    			this.getApplication().getController('DaoController').updateOfflineScores();
	    			
	      }else{
	    	  	//Ext.Viewport.setMasked(false);
	    	  	//console.log("Listo2");
	          	this.getLoading().hide();
	          	Ext.Viewport.setMasked(false);
	          	this.getApplication().getController('CareersListController').initializate();
	          	this.getApplication().getController('CareersListController').index();
	      }
	    },
		
		pausecomp:function (ms) {
			ms += new Date().getTime();
			while (new Date() < ms){}
		} ,
		
		/**
		*
		*  Secure Hash Algorithm (SHA1)
		*  http://www.webtoolkit.info/
		*
		**/
		 
		SHA1:function(msg) {
		 
			function rotate_left(n,s) {
				var t4 = ( n<<s ) | (n>>>(32-s));
				return t4;
			};
		 
			function lsb_hex(val) {
				var str="";
				var i;
				var vh;
				var vl;
		 
				for( i=0; i<=6; i+=2 ) {
					vh = (val>>>(i*4+4))&0x0f;
					vl = (val>>>(i*4))&0x0f;
					str += vh.toString(16) + vl.toString(16);
				}
				return str;
			};
		 
			function cvt_hex(val) {
				var str="";
				var i;
				var v;
		 
				for( i=7; i>=0; i-- ) {
					v = (val>>>(i*4))&0x0f;
					str += v.toString(16);
				}
				return str;
			};
		 
		 
			function Utf8Encode(string) {
				string = string.replace(/\r\n/g,"\n");
				var utftext = "";
		 
				for (var n = 0; n < string.length; n++) {
		 
					var c = string.charCodeAt(n);
		 
					if (c < 128) {
						utftext += String.fromCharCode(c);
					}
					else if((c > 127) && (c < 2048)) {
						utftext += String.fromCharCode((c >> 6) | 192);
						utftext += String.fromCharCode((c & 63) | 128);
					}
					else {
						utftext += String.fromCharCode((c >> 12) | 224);
						utftext += String.fromCharCode(((c >> 6) & 63) | 128);
						utftext += String.fromCharCode((c & 63) | 128);
					}
		 
				}
		 
				return utftext;
			};
		 
			var blockstart;
			var i, j;
			var W = new Array(80);
			var H0 = 0x67452301;
			var H1 = 0xEFCDAB89;
			var H2 = 0x98BADCFE;
			var H3 = 0x10325476;
			var H4 = 0xC3D2E1F0;
			var A, B, C, D, E;
			var temp;
		 
			msg = Utf8Encode(msg);
		 
			var msg_len = msg.length;
		 
			var word_array = new Array();
			for( i=0; i<msg_len-3; i+=4 ) {
				j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
				msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
				word_array.push( j );
			}
		 
			switch( msg_len % 4 ) {
				case 0:
					i = 0x080000000;
				break;
				case 1:
					i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
				break;
		 
				case 2:
					i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
				break;
		 
				case 3:
					i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8	| 0x80;
				break;
			}
		 
			word_array.push( i );
		 
			while( (word_array.length % 16) != 14 ) word_array.push( 0 );
		 
			word_array.push( msg_len>>>29 );
			word_array.push( (msg_len<<3)&0x0ffffffff );
		 
		 
			for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
		 
				for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
				for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
		 
				A = H0;
				B = H1;
				C = H2;
				D = H3;
				E = H4;
		 
				for( i= 0; i<=19; i++ ) {
					temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
					E = D;
					D = C;
					C = rotate_left(B,30);
					B = A;
					A = temp;
				}
		 
				for( i=20; i<=39; i++ ) {
					temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
					E = D;
					D = C;
					C = rotate_left(B,30);
					B = A;
					A = temp;
				}
		 
				for( i=40; i<=59; i++ ) {
					temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
					E = D;
					D = C;
					C = rotate_left(B,30);
					B = A;
					A = temp;
				}
		 
				for( i=60; i<=79; i++ ) {
					temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
					E = D;
					D = C;
					C = rotate_left(B,30);
					B = A;
					A = temp;
				}
		 
				H0 = (H0 + A) & 0x0ffffffff;
				H1 = (H1 + B) & 0x0ffffffff;
				H2 = (H2 + C) & 0x0ffffffff;
				H3 = (H3 + D) & 0x0ffffffff;
				H4 = (H4 + E) & 0x0ffffffff;
		 
			}
		 
			var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
		 
			return temp.toLowerCase();
		 
		}


});
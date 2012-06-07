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
    
    retrieving : false,
    
    init: function(){
        this.daoController = this.getApplication().getController('DaoController');
		this.careersStore = Ext.getStore('Careers');
		this.knowledgesStore = Ext.getStore('Knowledges');
		this.careersListController = this.getApplication().getController('CareersListController');
		this.offset = 0;
	},
	
	onLaunch: function() {
		//Add trim to prototype
		String.prototype.trim = function(){return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/[\n\r]$/,'');};
		//Aplication start
		Ext.create('DrGlearning.view.Loading');
		this.getLoading().show();
		console.log('Loading...');
		console.log('Is device?');
		console.log(this.getApplication().getController('GlobalSettingsController').isDevice());
		//view.show();
		//Seeing if course test is needed
		var testCourse=this.getParameter('course');
		if(testCourse!="null" && testCourse!=undefined){
			console.log("Installing Test course");
			console.log(testCourse);
			this.installTestCourse(testCourse);
		}
		this.careersStore.load();
		Ext.getStore('Activities').load();
		var usersStore = Ext.getStore('Users');
		console.log(usersStore.getCount());
		//Create user if needed
		if(usersStore.getCount()==0){
			//First calculate max localstorage size
			Ext.Viewport.setMasked({
	    	    xtype: 'loadmask',
	    	    message: i18n.gettext('Calculating free space...'),
	 	       	indicator: true
	    	});
			this.getApplication().getController('MaxStorageSizeController').initTest(this);
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
				uniqueid:digest,
				token:''
			});
			userModel.save();
		}

		if(this.getApplication().getController('GlobalSettingsController').hasNetwork()){
		        if(this.knowledgesStore.getCount() == 0)
		        {
                    this.knowledgesRequest();
                }
				//Register user if needed
				usersStore.sync();
				usersStore.load();
				var user=usersStore.getAt(0);
				console.log(user);
				if(user !== undefined && user.data.token === ''){
					console.log("Registering user");
					var HOST = this.getApplication().getController('GlobalSettingsController').getServerURL();
					Ext.data.JsonP.request({
						scope: this,
					    url: HOST+"/api/v1/player/?format=jsonp",
					    params: {
					    	code: user.data.uniqueid,
					    },
					    success: function(response){

							console.log(response);
					    	user.data.token=response.token;
					    	user.data.serverid=response.id;
					    	user.data.resource_uri=response.resource_uri;
					    	//user.save();
					    	usersStore.sync();
    				    	console.log("User successfully registered");
					    }
					});
					usersStore.sync();
				}
	            	//Here was the Career request

                	//if(localStorage.maxSize!=undefined){
            		this.getLoading().hide();
            		this.getApplication().getController('CareersListController').initializate();
            		this.getApplication().getController('CareersListController').index();
	                
	    			//Ext.Viewport.setMasked(false);
		    	  	//console.log();
		    	  	//console.log("Listo1");
	    			//this.getApplication().getController('DaoController').updateOfflineScores();
	    			
	      }else{
	    	  	//Ext.Viewport.setMasked(false);
	    	  	//console.log("Listo2");
	          	this.getLoading().hide();
	          	Ext.Viewport.setMasked(false);
	          	this.getApplication().getController('CareersListController').initializate();
	          	this.getApplication().getController('CareersListController').index();
	      }
	    },
        careersRequest: function (searchString,knowledgeValue){
	            if( localStorage.searchString != searchString || localStorage.knowledgeValue != knowledgeValue)
	            {
	                localStorage.searchString = searchString;
	                localStorage.knowledgeValue = knowledgeValue;
	                localStorage.offset = 0;
	                localStorage.total_count = 1;
	                localStorage.current_count = 0;
	            }
	            if(parseInt(localStorage.current_count)  < parseInt(localStorage.total_count) && !this.retrieving && this.careersListController.installing == true)
			    {
			        this.retrieving =true;
                    this.daoController.updateOfflineScores();
	                Ext.Viewport.setMasked({
                         xtype: 'loadmask',
                         message: i18n.gettext('Retrieving Courses...'),
                         indicator: true,
                         html: "<img src='resources/images/ic_launcher.png'>"
                    });
			        var HOST = this.getApplication().getController('GlobalSettingsController').getServerURL();
			        var searchParams;
			        if(localStorage.knowledgeValue!== 'All')
			        {
			            searchParams={
			                offset: localStorage.offset,
                            name__contains: localStorage.searchString,
                            knowledges__name: localStorage.knowledgeValue
                        };
			        }
			        else
			        {
			            searchParams={
			                offset: localStorage.offset,
                            name__contains: localStorage.searchString,
                        };
			        }
			        Ext.data.JsonP.request({
                        url: HOST+"/api/v1/career/?format=jsonp",
                        scope   : this,
                        params: searchParams,
                        success:function(response, opts){
                            localStorage.offset = response["meta"].limit;
                            localStorage.total_count = response["meta"].total_count;
                        	var careers=response["objects"];
                        	this.careersStore.each(function(record) {
                        		if(!record.data.installed){
                            		var exist=false;
                            		for(cont in careers){
                            			if(careers[cont].id == record.data.id){
                            				exist=true;
                            				break;
                            			}
                            		}
                            		if(!exist){
                            		    
                            			record.erase();
                            		}
                            	}
					        },this);
                        	for (cont in careers) {
                        		var career=careers[cont];
                        		localStorage.current_count ++;
                        		if(this.careersStore.find('id',career.id) === -1){
                        			var careerModel=new DrGlearning.model.Career({
                        					id : parseInt(career.id),
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
                        					size: career.size,
                        					career_type: career.career_type
                        			});
                                   	
                        			var activities=new Array();
                        			for(cont in career.activities){
                        				activities[cont]=career.activities[cont].full_activity_url;
                        			}
                        			careerModel.set('activities',activities);
                        			careerModel.save();
                        			this.careersStore.load();
                        			this.careersStore.sync();
							        console.log(this.careersStore);
                        		}else{
                        		    console.log('existe');
                        			//Watch for updates
                        			var careerModel=this.careersStore.getAt(this.careersStore.find('id',career.id));
                    				if(careerModel.data.timestamp<career.timestamp && !careerModel.data.installed){
								        careerModel.data.update=true;
								        careerModel.save();

                            		}
                    			}
                        	}
                        	this.careersListController.showCareersToInstall();
                            Ext.Viewport.setMasked(false);
                            this.retrieving = false;
                        },
                        failure:function(){
                            Ext.Viewport.setMasked(false);
                            this.retrieving = false;
                        }
                     });
                }
        },
        knowledgesRequest: function (){
	        console.log('retrieving knowledges');
	        localStorage.knowledgeFields = [];
		    var HOST = this.getApplication().getController('GlobalSettingsController').getServerURL();
		    Ext.data.JsonP.request({
                url: HOST+"/api/v1/knowledge/?format=jsonp",
                scope   : this,
                success:function(response, opts){
                	console.log(response);
                	console.log("Knowledges retrieved");
                	var knowledges=response["objects"];
               		this.knowledgesStore.removeAll(); 
                	for (cont in knowledges) {
                		var knowledge=knowledges[cont];
            			var knowledgeModel=new DrGlearning.model.Knowledge({
                				name : knowledge.name,
                				resource_uri : knowledge.resource_uri
            			});
            			knowledgeModel.save();
            			this.knowledgesStore.sync();
				        this.knowledgesStore.load();
                    }
            		console.log(localStorage.knowledgeFields);
                },
                failure:function(){
                }
           });
        },
        
        
        
		pausecomp:function (ms) {
			ms += new Date().getTime();
			while (new Date() < ms){}
		} ,
		
		installTestCourse:function(url){
			Ext.Viewport.setMasked({
	    	    xtype: 'loadmask',
	    	    message: 'Installing test course...',
	 	       	indicator: true
	    	});
			this.careersStore.load();
			var HOST = this.getApplication().getController('GlobalSettingsController').getServerURL();
			Ext.data.JsonP.request({
                url: HOST+url+'?testing=true&format=jsonp',
                scope   : this,
                success:function(response, opts){
                	console.log("Career retrieved");
                	var career=response;
                	this.careersStore.each(function(record) {
                		if(record.data.installed){
                    		if(career.id == record.data.id){
                    			console.log('Test course ');
                    			this.getApplication().getController('DaoController').deleteCareer(career.id);
                    		}
                    	}
                    },this);
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
                    				installed : true,
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
                			//Ext.Viewport.setMasked(false);
                			this.getApplication().getController('DaoController').installCareer(career.id,function(){Ext.Viewport.setMasked(false);},this);
                }
            });
		},
		
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
		 
		},
		
		getParameter:function(param){
			var queryString=window.location.search;
			var parameterName = param + "=";
			   if ( queryString.length > 0 ) {
			      // Find the beginning of the string
			      begin = queryString.indexOf ( parameterName );
			      // If the parameter name is not found, skip it, otherwise return the value
			      if ( begin != -1 ) {
			         // Add the length (integer) to the beginning
			         begin += parameterName.length;
			         // Multiple parameters are separated by the "&" sign
			         end = queryString.indexOf ( "&" , begin );
			      if ( end == -1 ) {
			         end = queryString.length;
			      }
			      // Return the string
			      return unescape ( queryString.substring ( begin, end ) );
			   }
			   // Return "null" if no parameter has been found
			   return "null";
			   }
		}


});

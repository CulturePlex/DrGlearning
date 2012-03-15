
Ext.define('DrGlearning.controller.FileManagerController', {
    extend: 'Ext.app.Controller',
    
    
	init: function(){
		
	},
	
	onLaunch: function() {
		
	},
	/**
	   * Use this parameter to customize the folder in which you want to store the files
	   */
	  DIRECTORY: "base64storage",

	  /**
	   * Saves the imageData in a text file called imageId+sufix.b64
	   */
	  storeImage: function(imageData, imageId, sufix){
	    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, successFS, fail);
	    sufix = (sufix!=undefined) ? sufix : "";
	    var imageName = "image" + imageId + sufix + ".b64";

	    function successFS(fileSystem) {
	      fileSystem.root.getDirectory(Base64Manager.DIRECTORY , {create: true, exclusive: false}, successDirectory, fail);
	    }

	    function successDirectory(parent){
	      parent.getFile(imageName, {create: true, exclusive: false}, successFile, fail);
	    }

	    function successFile(fileEntry) {
	      fileEntry.createWriter(successFileWriter, fail);
	    }

	    function successFileWriter(writer) {
	      writer.onwrite = function(evt) {
	        // Put your onwrite callback here
	      };
	      writer.write(imageData);
	    }

	    function fail(error) {
	      alert("[ERROR] " + error);
	    }

	    return imageName;
	  },

	  /**
	   * Reads the content of fileName storing base64 information.
	   * The targetId is mandatory to load the image through a
	   * callback in the DOM element with that id.
	   */
	  retrieveImage: function(fileName, targetId) {

	    function successFS(fileSystem) {
	      fileSystem.root.getDirectory(Base64Manager.DIRECTORY , {create: true, exclusive: false}, successDirectory, fail);
	    }

	    function successDirectory(parent){
	      parent.getFile(fileName, {create: true, exclusive: false}, successFile, fail);
	    }

	    function successFile(fileEntry) {
	      
	      var reader = new FileReader();
	      reader.onload = function(evt) {
	        var value = evt.target.result;
	        document.getElementById(targetId).src = value;
	      };
	      reader.readAsText(fileEntry);
	    }

	    function fail(error) {
	      alert("[ERROR] " + error);
	    }
	    
	    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, successFS, fail);
	  }

	
});
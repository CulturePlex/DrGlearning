if ($ == undefined) {
  $ = django.jQuery;
}

$(document).ready(function(){
  var DEBUG = false;

  function handleFile(evt){
    console.log("Handle", evt.target.files[0]);
   
    var f = evt.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e){
      console.log("On load");
      $('#original_image').load(loadImageInCanvas);
      $('#original_image').attr('src', e.target.result);
      $('#original_image').width(200);
      $('#original_image').height(200);
    }
    reader.readAsDataURL(f);
  }
  console.log("Cargado images");
  $('#id_obfuscated_image').after('<div id="images_panel" style="width:200px"></div>');
  $('#images_panel').append('<img id="original_image" />');
  $('#images_panel').append('<br/>');
  $('#images_panel').append('<canvas id="canvas">Your browser does not support canvas</canvas>');
  $('#images_panel').append('<textarea id="obfuscated_64" name="obfuscated_64" ></textarea>');
  if (!DEBUG){
    $('#id_obfuscated_image').hide();
    $('#obfuscated_64').hide();
  }
  document.getElementById('id_image').addEventListener('change', handleFile, false);
});


function loadImageInCanvas(){

  function setPixel(x, y, r, g, b){
    var point = 4*x+(width*4*y);
    imageData.data[point] = r;
    imageData.data[point+1] = g;
    imageData.data[point+2] = b;
  }

  function getRGBA(x,y){
    var point = 4*x+(width*4*y);
    return [imageData.data[point], imageData.data[point+1],
            imageData.data[point+2], imageData.data[point+3]]
  }

  function pixelize(x, y){
    var red = 0;
    var green = 0;
    var blue = 0;
    var pixelData;
    for(var i=x;i<x+step;i++){
      for(var j=y;j<y+step;j++){
        pixelData = getRGBA(i,j);
        red += pixelData[0];
        green += pixelData[1];
        blue += pixelData[2];
      }
    }
    red /= step*step;
    green /= step*step;
    blue /= step*step;
    for(var i=x;i<x+step;i++){
      for(var j=y;j<y+step;j++){
        setPixel(i,j,red,green,blue);
      }
    }
  }
  
  var SIZE = 200;
  var canvasElement = document.getElementById('canvas');
  canvasElement.width = SIZE;
  canvasElement.height = SIZE;
  var c = canvasElement.getContext("2d");
  var width = SIZE;
  var height = SIZE;
  c.drawImage(document.getElementById('original_image'), 0, 0, SIZE, SIZE);
  //Transformation
  var imageData = c.getImageData(0, 0, SIZE, SIZE);
  var step = 20;
  var r, g, b, a;
  for(var i=0;i<height;i+=step){
    for(var j=0;j<width;j+=step){
      pixelize(j,i);
    }
  }
  c.putImageData(imageData, 0, 0);
  $('#obfuscated_64').val(canvasElement.toDataURL("image/png"))
}
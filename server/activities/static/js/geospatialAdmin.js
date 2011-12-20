if ($ == undefined){
  var $ = django.jQuery;
}

$(document).ready(function(){
  var geoWidget = '<p><button id="add_point_manually" type="button">Add single point manually</button>' +
                  '<br/><img id="manual_map" /></p>';
  $('#id_points_points').show();
  $('#id_points_points').before(geoWidget);
  $('#add_point_manually').click(function(event){
    var longitude = prompt("Insert longitude");
    var latitude = prompt("Insert latitude");
    $('#id_points_points').text('SRID=4326;MULTIPOINT((' + longitude + ' ' + latitude + '))');
    $('#id_points').hide();
    $('#manual_map').attr('src', 'http://maps.googleapis.com/maps/api/staticmap?center=' +
    longitude + ',' + latitude + '&zoom=13&size=400x400&markers=color:red%7C' +
    longitude + ',' + latitude + '&sensor=true');
  })
});

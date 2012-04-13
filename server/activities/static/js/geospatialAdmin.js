google.load('search', '1');

if (!window.jQuery) {
    google.load('jquery', '1.7.1');
}

google.setOnLoadCallback(function() {
    var $;
    if (window.jQuery) {
        $ = window.jQuery;
    } else if (django.jQuery) {
        $ = django.jQuery.noConflict();
    } else {
        $ = jQuery.noConflict();
    }
    console.log($)
    var className = "olwidgetgooglemapssearch";
    var formRow = ''+
'<div class="row cells-1 _address">'+
'    <div>'+
'       <div class="column span-4">'+
'        <label for="id__address" class="'+ className +'">Address:</label>'+
//'        <input name="_address" class="vTextField" maxlength="255" type="text" id="id_address">'+
//'        <p class="help">Or even coordinates.</p>'+
'       </div>'+
'    </div>'+
'</div>';
    console.log(formRow, $('.points'))
    $('.points').before(formRow);
    var searchControl = new google.search.SearchControl();
    var localSearch = new google.search.LocalSearch();
    var options = new google.search.SearcherOptions();
    options.setExpandMode(google.search.SearchControl.EXPAND_MODE_OPEN);
    searchControl.addSearcher(localSearch, options);
    $("."+ className).each(function() {
        var input = $(this);
        var idlocalSearch = input.attr('id') +"_"+ className;
        var currentSearch = input.val();
//        var imgInput = $("<img>");
//        imgInput.attr("src", input.val());
//        imgInput.css({
//            "border": "none",
//            "display": "block",
//            "padding-left": "105px"
//        });
//        input.after(imgInput);
//        var aLocalSearch = $("<a>");
//        aLocalSearch.attr("href", "void(0)");
//        aLocalSearch.html("Google Local");
//        aLocalSearch.css({
//            "padding": "2px 0 0 20px",
//            "background": "transparent url(http://groups.google.com/group/yotu/attach/8cf1ebf75cbb5215/google.png?part=29&thumb=1) no-repeat 2px 2px"
//        });
//        aLocalSearch.click(function() {
//            var toSearch = input.val() || "";
//            searchControl.execute(toSearch);
//            divLocalsSearch.toggle();
////            imgInput.toggle();
//            return false;
//        });
//        input.after(aLocalSearch);
        var divLocalsSearch = $("<div>");
        divLocalsSearch.attr("id", idlocalSearch);
        divLocalsSearch.addClass("column span-flexible");
//        aLocalSearch.after(divLocalsSearch);
         $('.'+ className).parent().after(divLocalsSearch);
//        divLocalsSearch.hide();
        searchControl.draw(document.getElementById(idlocalSearch));
//        var applyTo = [];
//        var inputClass = input.attr("class");
//        var pos = inputClass.indexOf(":");
//        if (pos != -1) {
//            applyTo = inputClass.substring(pos+1).split(",");
//        }
        var applyTo = ["points", "area"];
        $("div.gs-localResult").live("click", function() {
            var val = this.getElementsByClassName("gs-directions")[1];
            var href = decodeURIComponent(val.getAttribute("href"));
            var coords = $.urlParam(href, "daddr").split("@")[1].split(",");
            var address = [];
            var addressLines = this.getElementsByClassName("gs-addressLine");
            for(i=0; i<addressLines.length; i++) {
                address.push($(addressLines[i]).html());
            }
            input.val(address.join(", "));
            for(j=0; j<applyTo.length; j++) {
                var olObject = eval("olwidget_id_"+ applyTo[j]);
//                var latlon = new OpenLayers.LonLat(parseFloat(coords[1]), parseFloat(coords[0]));
                var latlon = new OpenLayers.LonLat.fromString(coords[1] +","+ coords[0]);
                latlon.transform(olObject.displayProjection, olObject.projection);
                olObject.panTo(latlon);
                olObject.zoomTo(9);
            }
            return false;
        });
        $(".olLayerGooglePoweredBy").remove();
    });
    $.urlParam = function(url, name){
        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
        return results[1] || "";
    }
});

django.jQuery(document).ready(function(){
    var expression = /\/career\/(\d+)\//;
    var re = new RegExp(expression);
    var match = document.referrer.match(re);
    if (match){
        var selector = 'select#id_career option[value=' + match[1] +']';
        django.jQuery(selector).attr("selected", "selected");
    }
});
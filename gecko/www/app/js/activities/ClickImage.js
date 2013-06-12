var ClickImage = {
    activity: null,
    viewer: null,
    goal_points: [{x:596, y:245, r: 3000}, {x: 302, y: 27, r: 3000}, {x: 465, y: 537, r: 3000}],
    pointers: [],
    coords: [],
    timer: null,
    is_dragging: null,
    score: null,
    setup: function(){
        $(document).on('click', '#confirmClickImage',function(e) {
          ClickImage.confirm();
        });
        ClickImage.is_dragging = false;     
  
        ClickImage.viewer = $("#clickImageImage").iviewer({
            src:"http://www.eltiempo.com/blogs/caja_de_resonancia/zappamothers.jpg", 
            zoom_base:100,
            ui_disabled:true,
            zoom_animation:false,
            onClick: function(ev, coords) {
               console.log(ClickImage.is_dragging);
               if (!ClickImage.is_dragging)
                   ClickImage.setMarker({x: coords.x, y: coords.y});
            },
            onAfterZoom: function(ev, new_zoom){
               if(ClickImage.coords != null)
               ClickImage.replaceMarkers();
            },
            onDrag: function (ev, point){
               if(ClickImage.coords != null)
               ClickImage.replaceMarkers();
            },
            onStartDrag: function (ev, point){
                ClickImage.is_dragging = true;
                console.log("start Drag");
            },
            onStopDrag: function (ev, point){
                setTimeout(function(){ClickImage.is_dragging = false;},100);
                console.log("stop Drag");
            }
        });
        $("#in").click(function(){ ClickImage.viewer.iviewer('zoom_by', 1); }); 
        $("#out").click(function(){ ClickImage.viewer.iviewer('zoom_by', -1); }); 
        $("#fit").click(function(){ ClickImage.viewer.iviewer('fit'); }); 
        $('#clickImage').live( 'pageshow',function(event){
           ClickImage.viewer.iviewer('update');
        });

    },
    refresh: function(){
    
    },
    setMarker: function(coords){
        ClickImage.coords.push(coords);
        ClickImage.pointers.push($("<div id='pointer'></div>"));
        $('.wrapper').append(ClickImage.pointers[ClickImage.pointers.length - 1]);

        console.log(coords);
        var offset = ClickImage.viewer.iviewer('imageToContainer', coords.x, coords.y);
        var containerOffset = ClickImage.viewer.iviewer('getContainerOffset');
        
        offset.x += containerOffset.left - 20;
        offset.y += containerOffset.top - 40;
        ClickImage.pointers[ClickImage.pointers.length - 1].css('display', 'block');
        ClickImage.pointers[ClickImage.pointers.length - 1].css('left', (offset.x - 9) +'px');
        ClickImage.pointers[ClickImage.pointers.length - 1].css('top', (offset.y - 22) +'px');
    },
    replaceMarkers: function(){
        for (var i=0; i<ClickImage.pointers.length;i++)
        {
            ClickImage.replaceMarker(ClickImage.pointers[i],ClickImage.coords[i]);
            var oSource = document.getElementById('clickImageImage');
            var oQuery = document.getElementById('clickImageActivityQuery');
            var sWidth = parseInt(window.getComputedStyle(oSource, null).width,10);
            var QueryHeight = parseInt(window.getComputedStyle(oQuery, null).height,10);
            var oTarget = document.getElementById('clickImageImage');
            var tTop = parseInt(ClickImage.pointers[i].css("top"),10);
            var tLeft = parseInt(ClickImage.pointers[i].css("left"),10);
            console.log(sWidth);
            console.log(QueryHeight);
            console.log(tTop);
            console.log(tLeft);
            if(tTop < 25 + QueryHeight)
            {
                ClickImage.pointers[i].hide();
            }
            if(tTop > 353  + QueryHeight)
            {
                ClickImage.pointers[i].hide();
            }
            if(tLeft < -14)
            {
                ClickImage.pointers[i].hide();
            }
            if(tLeft > sWidth - 15)
            {
                ClickImage.pointers[i].hide();
            }
        }
    },
    replaceMarker: function(marker,coords){
        console.log(marker);
        console.log(coords);
        var offset = ClickImage.viewer.iviewer('imageToContainer', coords.x, coords.y);
        var containerOffset = ClickImage.viewer.iviewer('getContainerOffset');
        
        offset.x += containerOffset.left - 20;
        offset.y += containerOffset.top - 40;
        marker.css('display', 'block');
        marker.css('left', (offset.x - 9)+'px');
        marker.css('top', (offset.y - 22)+'px');
    },
    confirm: function ()
    {
        ClickImage.score = 0;
        var numOfPoints = ClickImage.goal_points.length;
        var minDist = 1000000000;
        var tempDist;
        var candidate;
        for( var j=0; j< ClickImage.pointers.length; j++)
        {
            for (var i=0; i< ClickImage.goal_points.length; i++)
            {
                tempDist = Math.sqrt(Math.pow(ClickImage.coords[j].x - ClickImage.goal_points[i].x, 2) + Math.pow(ClickImage.coords[j].y - ClickImage.goal_points[i].y, 2)) * 60000;
                console.log(tempDist);
                if( tempDist < minDist )
                {
                    console.log("mejor");
                    candidate = i;
                    minDist = tempDist;
                }        
            }
            console.log(candidate);
            ClickImage.score += parseInt(100 - (minDist * 100) / ClickImage.goal_points[candidate].r, 10);
            //ClickImage.goal_points.splice(candidate,1);
        } 
        ClickImage.score = ClickImage.score / numOfPoints;
        if(ClickImage.score < 0)
        {
            ClickImage.score = 0;
        }
        if (ClickImage.score > 50) {

            $('#dialogText').html("bien"+"<br /><br />"+i18n.gettext('Score')+": "+ClickImage.score);
			//Dao.activityPlayed(ClickImage.activity.value.id, true, ClickImage.score);
        }
        else {
			if(ClickImage.score < 0){ClickImage.score = 0;}
  	        $('#dialogText').html("mal");
			//Dao.activityPlayed(ClickImage.activity.value.id, false, ClickImage.score);
			Workflow.toLevel = true;
        }
    }



};

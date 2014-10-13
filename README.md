# TopTip

A simple jQuery tooltip plugin

### Example usage
```JavaScript
$(document).ready(function(){
    $(selector).hover(function(){
        $(this).addTip({
            content: "you hovered.",    //html content of topTip Box
            //fromTop: 50,              //optional if you wish to manually place
            //fromLeft: 50,             //optional if you wish to manually place
            arrowPoint: 'left',         //direction of arrow point
            cross: false                //display optional cross to close the box   
        });
    },
    function(){
        $(this).addTip('removeTip');
    });

    $(selector).on("click",function(){
        $(this).addTip({
            content: "you clicked me.", //html content of topTip Box
            //fromTop: 50,              //optional if you wish to manually place
            //fromLeft: 50,             //optional if you wish to manually place
            arrowPoint: 'left',         //direction of arrow point
            cross: true                 //display optional cross to close the box   
        });
    });
});
```
### with callbacks
```JavaScript
//on add tip
$(selector).addTip({options:here},function(){
    //callback stuff here.                                         
});
//OR on remove tip
$(selector).addTip('removeTip',function(){ 
    //callback stuff here 
});
```

# TopTip

A simple jQuery tooltip plugin

### Example usage

```JavaScript
        //if you want to9 call a function when the cross is clicked you can add a call back funtion like so
        //
        //$(selector).addTip({options:here},function(){
        //      cal back stuff here.                                         
        //});
        //
        //you can also do the same when calling addTip('removeTip',function(){ callback stuff here });

        $(document).ready(function(){
            $('#hover').hover(function(){
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

            $("#click").on("click",function(){
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

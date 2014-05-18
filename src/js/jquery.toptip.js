;
(function ($) {
    "use strict";
    var tipBoxHtml = ["",
        "<div id='tip-point'> </div>",
        "<div id='tip-container'>",
            "<div id='tip-content'></div>",
        "</div>"].join("");

    // Settings list and the default values
    var defaults = {
        container: tipBoxHtml,                  // build the tipbox
        content: 'This is just a simple test.', // html content
        fromTop: undefined,                     // postion of tipbox from top
        fromLeft: undefined,                    // postion of tipbox from left            
        arrowPoint: 'left',                     // which way the arrow points
        cross: true                             // show close cross?
    };

    var d;  // final settings will be stored here

    var self;
    var tip;
    var arrow;
    var exit;

    var methods = {
        init: function (options) {

            if (d !== undefined) {
                d.fromTop = undefined;
                d.fromLeft = undefined;
            }

            exit = false; // if we need to exit scrip we can swap this flag to true for use later

            // gather default settings / overide any default
            d = $.extend(defaults, options);

            // if tipBox html doesnt exist build it
            if ($('#tip-container').length === 0) {
                $('body').prepend(d.container);
            }
            self = this;                // this is the element we are attaching the tip to
            tip = $('#tip-container');  // this is the tip box element
            arrow = $('#tip-point');    // this is the arrow element

            // add or remove cross based on user preference
            if (d.cross && $('#close-tip').length < 1) {
                tip.prepend("<span id='close-tip'></span>");
            }

            if (!d.cross && $('#close-tip').length > 0) {
                $('#close-tip').remove();
            }

            $('#tip-content').html(d.content); // fill tip box with content

            // wait untill element actually exists.
            var isElReady = setInterval(function () {

                if (self.length > 0 && tip.length > 0) {

                    if (d.cross) {
                        tip.css({
                            padding: '25px 10px 10px 10px'
                        });
                    } else {
                        tip.css({
                            padding: '10px'
                        });
                    }

                    methods.positionBox();      // call method to position the box
                    methods.positionArrow();    // call method to position the arrow


                    if (self.length > 0) {
                        $('#tip-container,#tip-point').unbind("fadeTo").fadeTo("fast", 1, function () {
                            if (d.cross) {
                                $('#close-tip').unbind("click").click(function () {
                                    $('#tip-container,#tip-point').unbind("fadeTo").fadeTo("fast", 0, function () {
                                        $(this).remove();
                                    });
                                });
                            }
                        });
                        clearInterval(isElReady);
                    }
                }
            }, 100);



        },
        positionBox: function () {

            tip = $('#tip-container'); // this is the tip box element
            var middle;
            var oHeight = ($(window).height() < self.outerHeight(true)) ? $(window).height() : self.outerHeight(true); // is the window height smaller than the element height?;
            var oWidth = ($(window).width() < self.outerWidth(true)) ? $(window).width() : self.outerWidth(true); // is the window width smaller than the element width?;

            if (d.fromTop === undefined) {

                middle = self.offset().top - ((tip.outerHeight(true) - oHeight) / 2);

                // work out correct distance from the top of the window we need to place the tip box
                switch (d.arrowPoint) {
                case 'top':

                    d.fromTop = (self.offset().top + self.outerHeight(true)) + 10;

                    break;
                case 'bottom':
                    d.fromTop = (self.offset().top - tip.outerHeight(true)) - 10;
                    break;
                }

                // work out correct distance from the top of the window we need to place the tip box
                // if the postion of the arrow is left or right
                var topBottom;
                if (d.arrowPoint === 'left' || d.arrowPoint === 'right') {
                    topBottom = ((self.offset().top + (self.outerHeight(true) / 2)) >= ($(window).height() / 2)) ? 'bottom' : 'top'; // bottom or top half of the window?
                }

                switch (topBottom) {
                case 'top':
                    d.fromTop = ((self.offset().top - tip.outerHeight(true)) < 0) ? (self.offset().top) - 5 : middle;
                    if (oHeight > tip.outerHeight(true)) {
                        d.fromTop = (middle < 0) ? d.fromTop : middle;
                    }
                    break;
                case 'bottom':
                    //(self.offset().top - tip.outerHeight(true) + oHeight) + 5
                    d.fromTop = ((middle + tip.outerHeight(true)) > $(window).height()) ? middle - ((middle + tip.outerHeight(true)) - $(window).height()) - 5 : middle;
                    if (oHeight > tip.outerHeight(true)) {
                        d.fromTop = (middle < 0) ? d.fromTop : middle;
                    }
                    break;
                }

            }

            if (d.fromLeft === undefined) {

                middle = ((oWidth - tip.outerWidth(true)) / 2) + self.offset().left;

                // work out correct distance from the left of the window we need to place the tip box
                switch (d.arrowPoint) {
                case 'left':
                    d.fromLeft = self.offset().left + self.outerWidth(true) + 15;
                    break;
                case 'right':
                    d.fromLeft = (self.offset().left - tip.outerWidth(true)) - 15;
                    break;
                }

                // work out correct distance from the left of the window we need to place the tip box
                // if the postion of the arrow is top or bottom
                var leftRight;
                if (d.arrowPoint === 'top' || d.arrowPoint === 'bottom') {
                    leftRight = ((self.offset().left + (self.outerWidth(true) / 2)) >= ($(window).width() / 2)) ? 'right' : 'left';
                }

                switch (leftRight) {
                case 'left':
                    d.fromLeft = ((self.offset().left - tip.outerWidth(true)) < 0) ? self.offset().left : middle;
                    if (oWidth > tip.outerWidth(true)) {
                        d.fromLeft = (middle < 0) ? d.fromLeft : middle;
                    }
                    break;
                case 'right':
                    d.fromLeft = ((middle + tip.outerWidth(true)) > $(window).width()) ? (self.offset().left + oWidth) - tip.outerWidth(true) : middle;
                    if (oWidth > tip.outerWidth(true)) {
                        d.fromLeft = (middle < 0) ? d.fromLeft : middle;
                    }
                    break;
                }

            }


            // if you try to push the tip box beyond the boundarys of the window 
            // we automatically swap the box to the opposite side

            // if the element consumes the whole window and there is no space for the top box then just dont bother.
            if ((self.offset().left < (tip.outerWidth(true) + 15)) &&
                    ($(window).width() - (self.offset().left + self.outerWidth(true)) < (tip.outerWidth(true) + 15)) &&
                    (self.offset().top < (tip.outerHeight(true) + 10)) &&
                    ($(window).height() - (self.offset().top + self.outerHeight(true)) < (tip.outerHeight(true) + 10))
                    ) {
                methods.removeTip();
                exit = true;
                return;
            }

            // if there is not enough space to the left or right of the element, move the tipbox to the bottom
            if ((d.arrowPoint === 'left' || d.arrowPoint === 'right')) {
                if ((self.offset().left < (tip.outerWidth(true) + 15)) && ($(window).width() - (self.offset().left + self.outerWidth(true)) < (tip.outerWidth(true) + 15))) {
                    d.arrowPoint = 'bottom';
                    d.fromTop = undefined;
                    d.fromLeft = undefined;
                    this.positionBox();
                }
            }

            // if there is not enough space at the above or below the element, move the tipbox to the left
            if ((d.arrowPoint === 'top' || d.arrowPoint === 'bottom')) {
                if ((self.offset().top < (tip.outerHeight(true) + 10)) && ($(window).height() - (self.offset().top + self.outerHeight(true)) < (tip.outerHeight(true) + 10))) {
                    d.arrowPoint = 'left';
                    d.fromTop = undefined;
                    d.fromLeft = undefined;
                    this.positionBox();
                }
            }

            // if there is not enough space above the element move the tipbox below the element
            if (d.arrowPoint === 'bottom' && d.fromTop < 0) {
                d.arrowPoint = 'top';
                d.fromTop = undefined;
                d.fromLeft = undefined;
                this.positionBox();
            }

            // if there is not enough space below the element move the tipbox above the element
            if (d.arrowPoint === 'top' && d.fromTop + tip.outerHeight(true) > $(window).height()) {
                d.arrowPoint = 'bottom';
                d.fromTop = undefined;
                d.fromLeft = undefined;
                this.positionBox();
            }

            // if there is not enough space to the left of the element move the tipbox to the right of the element
            if (d.arrowPoint === 'right' && d.fromLeft < 0) {
                d.arrowPoint = 'left';
                d.fromTop = undefined;
                d.fromLeft = undefined;
                this.positionBox();
            }

            // if there is not enough space to the right of the element move the tipbox to the left of the element
            if (d.arrowPoint === 'left' && d.fromLeft + tip.outerWidth(true) > $(window).width()) {
                d.arrowPoint = 'right';
                d.fromTop = undefined;
                d.fromLeft = undefined;
                this.positionBox();
            }

            tip.css({
                'top': d.fromTop,
                'left': d.fromLeft
            });

        },
        positionArrow: function () {

            if (exit === true) {
                return;
            }

            tip = $('#tip-container');  // this is the tip box element
            arrow = $('#tip-point');    // this is the arrow element

            var imgPos;         // arrow image background position
            var pointWidth;     // width of arrow element
            var pointHeight;    // height of arrow element
            var top;            // distance of arrow from top of tipbox
            var bottom;         // distance of arrow from bottom of tipbox
            var left;           // distance of arrow from left of tipbox
            var right;          // distance of arrow from right of tipbox

            var oHeight = ($(window).height() < self.outerHeight(true)) ? $(window).height() : self.outerHeight(true); // is the window height smaller than the element height?;
            var oWidth = ($(window).width() < self.outerWidth(true)) ? $(window).width() : self.outerWidth(true); // is the window width smaller than the element width?;

            switch (d.arrowPoint) {
            case 'left':
                imgPos = "-9px 0px";
                pointWidth = 9;
                pointHeight = 15;
                top = (self.offset().top + ((oHeight / 2) - (pointHeight / 2))) + 'px';
                bottom = 'auto';
                left = (d.fromLeft - pointWidth + 1) + 'px';
                right = 'auto';
                break;
            case 'right':
                imgPos = "0px 0px";
                pointWidth = 9;
                pointHeight = 15;
                top = (self.offset().top + ((oHeight / 2) - (pointHeight / 2))) + 'px';
                bottom = 'auto';
                left = ((d.fromLeft + tip.outerWidth(true)) - 1) + 'px';
                right = '-9px';
                break;
            case 'top':
                imgPos = "0px -24px";
                pointWidth = 16;
                pointHeight = 9;
                top = (d.fromTop - pointHeight + 1) + 'px';
                bottom = 'auto';
                left = (self.offset().left + ((oWidth / 2) - (pointWidth / 2))) + 'px';
                right = 'auto';
                break;
            case 'bottom':
                imgPos = "0px -15px";
                pointWidth = 15;
                pointHeight = 9;
                top = (d.fromTop + tip.outerHeight(true) - 1) + 'px';
                bottom = '-9px';
                left = (self.offset().left + ((oWidth / 2) - (pointWidth / 2))) + 'px';
                right = 'auto';
                break;
            }

            // set point css position etc
            arrow.css({
                backgroundPosition: imgPos,
                width: pointWidth,
                height: pointHeight,
                top: top,
                bottom: bottom,
                left: left,
                right: right
            });
        },
        removeTip: function () {

            tip = $('#tip-container'); // this is the tip box element

            if (tip.length > 0) {
                $('#tip-container,#tip-point').unbind("fadeTo").fadeTo('fast', 0, function () {
                    $(this).remove();
                });
            }

        }
    };

    $.fn.addTip = function (method) {

        // run the appropriate method
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }

        $.error('Method ' + method + ' does not exist on jQuery.toptip');
    };

}(jQuery));
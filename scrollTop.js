$(document).ready(function(e) {
    
	$.fn.center = function () {
	this.css('position', 'fixed').css({'margin':0});
    this.css({"top": 0});
    this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
    return this;
}
	// grab the initial top offset of the navigation 
    var sticky_navigation_offset_top = $('#main').find('#sub-header').offset().top;
     
    // our function that decides weather the navigation bar should have "fixed" css position or not.
    var sticky_navigation = function(){
        var scroll_top = $(window).scrollTop(); // our current vertical position from the top
        if (scroll_top > sticky_navigation_offset_top) { 
            $('#main').find('#sub-header').css({'z-index':999 }).center();
            $(window).scroll(function(){
                if($(this).scrollTop() > 155)
                    {
                        $(".back-top", "#side-column").filter('.overlapping').addClass('enabled');
                        
                    }else
                    {
                        $(".back-top", "#side-column").filter('.overlapping').removeClass('enabled');
                        $(".back-top", "#side-column").filter('.overlapping').addClass('outter')
                        
                    }
                
            });
            //Click event to scroll to top
            $("#side-column > a").click(function(){
                $(".back-top", "#side-column").filter('.overlapping').removeClass('enabled');
                $(".back-top", "#side-column").filter('.overlapping').addClass('outter');
                $('html, body').stop().animate({scrollTop : 0},800);
                
                return false;
                
            });
            
            
        } else {
            $('#sub-header').css({ 'position': 'relative', 'left': 0 });
            
        }   
	};
    // run our function on load
    sticky_navigation();
     
    // and run it again every time you scroll
    $(window).scroll(function() {
         sticky_navigation();
    });
	
});	

// detail module
define([ '../../assets/js/text!templates/detail.tpl',
         '../../assets/js/swipeview',
         '../../assets/js/slidein',
         '../../assets/js/handlebars',
         'modules/app',
         'modules/favourites',
         'modules/tumblr',
         'modules/captions'], 
function (  detailTpl, 
            swipe, 
            slideIn,
            handlebars,
            app,
            favourites,
            tumblr,
            captionSlide
) {     
   
   // SET ONCE : page elements
   var $detailContent = $('#detailContent'),
   ppp = app.config.ppp, // pics per page
   $topBar = $('#topBar'),
   $handle = $('#topBar .handle'),
   $btnBack = $('#topBar .btnBack'),
   $btnFav = $('#topBar .btnFav');
   
   // SET ONCE : events
   // back button
   $btnBack.on('click', function(){ 
      location.href='#/'+app.current.tumblrId;  
      return false;
   });   

   var detail={
      
      init: function(tumblrId, startPage){    
                     
         // reaching this page I suppose data has already been loaded in the previous view.  
      	var totalPictures;  	      	      	
      	if(app.current.tumblrId){
      	   totalPictures = tumblr[tumblrId].siteInfo.totalPictures;
      	   detail.initSwipeView(tumblrId, totalPictures, startPage);      	   
      	}else{
      	   // but if I land here directly then redirect to grid view
      	   location.href='#/'+tumblrId;
      	}    
      	  	 	
      },      
      
      initSwipeView: function(tumblrId, totalPictures, startPage){   
         
         var slides = tumblr[tumblrId].pictures,
         startPage = parseInt(startPage, 10);
               
         // clear content
         $detailContent.html('');	
                  
         // set new swipeview
   		var detailGallery = new SwipeView('#detailContent', { numberOfPages: totalPictures, loop: false});    	
   			  
   		// set topBar
         var topBar = new slideInMenu('topBar', false, 'top');
         topBar.close();  	
         $handle.on('click', function(){           
            topBar.toggle();
         });   
         
         // init add/remove favourites button
         favourites.setButton(tumblrId, $btnFav);     
         
         // set caption 
         captionSlide.init();  
                           
   		// handlebars template
   		var source = $(detailTpl).html();
         var template = Handlebars.compile(source);
         var context ={};     
             
   		// Load initial data
   		var detailGallery, el, i, page;
   		console.log(startPage);
         for (i=0; i<3; i++) {           
            page = (i+startPage)==0 ? slides.length+startPage-1 : i-1+startPage;    
            // render template
            context[i] ={
               bg: slides[page].thumb,
               img: slides[page].fullsize,
               caption: slides[page].caption
            } 
            console.log(i+' '+context[i].bg);
            // write to page (images loaded onFlip)          
            $(detailGallery.masterPages[i]).html(template(context[i]));     
            // load images
            detail.loadImage(detailGallery.masterPages[i]);             
         }    
                        
         // go to initial page  
         setTimeout(function(){
            detailGallery.goToPage(startPage);
            captionSlide.update();
         },0);
         
         // render on flip
         detailGallery.onFlip(function () {  
            // store landing page in grid
            app.current.gridPage = Math.floor(detailGallery.pageIndex/ppp); 
            var loadedPictures = tumblr[tumblrId].pictures.length; 
          	var el, upcoming, i;
            for (i=0; i<3; i++) {
                upcoming = detailGallery.masterPages[i].dataset.upcomingPageIndex;                  
                if (upcoming != detailGallery.masterPages[i].dataset.pageIndex) {                  
                  // render template
                  context[i] ={
                     bg: slides[upcoming].thumb,
                     img: slides[upcoming].fullsize,
                     caption: slides[upcoming].caption
                  }  
                  // write to page
                  $(detailGallery.masterPages[i]).html(template(context[i])); 
                  // load images
                  detail.loadImage(detailGallery.masterPages[i]);                  
               }
            } 
            // set caption
            captionSlide.update();
	      });	
	      
	      // close caption on move out      
	      detailGallery.onMoveOut(function () {
            captionSlide.closeWithoutAnimation();
         });
         
         // expose our gallery
         detail.gallery = detailGallery;
      },
      loadImage: function(el){         
         var el = $(el);           
         var imgToLoad = el.find('img');
         imgToLoad.bind('load', function(){               
            var src = imgToLoad.attr('src'); 
            imgToLoad.parent().addClass('loaded').attr('style',"background:url("+src+") 50% no-repeat");
         });    
      }       
   }     
   return detail;
});

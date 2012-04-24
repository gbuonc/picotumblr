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
      	   totalPictures = tumblr.sites[tumblrId].siteInfo.totalPictures;
      	   detail.initSwipeView(tumblrId, totalPictures, startPage);      	   
      	}else{
      	   // but if I land here directly then redirect to grid view
      	   $('#detail').removeClass('current');
      	   location.href='#/'+tumblrId;
      	}          	  	 	
      },      
      
      initSwipeView: function(tumblrId, totalPictures, startPage){   
         var slides = tumblr.sites[tumblrId].pictures,
         startPage = parseInt(startPage, 10);         
         // destroy previews detailGalleries
         if(detail.gallery){
            detail.gallery.destroy();
         }               
         // clear content
         $detailContent.html('');          
         
         // set new swipeview
   		var detailGallery = new SwipeView('#detailContent', { numberOfPages: totalPictures, loop: false});
   		detailGallery.totalSwipes = 0;
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

		   // go to initial page  
         setTimeout(function(){
            detailGallery.goToPage(startPage);
            captionSlide.update();
         },0);
         
         // render on flip
         detailGallery.onFlip(function () {
            // can swipe all way to last picture
            // but need to preload next two pages in grid when swiping too much without going back...
            if((slides.length-detailGallery.pageIndex) <= (ppp*2)){
               tumblr.getData(tumblrId, {}, function () {
               });
            }
            // store landing page in grid
            app.current.gridPage = Math.floor(detailGallery.pageIndex/ppp); 
            var loadedPictures = tumblr.sites[tumblrId].pictures.length; 
          	var el, upcoming, i;  
          	if (detailGallery.direction === 'forward') { 
               detailGallery.totalSwipes+=1;  
            }     
            for (i=0; i<3; i++) {
               upcoming = detailGallery.masterPages[i].dataset.upcomingPageIndex;
               // fixed a problem occurring when startPage < 3  (sort of)
               // to do: check if the same occurs with last 3 images of entire collection
               if(((startPage <=2) && (detailGallery.totalSwipes<=1) 
                  || (upcoming != detailGallery.masterPages[i].dataset.pageIndex)) 
                  && (upcoming <= loadedPictures)){
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
               // hide image at position -1
               if(detailGallery.pageIndex===0){               
                  $(detailGallery.masterPages[0]).find('.cell').addClass('hidden');              
               }
               // hide image after last image in array
               if(detailGallery.pageIndex === totalPictures-1){
                  $(detailGallery.masterPages[1]).find('.cell').addClass('hidden');
               }
               // set caption
               captionSlide.update();   
            }   	            
	      });		      
	      // close caption on move out      
	      detailGallery.onMoveOut(function () {
            captionSlide.closeWithoutAnimation();
         });
         
         // expose our gallery
         detail.gallery = detailGallery;
      },
      loadImage: function(el){   
         var el = $(el),           
         imgToLoad = el.find('img'); 
         imgToLoad.bind('load', function(){               
            var src = imgToLoad.attr('src'); 
            imgToLoad.parent().addClass('loaded').attr('style',"background:url("+src+") 50% no-repeat");
         });         
      }       
   }     
   return detail;
});

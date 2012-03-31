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
   // back button
   var btnBack = $('#topBar .btnBack');
   btnBack.on('click', function(){ 
      location.href='#/'+app.current.tumblrId;  
      return false;
   });    
   var ppp = app.config.ppp; // pics per page
   var detail={
      init: function(tumblrId, startPage){   
         // check if tumblr is a favourite or not and set fav button
         var btnFav = $('#topBar .btnFav');        
         // get an array of id values (underscore.js)
         var temp = _.pluck(favourites.sites, 'id'); 
         // get current elment index     
         var pos = temp.indexOf(tumblrId) === -1; 
         console.log(pos);
         var txt = pos? 'add': 'remove';
         //var func = function(){ pos? favourites.add(tumblrId, tumblr[tumblrId].siteInfo.avatar) : favourites.remove(tumblrId)}; 
         btnFav.html(txt);
         btnFav.on('click', function(){
            if(pos){
               favourites.add(tumblrId, tumblr[tumblrId].siteInfo.avatar);
               $(this).html('remove');
            }else{
               favourites.remove(tumblrId);
               $(this).html('add');
            }            
         });    
         // reaching this page I suppose data has already been loaded in the previous view.                
      	var totalPictures;  	      	      	
      	if(app.current.tumblrId){
      	   totalPictures = tumblr[tumblrId].siteInfo.totalPictures;
      	   detail.initSwipeView(tumblrId, totalPictures, startPage);      	   
      	}else{
      	   // If I land here directly redirect to grid view
      	   location.href='#/'+tumblrId;
      	}      	 	
      },
      initSwipeView: function(tumblrId, totalPictures, startPage){  
         var slides = tumblr[tumblrId].pictures,
         $detailContent = $('#detailContent'),
         $topBar = $('#topBar');        
         // converts start page from string to integer
         var startPage = parseInt(startPage, 10);           
         // clear
         $detailContent.html('');	 
   		var detailGallery = new SwipeView('#detailContent', { numberOfPages: totalPictures, loop: false});   
   		// topBar
         var topBar = new slideInMenu('topBar', false, 'top');
         topBar.close();   		
   		// show/hide topbar on click            
         detailGallery.onClick(function(){
            topBar.toggle();           
         });    
         
         // captions     
         captionSlide.init();
                    
   		// handlebars template
   		var source = $(detailTpl).html();
         var template = Handlebars.compile(source);
         var context ={};
   		// Load initial data
   		var detailGallery, el, i, page;
         for (i=0; i<3; i++) {
            page = (i+startPage)==0 ? slides.length+startPage-1 : i-1+startPage;            
            // render template
            context[i] ={
               bg: slides[page].thumb,
               img: slides[page].fullsize,
               caption: slides[page].caption
            }  
            $(detailGallery.masterPages[i]).html(template(context[i]));  
            $('.cell img').bind('load', function(){	
               $(this).parent().addClass('loaded');	
            });           
         }                   
         // set initial page  
         setTimeout(function(){
            detailGallery.goToPage(startPage);
            captionSlide.update();
         },0);
         
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
                  $(detailGallery.masterPages[i]).html(template(context[i])); 
                  $('.cell img').bind('load', function(){	
                     var path = $(this).attr('src');
                     $(this).parent().addClass('loaded').attr('style',"background:url("+path+") 50% no-repeat");	
                  }); 
               }
            }                
            // add caption to bottom box
            captionSlide.update();
	      });	      
	      detailGallery.onMoveOut(function () {
            captionSlide.closeWithoutAnimation();
         });
         detail.gallery = detailGallery;
      }  
   }     
   return detail;
});

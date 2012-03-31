// grid module
define([
   '../../assets/js/text!templates/info.tpl',
   '../../assets/js/text!templates/grid.tpl', 
   '../../assets/js/handlebars',
   '../../assets/js/swipeview',
   'modules/app',
   'modules/history',
   'modules/tumblr'], 
   function (
      infoTpl,
      gridTpl, 
      handlebars,
      swipe,
      app,
      history,
      tumblr) {   

   var currentPage = document.getElementById('grid'),
   content = $('#gridContent'),
   ppp = app.config.ppp, // pics per page
   buffer = app.config.buffer, // pics to preload
   totalPictures,
   totalPages,
   picsToLoad;   
   
   // back button
   var btnBack = $('#headerInfo .btnBack');
   btnBack.live('click', function(){       
      location.href='#/';  
      return false;
   }); 
   
   var grid = {
      init: function (tumblrId) {
         app.current.reset(tumblrId);
         content.html('');    
         // show loadbar (just in case)
         app.showLoadbar();     
         tumblr.getData(tumblrId, function () {
            // get total pictures and calculate total pages
            totalPictures = tumblr[tumblrId].siteInfo.totalPictures;
            totalPages = (totalPictures % ppp === 0) ? totalPictures / ppp : Math.floor((totalPictures / ppp) + 1);
            // calculate how many pics to buffer
            picsToLoad =(totalPictures< buffer)?totalPictures:buffer;      
            // handlebars template  
            var source = $(infoTpl).html();
            var template = Handlebars.compile(source);
            content.html(template(tumblr[tumblrId].siteInfo));   
                        
            // save current site to recent array          
            history.save(tumblrId, tumblr[tumblrId].siteInfo.avatar); 
               
            // buffer pics or init swipe
            if (tumblr[tumblrId].pictures.length < picsToLoad) {
               grid.loadPictures(tumblrId);
            } else {               
               grid.initSwipeView(tumblrId);
            }
         });
      },      
      loadPictures: function (tumblrId) {
         tumblr.getData(tumblrId, function () {
            if (tumblr[tumblrId].pictures.length < picsToLoad) {
               grid.loadPictures(tumblrId);
            } else {
               grid.initSwipeView(tumblrId);
            }
         });
      },      
      initSwipeView: function (tumblrId, totalPictures) {         
         var slides = tumblr[tumblrId].pictures;
      
         var gridGallery = new SwipeView('#gridContent', {
            numberOfPages: totalPages,
            loop: false,
            vertical: true
         });
         grid.gridGallery = gridGallery;
         // handlebars template  
         var source = $(gridTpl).html();
         var template = Handlebars.compile(source);
         
         // hide loadbar
         app.hideLoadbar();
         // show header info
         $('#headerInfo').addClass('loaded');
         
         // Load initial pics
         var gridGallery, el, i, page;
         //var currentPage = parseInt(gridGallery.pageIndex+1, 10);
         for (i = 0; i < 3; i++) {
            page = i === 0 ? 3 : i - 1;
            //currentPage = page;
            // render template      
            Handlebars.registerHelper('eachThumb', function (pictures, block) {               
               var ret = '';
               for (var i = page * ppp; i < ppp + (ppp * page); i++) {
                  if(pictures[i]){                    
                     ret = ret + '<a href="#/' + tumblrId + '/' + i + '" style="background-image:url('+pictures[i].thumb+')"><img src="' + pictures[i].thumb + '"></a>';
                  }                  
               }
               return ret;
            });
            $(gridGallery.masterPages[i]).html(template(tumblr[tumblrId]));  
            $('.thumbnails > a').find('img').bind('load', function(){   
               $(this).unbind().parent('a').addClass('loaded');    
            });                     
         }
         
         // load additional pics
         gridGallery.onFlip(function () {
            // store current page in grid
            app.current.gridPage = gridGallery.pageIndex;  
            
            var el, upcoming, i,
            picsLoaded = (gridGallery.pageIndex*ppp)+ppp,
            pagePreloaded = (tumblr[tumblrId].pictures.length % ppp === 0) ? tumblr[tumblrId].pictures.length / ppp : Math.floor((tumblr[tumblrId].pictures.length / ppp) + 1);
            currentPage = parseInt(gridGallery.pageIndex+1, 10);              
            // load more pics when scrolling forward (leave 1 page buffer)
            if (gridGallery.direction === 'forward') {    
               if(currentPage+2===pagePreloaded){                  
                  tumblr.getData(tumblrId);
               }                              
            }                       
            for (i = 0; i < 3; i++) {
               upcoming = gridGallery.masterPages[i].dataset.upcomingPageIndex;
               if (upcoming != gridGallery.masterPages[i].dataset.pageIndex) {                     
                  // render template      
                  Handlebars.registerHelper('eachThumb', function (pictures, block) {
                     var ret = '';
                     firstPic=upcoming*ppp,
                     lastPic=parseInt((upcoming*ppp)+ppp, 10);                                                
                     for (var i=firstPic; i<lastPic; i++) {
                        if(pictures[i]){
                           ret = ret + '<a href="#/' + tumblrId + '/' + i + '" style="background-image:url('+pictures[i].thumb+')"><img src="' + pictures[i].thumb + '"></a>';
                        }                  
                     }
                  return ret;
                  });
                  $(gridGallery.masterPages[i]).html(template(tumblr[tumblrId]));  
                  $('.thumbnails > a').find('img').bind('load', function(){   
                     $(this).unbind().parent('a').addClass('loaded');   
                  });            
               }
            }
         });
         grid.gallery = gridGallery;
      },
      gotoPage: function(page){
         setTimeout(function(){
            grid.gridGallery.goToPage(page);
         },0);
      }      
   }
   return grid;
});
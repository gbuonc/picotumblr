// grid module
define([
   '../../assets/js/text!templates/info.tpl',
   '../../assets/js/text!templates/grid.tpl', 
   '../../assets/js/handlebars',
   '../../assets/js/swipeview',
   'modules/app',
   'modules/tabs',
   'modules/tumblr'], 
   function (
      infoTpl,
      gridTpl, 
      handlebars,
      swipe,
      app,
      tabs,
      tumblr) {   
         
   // SET ONCE : page elements
   var currentPage = document.getElementById('grid'),
   page = $('#grid'),
   content = $('#gridContent'),
   ppp = app.config.ppp, // pics per page
   buffer = app.config.buffer, // pics to preload,
   startPage = 0,
   totalPictures,
   totalPages,
   picsToLoad;   
   
   // SET ONCE : events
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
         app.showLoadbar('mainApp');           
         tumblr.getData(tumblrId,{},function () {
            // get total pictures and calculate total pages
            totalPictures = tumblr.sites[tumblrId].siteInfo.totalPictures;
            totalPages = (totalPictures % ppp === 0) ? totalPictures / ppp : Math.floor((totalPictures / ppp) + 1);
            // calculate how many pics to buffer
            picsToLoad =(totalPictures< buffer)?totalPictures:buffer;      
            // handlebars template  
            var source = $(infoTpl).html();
            var template = Handlebars.compile(source);
            // ------------------------------------------------------
            // just showing a usable grid when debugging via desktop
            if(!$.os.touch){
               tumblr.sites[tumblrId].siteInfo.overflow='overflow:hidden';
            }           
            // ------------------------------------------------------
            page.html(template(tumblr.sites[tumblrId].siteInfo));                         
            // buffer pics or init swipe
            if (tumblr.sites[tumblrId].pictures.length < picsToLoad) {
               grid.loadPictures(tumblrId);
            } else {               
               grid.initSwipeView(tumblrId);
            }
         });
      },      
      loadPictures: function (tumblrId) {
         tumblr.getData(tumblrId,{}, function () {
            if (tumblr.sites[tumblrId].pictures.length < picsToLoad) {
               grid.loadPictures(tumblrId);
            } else {
               grid.initSwipeView(tumblrId);
            }
         });
      },      
      initSwipeView: function (tumblrId, totalPictures) { 
         var slides = tumblr.sites[tumblrId].pictures;         
         // destroy previews grids
         if(grid.gallery){
            grid.gallery.destroy();
         }     
         var gridGallery = new SwipeView('#gridContent', {
            numberOfPages: totalPages,
            loop: false,
            vertical: true
         });
         grid.gridGallery = gridGallery;
         gridGallery.totalSwipes = 0;
         // handlebars template  
         var source = $(gridTpl).html();
         var template = Handlebars.compile(source);
         
         // hide loadbar
         app.hideLoadbar();
         // show header info
         $('#headerInfo').addClass('loaded');
         
         // go to initial page (wait for headerInfo animation to end)
         var go = window.setTimeout(function(){
           grid.gotoPage(0, tumblrId); 
           window.clearTimeout(go);
         }, 400);
         // render on flip
         gridGallery.onFlip(function () {
            // store current page in grid
            app.current.gridPage = gridGallery.pageIndex;                  
            var el, upcoming, i,
            picsLoaded = (gridGallery.pageIndex*ppp)+ppp,
            pagePreloaded = (tumblr.sites[tumblrId].pictures.length % ppp === 0) ? tumblr.sites[tumblrId].pictures.length / ppp : Math.floor((tumblr.sites[tumblrId].pictures.length / ppp) + 1);
            currentPage = parseInt(gridGallery.pageIndex+1, 10);              
            // load more pics when scrolling forward
            if (gridGallery.direction === 'forward') { 
               gridGallery.totalSwipes +=1;
               tumblr.getData(tumblrId);
            }                       
            for (i = 0; i < 3; i++) {
               upcoming = gridGallery.masterPages[i].dataset.upcomingPageIndex;               
               if(((startPage <=2) && (gridGallery.totalSwipes<=1) 
                  || (upcoming != gridGallery.masterPages[i].dataset.pageIndex)) 
                  && (upcoming <= picsLoaded)){            
                  // render template      
                  Handlebars.registerHelper('eachThumb', function (pictures, block) {
                     var ret = '';
                     firstPic=upcoming*ppp,
                     lastPic=parseInt((upcoming*ppp)+ppp, 10);                                                
                     for (var i=firstPic; i<lastPic; i++) {
                        if(pictures[i]){
                           ret = ret + '<a href="#/' + tumblrId + '/' + i + '" style="background-image:url('+pictures[i].thumb+')"></a>';
                        }                  
                     }
                  return ret;
                  });
                  $(gridGallery.masterPages[i]).html(template(tumblr.sites[tumblrId]));  
                  // if first page loaded fadein thumbnail, otherwise show them immediatly
                  if(gridGallery.totalSwipes === 0){
                     $('#swipeview-masterpage-1 .thumbnails > a').each(function(i, el){
                     i = i++;
                     var delayTime = i*100;
                     var fade = window.setTimeout(function(){
                        $(el).addClass('loaded');
                        window.clearTimeout(fade);
                     }, delayTime);              
                     });
                     $('#swipeview-masterpage-2 .thumbnails > a').each(function(i, el){
                        $(el).addClass('loaded');                   
                     });                       
                  }else{
                     $('.thumbnails > a').each(function(i, el){
                        $(el).addClass('loaded');                   
                     }); 
                  }
               }
               // hide page at position -1
               if(gridGallery.pageIndex===0){               
                  $(gridGallery.masterPages[0]).find('.thumbnails').addClass('hidden');              
               }
               // hide page next to last one in array
               if(gridGallery.pageIndex === totalPages-1){
                  // calculate last masterpage via modulus 3
                  var mod = (gridGallery.pageIndex+2)%3;
                  $(gridGallery.masterPages[mod]).find('.thumbnails').addClass('hidden');
               }
               // when there's only one page show page 1 and hide page 2
               if(totalPages == 1){
               $(gridGallery.masterPages[1]).find('.thumbnails').removeClass('hidden');
               $(gridGallery.masterPages[2]).find('.thumbnails').addClass('hidden');
               }
            }
         });
         grid.gallery = gridGallery;
      },
      gotoPage: function(page, tumblrId){  
         // save current site to recent array 
         tabs.add(tumblrId, tumblr.sites[tumblrId], 'history');      
         setTimeout(function(){
            grid.gridGallery.goToPage(page);
         },0);
      }
        
   }
   return grid;
});
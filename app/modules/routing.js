define([
   '../../assets/js/director', 
   'modules/app', 
   'views/home', 
   'views/grid', 
   'views/detail'], 
   function (
      director, 
      app, 
      homeView, 
      gridView, 
      detailView) { 
            
   var $mainApp = $('#mainApp'),
   $searchInput = $('#tid');
   
   // ***************************  
   // show web layout for desktop debugging purpose
   var ua = (navigator.userAgent.toLowerCase().match('ipod|iphone|android') ? 'mobile' : 'web');
   if(ua === 'web'){
      $mainApp.addClass('window');
   }; 
   // ***************************  
   // ROUTING
   var router = Router({
      '/':{
         on: function(){  
            // refresh history list
            setTimeout(function(){
               homeView.init();            
            }, 0);            
         	view.currentBackAnim = 'slidedown';
            view.changeView('home', 'slideup');
         },
         after: function(){
            setTimeout(function(){
               // reset search form
               $searchInput.val('');   
            }, 500)         
         }
      },
      '/:tumblrId': {   
         on: function(tumblrId){    
            view.changeView('grid', 'slideleft');               
               if(app.current.tumblrId === tumblrId){ 
                  // if site already loaded simply switch back and change current page view without reinitialising     
                  app.hideLoadbar();
                  gridView.gotoPage(app.current.gridPage);                      
               }else{
                  // if new site reinitialise gallery                   
                  gridView.init(tumblrId);                
               } 
            view.currentBackAnim = 'slideright';
         }   
      },
      '/:tumblrId/:imgId': {           
         on: function(tumblrId, imgId){            
            view.changeView('detail', 'slideleft'); 
            detailView.init(tumblrId, imgId); 
            view.currentBackAnim = 'slideright';
         }   
      }                
   });   
   // VIEWS
   var view = {   
      currentBackAnim: '',
      goingBack: false,
      changeView: function(page, transition){  
         var startPage = $('.current'),
         landingPage = $('#'+page),
         // if we're tapping back button then use back animation       
         effect = (view.goingBack === true)?view.currentBackAnim:transition;
         view.goingBack = false;     
         if (landingPage.hasClass('current')) {
            return false;
         }else{
            if(effect === 'slideright' || effect === 'slideleft' || 'slideup' || 'slidedown'){
               startPage.addClass('anim '+effect+' out');
            }        
             // do page transitions
            landingPage.addClass('anim '+effect+' in'); 
            $mainApp.bind('webkitAnimationEnd', function(){
               startPage.attr('class', 'view');
               landingPage.attr('class', 'current view');               
            });            
         }
      }   
   };   
   return router;
});

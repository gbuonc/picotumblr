define([
   '../../assets/js/director', 
   'modules/app', 
   'modules/tabs',
   'views/home', 
   'views/grid', 
   'views/detail'], 
   function (
      director, 
      app, 
      tabs,
      homeView, 
      gridView, 
      detailView) {             
   var $mainApp = $('#mainApp'),
   $searchInput = $('#tid');
   // ROUTING
   var router = Router({
      '/':{
         on: function(){  
            // refresh history list
            setTimeout(function(){
            //homeView.init();  
            tabs.writeTabs();         
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
         before: function(tumblrId){
            if(app.current.tumblrId === tumblrId){ 
                  // if site already loaded simply switch back and change current page view without reinitialising     
                  app.hideLoadbar();
                  gridView.gotoPage(app.current.gridPage, tumblrId);                      
            }else{
               // if new site reinitialise gallery                   
               gridView.init(tumblrId);                
            } 
         },
         on: function(tumblrId){    
            view.changeView('grid', 'slideleft');
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
         pages = $('.view'),
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
               pages.attr('class', 'view');
               landingPage.attr('class', 'current view');               
            });            
         }
      }   
   };   
   return router;
});

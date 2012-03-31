define(['../../assets/js/lawnchair'], function(Lawnch){  
   $firstLoad = $('#firstLoad');
   loadbar = $('#loadbarWrapper');
   var app = {
      config:{
         ppp: 20, // pics per page
         buffer:80 // pics to preload
      },            
      current:{
         tumblrId:null,
         gridPage:0,
         detailPic:0,
         animation:'none',
         reset:function(tid){
            app.current.tumblrId = tid;
      	   app.current.gridPage = 0;
      	   app.current.detailPic=0;
      	   app.current.animation='none';
         },
      },
      init: function(){         
         // detect if webapp is saved in home
      	if(window.navigator.standalone){
      		$('body').bind('touchmove', function(e){ 
            	e.preventDefault();             
         	});
      	}else{
      		window.scrollTo(0,0.9);
      	}
      	// init lawnchair
         app.storage = Lawnchair({name:'tme'}, function(){});  
         // set initial database if doesn't already exits           
         app.storage.get("tme", function(obj){ 
            if(obj === null){
               var list = {
                  history:[],
                  favs:[]            
               }; 
               app.storage.save({key:"tme",value:list}); 
            }
         });                  
         // Init modules       
      	require(["modules/history", "modules/favourites", "modules/routing"], function(history, favourites, router){            
            history.init();
            favourites.init();
            router.init();
            if(router.getRoute() ==''){  
               location.href='#/';  
            };
            // hide initial loadbar
            $firstLoad.hide();
         }); 
      }, 
      goto: function(page){
         console.log('going to '+page);
      }, 
      showLoadbar: function(){
         loadbar.addClass('visible');
      },
      hideLoadbar: function(){
         loadbar.removeClass('visible');
      },      
      errors:{
         showAlert: function(desc){
           alert(desc);         
         },
         message: {
            empty: 'Please enter a valid tumblr ID',  
            404:'The site you entered doesn\'t exist.',
            503:'Tumblr seems down at the moment. Please try again later.', 
            noPictures: 'This tumblr doesn\'t contain pictures.',
            noConnection: 'No internet connection detected',
            generic:'An error occurred. Please try again later.'
         }     
      },
      showMessage: function(msg){
         alert(msg);
      }           
   };
   return app;
});

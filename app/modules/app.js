define(['../../assets/js/lawnchair'], function(Lawnch){        
   // Array Remove - By John Resig (MIT Licensed)
   Array.prototype.remove = function(from, to) {
     var rest = this.slice((to || from) + 1 || this.length);
     this.length = from < 0 ? this.length + from : from;
     return this.push.apply(this, rest);
   };
      
   var app = {
      config:{         
         ppp: 20, // pics per page
         buffer:4*config.ppp, // pics to preload
         storageId: 'local'
      },  
      history:{},
      favs:{}, 
      rels:{},            
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
      // interface elements
      $mainApp: $('#mainApp'),
      $loadbar: $('#loadbarWrapper'),
      
      init: function(){     
         // ***************************  
         // show web layout for desktop debugging purpose
         var ua = (navigator.userAgent.toLowerCase().match('ipod|iphone|android') ? 'mobile' : 'web');
         if(ua === 'web'){
            app.$mainApp.addClass('window');
         }; 
         // ***************************  
         // detect if webapp is saved in home
      	if(window.navigator.standalone){
      		$('body').bind('touchmove', function(e){ 
            	e.preventDefault();             
         	});
      	}else{
      		window.scrollTo(0,1);
      	}
      	// init lawnchair
         app.storage = Lawnchair({name:app.config.storageId}, function(){});  
         // set initial database if doesn't already exits           
         app.storage.get(app.config.storageId, function(obj){ 
            if(obj === null){
               var list = {
                  history:[],
                  favs:[],
                  rels:[]          
               }; 
              app.storage.save({key:app.config.storageId, value:list}, function(){}); 
            }
         });  
      	//set start URL  
      	require(["modules/routing"], function(router){            
            router.init();  
               if(router.getRoute() ==''){  
               location.href='#/';  
            };          
         });   
      	//Init tabs       
      	require(['modules/tabs'], function(tabs){    
      	   tabs.init();      	  
      	});       	
      }, 
      showLoadbar: function(){         
         app.$loadbar.addClass('visible');
      },
      hideLoadbar: function(){
         app.$loadbar.removeClass('visible');
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

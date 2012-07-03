define(
   ['../../assets/js/lawnchair', 'modules/app', 'modules/polling'], 
   function(Lawnch, app, polling){        
   // Array Remove - By John Resig (MIT Licensed)
   Array.prototype.remove = function(from, to) {
     var rest = this.slice((to || from) + 1 || this.length);
     this.length = from < 0 ? this.length + from : from;
     return this.push.apply(this, rest);
   };
      
   var app = {
      config:{
         ppp: 20, // pics per page
         buffer:80 // pics to preload
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
      
      init: function(){    
      	// init lawnchair
         app.storage = Lawnchair({name:'test'}, function(){});  
         // set initial database if doesn't already exits           
         app.storage.get("test", function(obj){ 
            if(obj === null){
               var sites = [];
               // var list = {
               //                   history:[],
               //                   favs:[],
               //                   rels:[]          
               //                }; 
              app.storage.save({key:app.config.storageId,value:sites}, function(){}); 
            }
         }); 
         var form = $('.searchForm'); 
         // check submitted value
         form.bind('submit', function(e){
            var tumblrId = $(this).find('input').attr('value');
            if (tumblrId === '') {
               app.errors.showAlert(app.errors.message.empty);     
            } else {           
               //app.showLoadbar('mainApp');
            	//tumblr.getData(tumblrId,{},function(){   	   
            	   // location.href='#/'+tumblrId;
            	   
            	//}); 
            	$('#mainWrap').append(tumblrId);
            }
            e.preventDefault(); 
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

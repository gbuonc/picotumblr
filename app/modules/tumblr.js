// tumblr
define(['modules/app', 'modules/routing'],function (app, router) {
   var apiKey = 'XlCJ1kpxkFjgblfrnXXm6LE1hfYcmf56jaru6PynxidzEfFJVe';
   var $hiddenPreload = $('#hiddenPreload');
   tumblr ={
      getData: function(tumblrId, callback){
		// get current site		
		tumblrId = tumblrId || router.getRoute(0);
		// create new empty object or add to existing one
		tumblr[tumblrId]=tumblr[tumblrId] ||{};
		tumblr[tumblrId].pictures = tumblr[tumblrId].pictures ||[];
		var offset= tumblr[tumblrId].pictures.length || 0;
      urlToGet = 'http://api.tumblr.com/v2/blog/'+tumblrId+'.tumblr.com/posts/photo?';
		urlToGet +='offset='+offset+'&limit=20&api_key='+apiKey+'&jsonp=?';
     	$.ajax({
           url: urlToGet,            
           success: function(data) { 
               var status = data.meta.status;
               if(status === 200){
                  // --------------------------------
                  if(data.response.total_posts === 0){   
                     app.hideLoadbar();
                     app.errors.showAlert(app.errors.message.noPictures);    
                     return;                                                         
                  }
				      // populate site info object (first time only)
      				if(!tumblr[tumblrId].siteInfo){
      					tumblr[tumblrId].siteInfo ={
	                     title:data.response.blog.title,
	                     description:data.response.blog.description,
	                     totalPictures:data.response.total_posts,
	                     avatar: 'http://api.tumblr.com/v2/blog/'+tumblrId+'.tumblr.com/avatar/96' 
      	            }
      				}
                  // get pictures
                  var picts=data.response.posts; 
      				for(i=0; i< picts.length; i++){
      					// get the pic before last item in the alt_sizes array to get image to use as thumbnail
      					thumbnail = picts[i].photos[0].alt_sizes.length-2;
      					tumblr[tumblrId].pictures[i+offset]={      					   
      					   thumb:picts[i].photos[0].alt_sizes[thumbnail].url,
      						fullsize:picts[i].photos[0].alt_sizes[0].url,		
      						caption:picts[i].caption         						
         				}					
      				} 		
   				   if(callback){
   				      callback();
   				   }
                 // ----------------------------------          
               }else{                  
                  if(app.errors.message[status]){
                     // show error code
                     app.hideLoadbar();
                     app.errors.showAlert(app.errors.message[status]);
                  }else{
                     // generic error   
                     app.hideLoadbar();       
                     app.errors.showAlert(app.errors.message.generic);		
                  }  
               }               
            },
            error: function(xhr, type) {
               // generic error  
               app.hideLoadbar();           
               app.errors.showAlert(app.errors.message.generic);      
           }
         });
      }
   }
   return tumblr;
});


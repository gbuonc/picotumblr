// tumblr
define(['../assets/js/moment.js','modules/app', 'modules/routing'],function (mom, app, router) {
   var apiKey = 'XlCJ1kpxkFjgblfrnXXm6LE1hfYcmf56jaru6PynxidzEfFJVe';
   var $hiddenPreload = $('#hiddenPreload');
   tumblr ={
      sites:{},
      getData: function(tumblrId, options, callback){      
         var config = {showErrors : true};
         $.extend(config, options);
   		// get current site		
   		tumblrId = tumblrId || router.getRoute(0);
   		// create new empty object or add to existing one
   		
		   tumblr.sites[tumblrId]=tumblr.sites[tumblrId] ||{};
   		tumblr.sites[tumblrId].pictures = tumblr.sites[tumblrId].pictures ||[];
   		var offset= tumblr.sites[tumblrId].pictures.length || 0;
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
                     if(config.showErrors){
                        app.errors.showAlert(app.errors.message.noPictures);
                     }                         
                     return;                                                         
                  }    
				      // populate site info object (first time only)
      				if(!tumblr.sites[tumblrId].siteInfo){
      					tumblr.sites[tumblrId].siteInfo ={
	                     title:data.response.blog.title,
	                     //description:data.response.blog.description,
	                     updateTime: data.response.blog.updated,
	                     updated: moment(moment.unix(data.response.blog.updated)._d).fromNow(),
	                     newPics:'',
	                     totalPictures:data.response.total_posts,
	                     avatar: 'http://api.tumblr.com/v2/blog/'+tumblrId+'.tumblr.com/avatar/128' 
      	            }
      				}
      				// check  last updated time (human readable)
      				tumblr.sites[tumblrId].siteInfo.updated = moment(moment.unix(data.response.blog.updated)._d).fromNow();
                  // get pictures
                  var picts=data.response.posts; 
      				for(i=0; i< picts.length; i++){
      					// get the pic before last item in the alt_sizes array to get image to use as thumbnail
      					thumbnail = picts[i].photos[0].alt_sizes.length-2;
      					// tumblr bug??? 1280 pix get 403 error. So get 500px pic (first or second object depending on original pic)
      					var full = picts[i].photos[0].alt_sizes[0]; 
      					full = full.width <= 500 ? full : picts[i].photos[0].alt_sizes[1];
      					// ...
      					tumblr.sites[tumblrId].pictures[i+offset]={      					   
      					   thumb:picts[i].photos[0].alt_sizes[thumbnail].url,
      						fullsize:full.url,		
      						caption:picts[i].caption         						
         				}					
      				} 		
   				   if(callback) callback(tumblrId);   				   
                 // ----------------------------------   
               }else{     
                  if(config.showErrors){
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
               }               
            },
            error: function(xhr, type) {
               // generic error  
               if(app.errors.message[status]){
                  app.hideLoadbar();           
                  app.errors.showAlert(app.errors.message.generic);    
               }  
           }
         });
      },
      checkUpdates: function(tumblrId, callback){
         var urlToGet = 'http://api.tumblr.com/v2/blog/'+tumblrId+'.tumblr.com/posts/photo?';
		   urlToGet +='&limit=1&api_key='+apiKey+'&jsonp=?';
		   if(tumblr.sites[tumblrId].siteInfo){
		      $.ajax({
               url: urlToGet,            
               success: function(data) { 
                  var status = data.meta.status;
                  if(status === 200){ 
                     // if updated then update total posts in storage
                     if(data.response.blog.updated !== tumblr.sites[tumblrId].siteInfo.updateTime){
                        // updated time in human readable form
                        tumblr.sites[tumblrId].siteInfo.updateTime = data.response.blog.updated;
                        tumblr.sites[tumblrId].siteInfo.updated = moment(moment.unix(data.response.blog.updated)._d).fromNow(); 
                        // show how many new pictures
                        tumblr.sites[tumblrId].siteInfo.newItems = data.response.total_posts -tumblr.sites[tumblrId].siteInfo.totalPictures;
	                     tumblr.sites[tumblrId].siteInfo.totalPictures = data.response.total_posts;
                     }                     
                  }  
               }               
            }); 
		   }else{
		      return;
		   }		   
      }      
   }
   return tumblr;
});


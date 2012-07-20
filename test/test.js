define(['../assets/js/lawnchair', '../assets/js/moment'], function(Lawnch, mom){      
   
   // load once on init and write back everytime keeping the local array in sync with the saved one  
   
   var apiKey = 'XlCJ1kpxkFjgblfrnXXm6LE1hfYcmf56jaru6PynxidzEfFJVe';
   var localSites = [];
   
   var app = {   
      config:{    
         storageId: 'test'
      },  
      sites: {
         recent:[],
         favs: [],
         explore:[]
      },
      init: function(){
         // init storage and get saved list
         app.getFromStorage();
         
         // add sites via form 
         var form = $('.searchForm'); 
         // check submitted value
         form.bind('submit', function(e){   
            var tumblrId = $(this).find('input').attr('value');
            app.checkTumblr(tumblrId, function(){
               // add to local array
               app.addSite(tempObj);
               console.log(tumblrId+' added!');    
               // write to page
               app.writeToPage(tempObj);           
            });            	
            e.preventDefault(); 
         });   
         
      },
      // check if site exists and get its data ***********************
      checkTumblr: function(tumblrId, callback){
         urlToGet = 'http://api.tumblr.com/v2/blog/'+tumblrId+'.tumblr.com/posts/photo?';
   		urlToGet +='limit=1&api_key='+apiKey+'&jsonp=?';

         $.ajax({
            url: urlToGet,            
            success: function(data) { 
               var status = data.meta.status;
               if(status === 200){
                  // --------------------------------
                  if(data.response.total_posts === 0){  
                     alert('no pics');
                     return; 
                  } 
				      tempObj = {
                     id : data.response.blog.name,
				         title : data.response.blog.title,
				         updateTime : data.response.blog.updated,
				         totalPictures : data.response.total_posts,
				         recent: false,
				         fav: false,
				         explore: false
				      }		
			      				      
				      if(callback) callback(tempObj);
                 // ----------------------------------          
               }else{     
                  alert('error '+status);
               }                           
            } 
         });
      },
      writeToPage: function(obj){
         console.log('gfdg');
         var updated = moment(moment.unix(obj.updateTime)._d).fromNow();
         var avatar = 'http://api.tumblr.com/v2/blog/'+obj.id+'.tumblr.com/avatar/24';
         var snippet ='<div style="margin-bottom:10px; width:100%; float:left; line-height:24px; clear:both; padding:3px"><img src="'+avatar+'" style="float:left; margin-right:5px" /><strong>'+obj.title+'</strong> - '+updated+'</div>';         
         $('#list').append(snippet);
      },
      addToPage: function(what, where){
         
      },
      // retrieve saved sites ***********************
      getFromStorage: function(){
         app.storage = Lawnchair({name:app.config.storageId}, function(){});   
         app.storage.get(app.config.storageId, function(obj){ 
            // set initial database if doesn't already exits 
            if(obj === null){
               var sites = {}; 
              app.storage.save({key:app.config.storageId, value:sites}, function(){}); 
            }else{
            // get array 
               app.sites.recent = obj.value.recent;
               app.sites.favs = obj.value.favs;
               app.sites.explore = obj.value.explore;
               
               localSites = obj.value;
               var l = localSites.length;
                             
               
               for(i=0; i<l; i++){
                  app.writeToPage(localSites[i]);
                  // set sites in relative categories arrays 
                  console.log(localSites[i].recent);
               }
            }
         });  
      },
      // add to local array *********************
      addSite: function(obj){
         localSites.unshift(obj);
         app.store();
      },
      setRecent: function(el){
         
      },
      removeRecent: function(el){
         
      },
      setFav: function(el){
         
      },
      removeFav: function(el){
         
      },
      setExplore: function(el){
         
      },
      removeExplore: function(el){
         
      },
      // edit local array *********************
      // edit: function(category, action, callback){
      //          
      //          //switch case
      //       },
      //       flag: function(tumblrId, flag, action){
      //          switch(flag){
      //             case 'recent':
      //                if(action === 'add'){
      //                   
      //                }else{
      //                   
      //                }
      //             break;
      //             
      //             case 'fav':
      //                if(action === 'add'){
      //                      
      //                   }else{
      //                   
      //                }
      //             break;
      //             
      //             case 'explore':
      //                if(action === 'add'){
      //                   
      //                }else{
      //                   
      //                }
      //             break;
      //          }
      //       },
      // save to localstorage ***********************
      store: function(){  
         app.storage.get(app.config.storageId, function(obj){
            obj= obj.value;
            obj = localSites;
            app.storage.save({key:app.config.storageId, value:obj});
         });  
      }  
   };
   return app;
});

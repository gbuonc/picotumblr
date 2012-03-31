define(['../../assets/js/iscroll', '../../assets/js/lawnchair', 'modules/app'], function(iScrl, lawnch, app){  
   var $hpList = $('#favs >ul');
   var favourites={
      scrollable : new iScroll('favs'),
      init: function(){   
         // check local storage       
         app.storage.get("tme", function(obj){ 
            obj= obj.value; 
            favourites.sites = obj.favs;
            favourites.updateHpList();
         });
      },   
      add: function(tumblrId, avatar){
         console.log(favourites.sites);
         // get an array of id values (underscore.js)
         var temp = _.pluck(favourites.sites, 'id');
         // save only if not already present in temp array
         var notInArray=temp.indexOf(tumblrId) === -1;         
         if(notInArray){
            tmpObj = {
               id: tumblrId,
               av: avatar 
            }
            // add as first item
            favourites.sites.unshift(tmpObj); 
            // save to local storage            
            app.storage.get("tme", function(obj){
               obj= obj.value;
               obj.favs = favourites.sites;
               app.storage.save({key:"tme", value:obj});
            });
            console.log(favourites.sites);
            favourites.updateHpList();
            app.showMessage(tmpObj.id+' added to favs!');
         }
      },
      remove: function(tumblrId){
         // get an array of id values (underscore.js)
         var temp = _.pluck(favourites.sites, 'id'); 
         // get current elment index     
         var pos = temp.indexOf(tumblrId);
         if(pos != -1){   
            // remove current item from array        
            favourites.sites.splice(pos,1); 
            // save to local storage
            app.storage.get("tme", function(obj){
               obj= obj.value;
               obj.favs = favourites.sites;
               app.storage.save({key:"tme", value:obj});
            });
            // and remove from list
            $hpList.find('#fav_'+tumblrId).remove();
            app.showMessage('This site has been removed!');
         }else{
            app.showMessage('Site already removed!');
         }
      },
      updateHpList: function(){          
         $hpList.html('');  
         var l =  favourites.sites.length,  
         el ='';
         for(i=0; i<l; i++){
            el+='<li id="fav_'+favourites.sites[i].id+'"><a href="#/'+favourites.sites[i].id+'"><img src="'+favourites.sites[i].av+'" /></a></li>';
         }         
         $hpList.html(el);           
      },
      reset: function(){
         favourites.sites.length = 0;
         app.storage.get("tme", function(obj){
            obj= obj.value;
            obj.favs = favourites.sites;
            app.storage.save({key:"tme", value:obj});
         });
         $hpList.html(''); 
      }      
   }
   return favourites;   
});

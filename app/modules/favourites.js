define(['../../assets/js/iscroll', '../../assets/js/lawnchair', 'modules/app'], function(iScrl, lawnch, app){  
   var $hpList = $('#favs >ul');
   var btnFav = $('#topBar .btnFav');
   var favourites={
      scrollable : new iScroll('favs'),
      init: function(){   
         // check local storage       
         app.storage.get("tme", function(obj){ 
            obj= obj.value; 
            favourites.sites = obj.favs;
            //favourites.updateHpList();
         });
      }, 
      isFav: function(tumblrId){
         // get an array of id values
         var temp = $(favourites.sites).pluck('id');
         var isInArray=temp.indexOf(tumblrId) !== -1;         
         if(isInArray){   
            return temp.indexOf(tumblrId); 
         }else{
            return false;
         }
      },
      setButton: function(tumblrId, el){   
         var isFav = favourites.isFav(tumblrId);    
         el.off('click'); // detach previous click events
         if(isFav === false){
            el.html('add').on('click', function(){
               favourites.add(tumblrId, tumblr[tumblrId].siteInfo.avatar, el);
            });            
         }else{         
            el.html('remove').on('click', function(){
               favourites.remove(tumblrId, isFav, el);
            });
         }          
      },
      add: function(tumblrId, avatar, el){
         // check already done
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
         //favourites.updateHpList();
         app.showMessage(tmpObj.id+' added to favs!');
         // reset button
         favourites.setButton(tumblrId, el);
      },
      remove: function(tumblrId, pos, el){ 
         // remove from array        
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
         // reset button
         favourites.setButton(tumblrId, el);
      },
      updateHpList: function(){          
         $hpList.html('');  
         var l =  favourites.sites.length,  
         el ='';
         for(i=0; i<l; i++){
            el+='<li id="fav_'+favourites.sites[i].id+'"><a href="#/'+favourites.sites[i].id+'"><img src="'+favourites.sites[i].av+'" /></a></li>';
         }         
         $hpList.html(el); 
         favourites.scrollable.refresh();
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

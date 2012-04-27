define([ '../../assets/js/text!templates/hlist.tpl', 
         '../../assets/js/handlebars', 
         '../../assets/js/iscroll', 
         '../../assets/js/lawnchair', 
         'modules/app'], 
   function(listTpl, handlebars, iScrl, lawnch, app){  
   var $hpList = $('#favs .scrollWrapper');
   var btnFav = $('#topBar .btnFav');
    // handlebars template  
   var source = $(listTpl).html();
   var template = Handlebars.compile(source); 
   
   var favourites={
      scrollable : new iScroll('favs'),
      init: function(){   
         // check local storage       
         app.storage.get("tme", function(obj){ 
            obj= obj.value; 
            app.favs.sites = obj.favs;
            //favourites.updateHpList();
         });
      }, 
      isFav: function(tumblrId){
         // get an array of id values
         var temp = $(app.favs.sites).pluck('id');
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
               favourites.add(tumblrId, tumblr.sites[tumblrId], el);
            });            
         }else{         
            el.html('remove').on('click', function(){
               favourites.remove(tumblrId, isFav, el);
            });
         }          
      },
      add: function(tumblrId, site, el){
         // check already done
         tmpObj = {
            id: tumblrId,
            title:site.siteInfo.title,
            av: site.siteInfo.avatar 
         }
         // add as first item
         app.favs.sites.unshift(tmpObj); 
         // save to local storage            
         app.storage.get("tme", function(obj){
            obj= obj.value;
            obj.favs = app.favs.sites;
            app.storage.save({key:"tme", value:obj});
         });
         //favourites.updateHpList();
         app.showMessage(tmpObj.id+' added to favs!');
         // reset button
         favourites.setButton(tumblrId, el);
      },
      remove: function(tumblrId, pos, el){ 
         // remove from array        
         app.favs.sites.splice(pos,1); 
         // save to local storage
         app.storage.get("tme", function(obj){
            obj= obj.value;
            obj.favs = app.favs.sites;
            app.storage.save({key:"tme", value:obj});
         });
         // and remove from list
         $hpList.find('#fav_'+tumblrId).remove();
         app.showMessage('This site has been removed!');
         // reset button
         favourites.setButton(tumblrId, el);
      },
      updateHpList: function(){  
         var context ={
            warning:'Sorry, no sites added to favs yet!',
            listItem:app.favs.sites
         }               
         $hpList.html(template(context));         
         setTimeout(function () {
		      favourites.scrollable.refresh();
	      }, 0)   
      },
      reset: function(){
         app.favs.sites.length = 0;
         app.storage.get("tme", function(obj){
            obj= obj.value;
            obj.favs = app.favs.sites;
            app.storage.save({key:"tme", value:obj});
         });
        favourites.updateHpList();
      }      
   }
   return favourites;   
});

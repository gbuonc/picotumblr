define(['../../assets/js/iscroll', '../../assets/js/lawnchair', 'modules/app'], function(iScrl, lawnch, app){  
   var $hpList = $('#history >ul');
   var history={
      scrollable : new iScroll('history'),
      init: function(){                
         // check local storage       
         app.storage.get("tme", function(obj){ 
            obj= obj.value; 
            history.sites = obj.history;
            history.updateHpList();
         });
      },   
      save: function(tumblrId, avatar){     
         // get an array of id values (underscore.js)
         var temp = $(history.sites).pluck('id');     
         // save only if not already present in temp array
         var notInArray=temp.indexOf(tumblrId) === -1;         
         if(notInArray){
            tmpObj = {
               id: tumblrId,
               av: avatar 
            }
            // add as first item
            history.sites.unshift(tmpObj);  
            var l = history.sites.length;  
            // max 15 records
            if(l>=16){               
               history.sites.pop(); //remove last item
            } 
            // save to local storage            
            app.storage.get("tme", function(obj){
               obj= obj.value;
               obj.history = history.sites;
               app.storage.save({key:"tme", value:obj});
            });
            history.updateHpList();
         }
      },
      updateHpList: function(){ 
         $hpList.html('');  
         var l =  history.sites.length,  
         el ='';
         for(i=0; i<l; i++){
            el+='<li id="history_'+history.sites[i].id+'"><a href="#/'+history.sites[i].id+'"><img src="'+history.sites[i].av+'" /></a></li>';
         }         
         $hpList.html(el);  
      },
      reset: function(){
         history.sites.length = 0;
         // save to local storage           
         app.storage.get("tme", function(obj){
            obj= obj.value;
            obj.history = history.sites;
            app.storage.save({key:"tme", value:obj});
         });
         $hpList.html(''); 
      }      
   }
   return history;   
});

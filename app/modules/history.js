define([ '../../assets/js/text!templates/hlist.tpl', 
         '../../assets/js/handlebars', 
         '../../assets/js/iscroll', 
         '../../assets/js/lawnchair', 
         'modules/app'], 
   function(listTpl, handlebars, iScrl, lawnch, app){  
   var $hpList = $('#history');
   // handlebars template  
   var source = $(listTpl).html();
   var template = Handlebars.compile(source);       
   var history={
      scrollable : new iScroll('history'),
      init: function(){              
         // check local storage       
         app.storage.get("tme", function(obj){ 
            obj= obj.value; 
            history.sites = obj.history;
         });
      },   
      save: function(tumblrId, site){     
         // get an array of id values (underscore.js)
         var temp = $(history.sites).pluck('id');     
         // save only if not already present in temp array
         var notInArray=temp.indexOf(tumblrId) === -1;         
         if(notInArray){
            tmpObj = {
               id: tumblrId,
               title:site.siteInfo.title,
               av: site.siteInfo.avatar                
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
         }
      },
      updateHpList: function(){    
         var context ={
            warning:'Sorry, no recent sites yet!',
            listItem:history.sites
         }              
         $hpList.html(template(context));         
         history.scrollable.refresh();
      },
      reset: function(){
         history.sites.length = 0;
         // save to local storage           
         app.storage.get("tme", function(obj){
            obj= obj.value;
            obj.history = history.sites;
            app.storage.save({key:"tme", value:obj});
         });
         history.updateHpList();
      }      
   }
   return history;   
});

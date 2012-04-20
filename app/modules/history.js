define([ '../../assets/js/text!templates/hlist.tpl', 
         '../../assets/js/handlebars', 
         '../../assets/js/iscroll', 
         '../../assets/js/lawnchair', 
         'modules/app'], 
   function(listTpl, handlebars, iScrl, lawnch, app){  
   var $hpList = $('#history .scrollWrapper');
   // setup buttons
   var $clearBtn = $('#history button');
   $clearBtn.live('click', function(){
      var item = $(this).attr('data-target');
      history.clearItem(item);
   });
   var $resetBtn = $('#recentTab .btnClear');
   $resetBtn.live('click', function(){            
      history.reset();        
   });
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
         console.log('saving');    
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
            history.store();  
         }
      },
      clearItem: function(el){
         // get element in array
         var temp = $(history.sites).pluck('id');     
         var pos=temp.indexOf(el);  
         // remove it via prototype (in app.js) 
         history.sites.remove(pos);       
         history.store();                  
         // remove element
         var $elToRemove= $hpList.find('li').eq(pos);         
         $elToRemove.animate({ opacity: 0}, 300, 'ease-in-out', function(){            
            $hpList.find('li').each(function(){
               var index =$(this).index();
               if(index > pos){
                  $(this).animate({left:'-138px'}, 300, 'ease-out');               
               }
            });   
            setTimeout(function(){
               $elToRemove.remove(); 
               history.updateHpList();
            }, 800)         
         });  
      },
      updateHpList: function(){  
         if(history.sites.length === 0){
            $resetBtn.hide();
         } else{
            $resetBtn.show();
         }
         var context ={
            warning:'Sorry, no recent sites yet!',
            listItem:history.sites
         }              
         $hpList.html(template(context));
         setTimeout(function () {
		      history.scrollable.refresh();
	      }, 0)         
      },
      reset: function(){
         var confirmation = confirm('Really delete all recent sites?');
         if(confirmation){
            history.sites.length = 0;
            history.store();         
            history.updateHpList();
            //reset all sites loaded
            tumblr.sites={};
         }         
      },
      store: function(){
         // save to local storage           
         app.storage.get("tme", function(obj){
            obj= obj.value;
            obj.history = history.sites;
            app.storage.save({key:"tme", value:obj});
         });
      }      
   }
   return history;   
});

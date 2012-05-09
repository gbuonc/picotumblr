define([ '../../assets/js/text!templates/hlist.tpl', 
         '../../assets/js/handlebars', 
         '../../assets/js/iscroll', 
         '../../assets/js/lawnchair', 
         'modules/app'], 
   function(listTpl, handlebars, iScrl, lawnch, app){ 
   // handlebars template 
   var source = $(listTpl).html(),
   template = Handlebars.compile(source);         
   var tabs ={
      list:['history', 'favs', 'rels'],
      hpTabs:{
         // ------------------------
         history:{
            $hpList : $('#history .scrollWrapper'),
            $clearBtn : $('#history button'),
            $resetBtn : $('#recentTab .btnClear'),
            confirmMsg : 'Really delete all recent sites?',
            warning : 'Sorry, your history is empty!'            
         },
         // ------------------------
         favs:{
            $hpList : $('#favs .scrollWrapper'),
            $clearBtn : $('#favs button'),
            $resetBtn : $('#favsTab .btnClear'),
            btnFav : $('#topBar .btnFav'),
            confirmMsg : 'Really delete all favourites sites?',
            warning : 'Sorry, no favs added yet!'  
         },
         // ------------------------
         rels:{
            $hpList : $('#rels .scrollWrapper'),
            $clearBtn : $('#rels button'),
            $resetBtn : $('#exploreTab .btnClear'),
            confirmMsg : 'Really delete all explore sites?',
            warning : 'Sorry, your explore directory is empty!'               
         }   
      },      
      init: function(){
         // init all UI
         $.each(tabs.list, function(index, tab){
            // get saved data
            app.storage.get("tme", function(obj){ 
               obj= obj.value; 
               app[tab].sites = obj[tab];
            });  
            // buttons binding
            tabs.hpTabs[tab].$clearBtn.live('click', function(){
               var item = $(this).attr('data-target');
                  tabs.remove(item, tab);
               });
               tabs.hpTabs[tab].$resetBtn.live('click', function(){            
                  tabs.reset(tab);        
               });
            // init scroller
            tabs.hpTabs[tab].scrollable = new iScroll(tab);
         })
         // TABS in Homepage
         var $tabs = $('#hpTabs > ul li'), 
         $hpTabs=$('#hpTabs');
         // switch tabs
         $($tabs).on('click', function(){
            var kl = $(this).attr('id');
            $hpTabs.attr('class', kl);
            $tabs.removeClass('active');
            $(this).addClass('active');      
         });
         // refresh all scrollables in hp
         tabs.writeTabs();
      },
      posInArray: function(tumblrId, tab){
         // get an array of id values
         var temp = $(app[tab].sites).pluck('id');   
         return temp.indexOf(tumblrId);   
      },      
      add: function(tumblrId, site, tab, callback){    
         var notInArray = tabs.posInArray(tumblrId, tab);          
         if(notInArray === -1){
            tmpObj = {
               id: tumblrId,
               title:site.siteInfo.title,
               av: site.siteInfo.avatar                
            }
            // add as first item
            app[tab].sites.unshift(tmpObj);  
            if(tab !== 'favs'){ // -----------------------
              var l = app[tab].sites.length;  
               // max 20 records
               if(l>=21){               
                  app[tab].sites.pop(); //remove last item
               }  
            }  
            tabs.store(tab);
            tabs.updateHpList(tab);
            if(callback) callback();            
         }    
      },
      remove: function(tumblrId, tab, callback){
         var pos = tabs.posInArray(tumblrId, tab);
         // remove it via prototype (in app.js) 
         app[tab].sites.remove(pos);       
         tabs.store(tab);
         // remove element
         var $elToRemove= tabs.hpTabs[tab].$hpList.find('li').eq(pos);         
         $elToRemove.animate({ opacity: 0}, 300, 'ease-in-out', function(){            
            tabs.hpTabs[tab].$hpList.find('li').each(function(){
               var index =$(this).index();
               if(index > pos){
                  $(this).animate({left:'-138px'}, 300, 'ease-out');               
               }
            });   
            setTimeout(function(){
               $elToRemove.remove(); 
               tabs.updateHpList(tab);
            }, 800);                        
         }); 
         if(callback) callback();
      },  
      writeTabs: function(){
         $.each(tabs.list, function(index, tab){
           tabs.updateHpList(tab);
         })
      },
      updateScrollable: function(){
         $.each(tabs.list, function(index, tab){
            tabs.hpTabs[tab].scrollable.refresh();
         }) 
      },   
      updateHpList: function(tab){
         if(app[tab].sites.length === 0){
            tabs.hpTabs[tab].$resetBtn.hide();
         } else{
            tabs.hpTabs[tab].$resetBtn.show();
         }
         var context ={            
            warning: tabs.hpTabs[tab].warning,
            listItem:app[tab].sites         
         }              
         tabs.hpTabs[tab].$hpList.html(template(context));
         setTimeout(function () {
            tabs.hpTabs[tab].scrollable.refresh(); 
	      }, 0)  
      },
      reset: function(tab){
         var confirmation = confirm(tabs.hpTabs[tab].confirmMsg);
         if(confirmation){
            app[tab].sites.length = 0;
            tabs.store(tab);         
            tabs.updateHpList(tab);
            if(tab === 'history'){
               //reset all sites loaded
               tumblr.sites={};
            }            
         }    
      },     
      store: function(tab){
         // save to local storage           
         app.storage.get("tme", function(obj){
            obj= obj.value;
            obj[tab] = app[tab].sites;
            app.storage.save({key:"tme", value:obj});
         });         
      }
   }
   return tabs;   
});

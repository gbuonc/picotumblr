define([ '../../assets/js/text!templates/hlist.tpl', 
         '../../assets/js/handlebars', 
         '../../assets/js/iscroll', 
         '../../assets/js/lawnchair', 
         'modules/app',
         'modules/tabs'], 
   function(listTpl, handlebars, iScrl, lawnch, app, tabs){  
      
   // var $hpList = $('#history .scrollWrapper');
   //    var source = $(listTpl).html();
   //    var template = Handlebars.compile(source);  
   //    
   //    
   //    
   //    
   //    // setup buttons
   //    var $clearBtn = $('#history button');
   //    $clearBtn.live('click', function(){
   //       var item = $(this).attr('data-target');
   //       history.clearItem(item);
   //    });
   //    var $resetBtn = $('#recentTab .btnClear');
   //    $resetBtn.live('click', function(){            
   //       history.reset();        
   //    });
   
   
   
        
   var history={
      //scrollable : new iScroll('history'),
      init: function(){              
         // check local storage       
         // app.storage.get("tme", function(obj){ 
             //            obj= obj.value; 
             //            app.history.sites = obj.history;
             //            });     
         tabs.init('history');     
      },   
      save: function(tumblrId, site, tab){ 
         tabs.add(tumblrId, site, 'history');
         // // get an array of id values (underscore.js)
         //          var temp = $(app.history.sites).pluck('id');            
         //          // save only if not already present in temp array
         //          var notInArray=temp.indexOf(tumblrId) === -1;   
         //          if(notInArray){
         //             tmpObj = {
         //                id: tumblrId,
         //                title:site.siteInfo.title,
         //                av: site.siteInfo.avatar                
         //             }
         //             // add as first item
         //             app.history.sites.unshift(tmpObj);  
         //             var l = app.history.sites.length;  
         //             // max 15 records
         //             if(l>=16){               
         //                app.history.sites.pop(); //remove last item
         //             } 
         //             history.store();  
         //          }
      },
      clearItem: function(el){
         tabs.remove(el, 'history');
         // // get element in array
          //          var temp = $(app.history.sites).pluck('id');     
          //          var pos=temp.indexOf(el);  
          //          // remove it via prototype (in app.js) 
          //          app.history.sites.remove(pos);       
          //          history.store();
          //          // clear previously loaded data
          //          //tumblr.sites[el]={};
          //          // remove element
          //          var $elToRemove= $hpList.find('li').eq(pos);         
          //          $elToRemove.animate({ opacity: 0}, 300, 'ease-in-out', function(){            
          //             $hpList.find('li').each(function(){
          //                var index =$(this).index();
          //                if(index > pos){
          //                   $(this).animate({left:'-138px'}, 300, 'ease-out');               
          //                }
          //             });   
          //             setTimeout(function(){
          //                $elToRemove.remove(); 
          //                history.updateHpList();
          //             }, 800)         
          //          });  
      },
      updateHpList: function(){  
         tabs.updateHpList('history');
         // if(app.history.sites.length === 0){
         //             $resetBtn.hide();
         //          } else{
         //             $resetBtn.show();
         //          }
         //          var context ={
         //             warning:'Sorry, no recent sites yet!',
         //             listItem:app.history.sites
         //          }              
         //          $hpList.html(template(context));
         //          setTimeout(function () {
         //             history.scrollable.refresh();
         //          }, 0)         
      },
      reset: function(){
         tabs.reset('history');
         // var confirmation = confirm('Really delete all recent sites?');
              //          if(confirmation){
              //             app.history.sites.length = 0;
              //             history.store();         
              //             history.updateHpList();
              //             //reset all sites loaded
              //             tumblr.sites={};
              //          }         
      },
      store: function(){
         tabs.store('history');
         // save to local storage           
         // app.storage.get("tme", function(obj){
         //             obj= obj.value;
         //             obj.history = app.history.sites;
         //             app.storage.save({key:"tme", value:obj});
         //          });
      }      
   }
   return history;   
});

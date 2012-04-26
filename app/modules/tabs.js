define([ '../../assets/js/text!templates/hlist.tpl', 
         '../../assets/js/handlebars', 
         '../../assets/js/iscroll', 
         '../../assets/js/lawnchair', 
         'modules/app'], 
   function(listTpl, handlebars, iScrl, lawnch, app){  
   var tabs ={
      hpTabs:{
         history:{
            $hpList : $('#history .scrollWrapper'),
            $clearBtn : $('#history button'),
            $resetBtn : $('#recentTab .btnClear'),
            init: function(){
               hpTabs.history.$clearBtn.live('click', function(){
                  var item = $(this).attr('data-target');
                  tabs.clearItem(item);
               });
               hpTabs.history.$resetBtn.live('click', function(){            
                  tabs.reset();        
               });
            },
            scrollable : new iScroll('history')
         },
         favourites:{
            $hpList : $('#history .scrollWrapper'),
            $clearBtn : $('#history button'),
            $resetBtn : $('#recentTab .btnClear'),
            init: function(){
               hpTabs.history.$clearBtn.live('click', function(){
                  var item = $(this).attr('data-target');
                  tabs.clearItem(item);
               });
               hpTabs.history.$resetBtn.live('click', function(){            
                  tabs.reset();        
               });
            },
            scrollable : new iScroll('history')
         },
         related:{
            $hpList : $('#history .scrollWrapper'),
            $clearBtn : $('#history button'),
            $resetBtn : $('#recentTab .btnClear'),
            init: function(){
               hpTabs.history.$clearBtn.live('click', function(){
                  var item = $(this).attr('data-target');
                  tabs.clearItem(item);
               });
               hpTabs.history.$resetBtn.live('click', function(){            
                  tabs.reset();        
               });
            },
            scrollable : new iScroll('history')
         }   
      },
      source: $(listTpl).html(),
      template: function(){
         Handlebars.compile(source);
         console.log(this);
         return this;
      },
      add: function(){
         
      },
      remove: function(){
         
      },      
      updateHpList: function(){
         
      },
      reset: function(){
         
      },
      store: function(){
         
      }
   }
   return tabs;   
});

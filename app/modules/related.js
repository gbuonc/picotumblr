define(['modules/app'], function(app){  
   var $hpList = $('#rels >ul');
   var relatedSites ={   
      scrollable : new iScroll('rels'),   
      add: function(tumblrId){
         var notInArray = ($.inArray(tumblrId, app.relatedSites) === -1) ? true : false;
         if(notInArray){
            app.relatedSites.push(tumblrId);
         }       
      },
      updateHpList: function(){
         $hpList.html('');  
         var l =  app.relatedSites.length,  
         el ='';
         for(i=0; i<l; i++){
            el+='<li class="btn"><a href="#/'+app.relatedSites[i]+'">'+app.relatedSites[i]+'</a></li>';
         }         
         $hpList.html(el); 
         relatedSites.scrollable.refresh();
      },
      clear: function(){
         app.relatedSites.length = 0;
      }   
   }
   return relatedSites;   
});

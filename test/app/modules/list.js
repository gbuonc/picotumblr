define([ '../../assets/js/iscroll','modules/app'], function (iScr, app) {  
   $hpHistory = $('recentSites > div');
   var list={
      recent:{
         update:function(){
            var l = app.recent.sites.length;    
            if(l>0){
               var h = '';
               for(i=0; i<=l; i++){
                  h+='<a href="#/'+app.recent.sites[i].id+'"><img src="'+app.recent.sites[i].av+'"/></a>'
               }  
               $hpHistory.html(h);
            }            
         }
      }
   }
   return list;
});

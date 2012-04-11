define([ 
   'modules/app', 
   'modules/tumblr', 
   'modules/history', 
   'modules/favourites',
   'modules/related'], 
function (
   app, 
   tumblr,
   history,
   favourites, 
   related) { 
   var form = $('.searchForm'); 
   // check submitted value
   form.bind('submit', function(e){
      var tumblrId = $(this).find('input').attr('value');
      if (tumblrId === '') {
         app.errors.showAlert(app.errors.message.empty);     
      } else {           
         app.showLoadbar('mainApp');
      	tumblr.getData(tumblrId, function(){   	   
      	   location.href='#/'+tumblrId;
      	}); 
      }
      e.preventDefault(); 
   });
   var home ={
      init:function(){
         // refresh all scrollables in hp
         history.updateHpList();
         favourites.updateHpList();
         related.updateHpList();
      }
   }
   return home;   
});
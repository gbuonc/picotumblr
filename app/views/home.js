define([ 
   'modules/app', 
   'modules/tumblr', 
   'modules/tabs'], 
function (
   app, 
   tumblr,
   tabs) {     
   
   var form = $('.searchForm'); 
   // check submitted value
   form.bind('submit', function(e){
      var tumblrId = $(this).find('input').attr('value');
      if (tumblrId === '') {
         app.errors.showAlert(app.errors.message.empty);     
      } else {           
         app.showLoadbar('mainApp');
      	tumblr.getData(tumblrId,{},function(){   	   
      	   location.href='#/'+tumblrId;
      	}); 
      }
      e.preventDefault(); 
   });   
});
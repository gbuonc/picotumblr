define(['modules/app', 'modules/tumblr'], function (app, tumblr) { 
   var form = $('.searchForm'); 
   // check submitted value
   form.bind('submit', function(e){
      var tumblrId = $(this).find('input').attr('value');
      if (tumblrId === '') {
         app.errors.showAlert(app.errors.message.empty);     
      } else {           
         app.showLoadbar();
      	tumblr.getData(tumblrId, function(){   	   
      	   location.href='#/'+tumblrId;
      	}); 
      }
      e.preventDefault(); 
   });      
});
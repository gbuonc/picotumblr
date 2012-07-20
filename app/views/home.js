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
      } 
      else if(tumblrId.match(/db:/)){         
         // test:: set custom localstorage key via input field
         // change background color for visual feedback and reload
         app.config.storageId = tumblrId.slice(3);
         var bgColor = app.config.storageId != 'local' ? 'indigo':'#2D2B29';         
         $('#mainApp').css({'background':bgColor});
         app.showMessage('Storage changed to '+app.config.storageId);
         app.init();
      }
      else {           
         app.showLoadbar('mainApp');
      	tumblr.getData(tumblrId,{},function(){   	   
      	   location.href='#/'+tumblrId;
      	}); 
      }
      e.preventDefault(); 
   });   
});
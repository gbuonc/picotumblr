define(['../../assets/js/text!templates/hlist.tpl', 
         '../../assets/js/handlebars', 
         'modules/app', 
         '../../assets/js/iscroll'], 
   function(listTpl, handlebars, app, iScrl){  
   var $hpList = $('#rels .scrollWrapper');
   // handlebars template  
   var source = $(listTpl).html();
   var template = Handlebars.compile(source);
   var relatedSites ={   
      scrollable : new iScroll('rels'),   
      add: function(tumblrId){
         tumblr.getData(tumblrId, function(){
            // get an array of id values (underscore.js)
            var temp = $(app.relatedSites).pluck('id');     
            // save only if not already present in temp array
            var notInArray=temp.indexOf(tumblrId) === -1; 
            if(notInArray){
               var tmpObj = {
                  id: tumblrId,
                  title:tumblr.sites[tumblrId].siteInfo.title,
                  av: tumblr.sites[tumblrId].siteInfo.avatar                
               }
               app.relatedSites.push(tmpObj);   
            }                            
         });         
      },
      updateHpList: function(){
         var context ={
            warning:'Sorry, no related sites yet!',
            listItem:app.relatedSites
         }              
         $hpList.html(template(context));         
         setTimeout(function () {
		      relatedSites.scrollable.refresh();
	      }, 0) 
      },
      clear: function(){
         app.relatedSites.length = 0;
         relatedSites.updateHpList();
      }   
   }
   return relatedSites;   
});

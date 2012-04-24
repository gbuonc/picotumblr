define([ '../../assets/js/text!templates/hlist.tpl', 
         '../../assets/js/handlebars', 
         '../../assets/js/iscroll', 
         '../../assets/js/lawnchair', 
         'modules/app'], 
   function(listTpl, handlebars, iScrl, lawnch, app){  
   var tabs ={
      source: $(listTpl).html(),
      template: function(){
         Handlebars.compile(source);
         console.log(this);
         return this;
      }
      // init: function(){
            //          var source = $(listTpl).html();
            //          var template = Handlebars.compile(source); 
            //          return template;
            //       }         
   }
   return tabs;   
});

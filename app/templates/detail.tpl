<script id="detail-template" type="text/x-handlebars-template">   
   <div class="cell" style="background:url({{bg}}) 50% no-repeat">
      <div class="loadbar icon-hourglass"><span>LOADING</span></div>
      <img src="{{img}}" />
      {{#if caption}}
      <div class="caption">
         {{{caption}}}
      </div>   
      {{/if}}       
   </div>   
 </script>
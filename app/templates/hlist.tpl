<script id="hlist-template" type="text/x-handlebars-template">   
   {{#unless listItem}}
   <p class="warning">{{warning}}</p>
   {{/unless}}
   {{#if listItem}}
   <ul>
   {{#each listItem}}   
   <li style="background: url('{{this.av}}');">
      <a href="#/{{this.id}}">
      <h2>{{{this.title}}}</h2>
      </a>    
      <button data-target="{{this.id}}">X</button>    			            
   </li>      
   {{/each}}    
   </ul>
   {{/if}}
 </script>
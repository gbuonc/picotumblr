<script id="hlist-template" type="text/x-handlebars-template">   
   {{#unless listItem}}
   <p class="warning">{{warning}}</p>
   {{/unless}}
   {{#if listItem}}
   <ul>
   {{#each listItem}}   
   <li class="{{this.id}}"> <!-- background: #333130 url('{{this.av}}') -->
      <a href="#/{{this.id}}">
      <img src="http://api.tumblr.com/v2/blog/{{this.id}}.tumblr.com/avatar/64" style="width:100%; height:auto" />
      <h2>{{{this.title}}} <span class="pics">{{{this.tp}}} pics</span></h2>
      </a>    
      <button data-target="{{this.id}}">X</button>    			            
   </li>      
   {{/each}}    
   </ul>
   {{/if}}
 </script>
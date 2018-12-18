if('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('/service-worker.js')
           .then(function() { console.log("Service Worker Registered"); });
}

// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app',
  id: 'io.framework7.artweb.okazje',
  name: 'Okazje',
  theme: 'auto',
  routes: routes,
  precompileTemplates: false,
  template7Pages: true,  
  lazy:{
    threshold: 100,
    sequential: false
  },
  pushState: true,
  panel:{
    swipe: 'left',
  }
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/home/',
  pushState: true
});

var filtersView = app.views.create('.panel-left .view');

$$(document).on('DOMContentLoaded', function() { 
  init();
});

$$(document).on('deviceready', function() {
    init();
});

function init(){
    $$('#app').on('change', '#filters_form select', function (e) {

      if(e.target.value=='default') $$(e.target).closest('a').removeClass('no-default'); else $$(e.target).closest('a').addClass('no-default');
      if($$(e.target).hasClass('no-route'))return false;

      inputs=$$('#filters_form select,#filters_form input');
      var str = "";
      inputs.each(function (i, item) { str += encodeURIComponent(item.name) + "=" + encodeURIComponent(item.value) + "&"; });
      app.router.navigate("/okazje/lists/"+str);

    });

    $$('.filters-reset').click(function(){
      inputs=$$('#filters_form select');
      inputs.each(function(i,item) {
          $$(item).val('default').addClass('no-route').change().removeClass('no-route');
      });
      app.router.navigate('/home/');
    });

    $$('#app').on('click', '.share', function (e) {
      if (navigator.share) {
        navigator.share({
            title: 'Web Fundamentals',
            text: 'Check out Web Fundamentals — it rocks!',
            url: 'https://developers.google.com/web',
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      }   
    });

    if(!document.location.hash)app.router.navigate('/home/');

}

function updateFilters(data_filters){
  $$('#filters').html('');
  for (key in data_filters) {
      items='';
      default_title=null;
      items+='<a href="#" class="item-link smart-select " data-open-in="popup" data-back-on-select="true">';
      items+='<select name="filter_'+key+'">';
      for(value in data_filters[key]){
          title=data_filters[key][value].title_long || data_filters[key][value].title;
          items+='<option value="'+value+'">'+title+'</option>';
          if(default_title==null)default_title=title;
      }
      items+='</select>';
      items+='<div class="item-content"><div class="item-inner"><div class="item-title">wybierz</div><div class="item-after">'+default_title+'</div></div></div>';
      items+='</a>';

    smartSelect = app.smartSelect.create({ 
      closeOnSelect: true,
      openIn: 'page',
      el: $$(items),
      //view: filtersView
    });
    $$('#filters').append(smartSelect.$el);
  }  
}
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
  theme: 'md',
  routes: routes,
  precompileTemplates: false,
  template7Pages: true,  
  lazy:{
    threshold: 800,
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

function showNotification(){
  cordova.plugins.notification.local.schedule({
    title: 'Sprawdź najnowsze okazje!',
    text: 'Treść powiadomienia.',
    foreground: true
  });
}

//var filtersView = app.views.create('.panel-left .view');

$$(document).on('DOMContentLoaded', function() { 
  init();
});

$$(document).on('deviceready', function() {
    StatusBar.hide();
    setTimeout(showNotification,60000);
    init();
});

function onBackKeyDown() {
  if( $$('.page-current').data('name') == 'home'){

    app.dialog.confirm('Czy na pewno chcesz wyjść?', exitApp, function(){});
   
  }
  return false;
}


function exitApp(){
   navigator.app.exitApp();
}

function init(){

    document.addEventListener("backbutton", onBackKeyDown, false);

    $$('#app').on('change', '#filters_form select', function (e) {

      if(e.target.value=='default') $$(e.target).closest('li').removeClass('no-default'); else $$(e.target).closest('li').addClass('no-default');

    });

    $$('#app').on('click','#filters_form_advanced_toggle', function(e){
      $$('.page-searchform').toggleClass('advanced');
      if($$('.page-searchform').hasClass('advanced')){
        $$('[name="mode"]').val('advanced').change();
      }else{
        $$('[name="mode"]').val('simple').change(); 
      }
    });

    $$('#app').on('click', '#filters_form_submit', function (e) {

      /*if(e.target.value=='default') $$(e.target).closest('a').removeClass('no-default'); else $$(e.target).closest('a').addClass('no-default');
      if($$(e.target).hasClass('no-route'))return false;*/

      inputs=$$('#filters_form select,#filters_form input');
      var str = "";
      inputs.each(function (i, item) { str += encodeURIComponent(item.name) + "=" + encodeURIComponent(item.value) + "&"; });
      app.router.navigate("/okazje/lists/"+str);

    });    

    /*$$('.filters-reset').click(function(){
      inputs=$$('#filters_form select');
      inputs.each(function(i,item) {
          $$(item).val('default').addClass('no-route').change().removeClass('no-route');
      });
      app.router.navigate('/home/');
    });*/

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

    $$('#app').on('click', '.favorite', function (e) {
      url = mainView.history[mainView.history.length-1];
      favobj={
        title:$$('[data-attr=title]').text(),
        price:parseInt( $$('[data-attr=price]').text() ),
        url:url,
        image:$$('[data-attr=image]').text(),
      }

      if($$(this).find('i').text()=='favorite'){
        $$(this).find('i').text('favorite_border');
        removeFavorite(url);
        $$('.page-previous a[href="'+url+'"]').hide();
        app.toast.create({text: 'Usunięto z listy <a href="/favorites/">ulubione</a>.',position: 'bottom',closeTimeout: 3000,}).open()
      }else{
        $$(this).find('i').text('favorite');
        addFavorite(favobj)
        $$('.page-previous a[href="'+url+'"]').show();
        app.toast.create({text: 'Dodano do listy <a href="/favorites/">ulubione</a>.',position: 'bottom',closeTimeout: 3000,}).open()
      }

    });

    if(!document.location.hash)app.router.navigate('/home/');
    $$('.favorites-count').text( getFavorites().length );
}

function getFavorites(){
  favorites = JSON.parse(localStorage.getItem("favorites"));
  if(favorites == null) return [];
  return favorites;
}

function setFavorites(favorites){
  localStorage.setItem("favorites", JSON.stringify(favorites));
  $$('.favorites-count').text( getFavorites().length );
}

function isFavorited(url){
  favorites = getFavorites();
  if( favorites.length>0 ){
    for(i=0;i<favorites.length;i++){
      if(favorites[i].url == url) return true;
    }
  }
  return false;
}

function addFavorite(favobj){
  if(!isFavorited(favobj.url)){
    favorites = getFavorites();
    favorites.unshift(favobj);
    setFavorites(favorites);
  }
}

function removeFavorite(url){
  favorites = getFavorites();
  if( favorites.length>0 ){
    for(i=0;i<favorites.length;i++){
      if(favorites[i].url == url){
        favorites.splice(i,1);
        setFavorites(favorites);
        return true;
      } 
    }
  }
  return false;
}
  routes = [
  {
    path: '/',
    url: './pages/home.html',
    on: {
      pageInit:function (e, page){

        $$('.favorites-count').text( getFavorites().length );

        filter_date_min = app.calendar.create({
          inputEl: '[name="filter_date_min"]',
          closeOnSelect: true,
          dateFormat: 'yyyy-mm-dd',
          minDate: new Date(),
          yearSelector: false,
        });
        filter_date_max = app.calendar.create({
          inputEl: '[name="filter_date_max"]',
          closeOnSelect: true,
          dateFormat: 'yyyy-mm-dd',
          minDate: new Date(),
          yearSelector: false,
        });

        filter_days_min = parseInt( $$('[name=filter_days_min]').val() ) || 1;
        filter_days_max = parseInt( $$('[name=filter_days_max]').val() ) || 21;

        days_filter = app.range.create({
            el: '#days_filter',
            value: [filter_days_min,filter_days_max],
            on:{
              change:function(r){
                $$('[name=filter_days_min]').val(r.value[0]).change();
                $$('[name=filter_days_max]').val(r.value[1]).change();
              }
            }
          });

        filter_cost_min = parseInt( $$('[name=filter_cost_min]').val() ) || 0;
        filter_cost_max = parseInt( $$('[name=filter_cost_max]').val() ) || 2000;

        var cost_filter = app.range.create({
            el: '#cost_filter',
            value: [filter_cost_min,filter_cost_max],
            on:{
              change:function(r){
                $$('[name=filter_cost_min]').val(r.value[0]).change();
                $$('[name=filter_cost_max]').val(r.value[1]).change();
              }
            }
          });

        app.request.getJSON('https://www.tanie-loty.com.pl/okazje/home.json?action=app',null,function(result){

            html='';
            result.list_home.forEach(function(entry) {
              if(entry.price>0){
                $el = $$('.home_okazje').eq(0);
                $el.find('.card-header-image').attr('data-background',entry.image_url)
                $el.find('a.card').attr('href', entry.url.replace('/okazje/','/okazje/entries/')).attr('class', 'card');
                $el.find('.card-content b').html(entry.title);

                if(entry.price>0)$el.find('.card-price').html('<b>'+entry.price+'</b>&nbsp; zł');
                //else if(entry.lowest_price>0)$el.find('.card-price').html('<b>od '+entry.lowest_price+'</b>&nbsp; zł');

                $el.find('span.button').html('Sprawdź');

                html += $el.html();

              }
            });

            $$('.home_okazje').html(html);
            app.lazy.create('.home_okazje .card-header-image');
        });        

      },
      pageAfterIn: function (e, page) {  


      },
    },
  },


  {
    path: '/okazje/entries/:Cart/:Url',
    //url: './pages/pakiet.html',

    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;

      app.preloader.show();
      app.request.getJSON('https://www.tanie-loty.com.pl/okazje/'+routeTo.params.Cart+'/'+routeTo.params.Url+'?app=true',null,function(result){


        switch(result.type){
          case 'tour':{tplname='tour.html';break;}
          case 'flight':{tplname='flight.html';break;}
          default:{tplname='package.html';}
        }

        resolve( { templateUrl: './pages/'+tplname }, { context: {
          result: result,
          img_base: 'https://img.tanie-loty.com.pl/media/slir/w'+(Math.min(960,Math.ceil($$('#app').width()/20)*40))+'-q80/',
          shareable: navigator.share,
          last_list: document.last_list?document.last_list:'/home/',
          favorited: isFavorited(routeTo.path),
        } });

        //console.log('https://img.tanie-loty.com.pl/media/slir/w'+(Math.min(960,Math.ceil($$('#app').width()/20)*40))+'-q80/'+result.image);
        app.preloader.hide();

      },function(xhr, status){
          app.preloader.hide();
          app.dialog.alert('Przepraszamy', 'Wybrana przez Ciebie okazje nie istnieje.');          
      });
    }

  }, 


  {
    path: '/okazje/entries/:Url',
    //url: './pages/pakiet.html',

    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;

      app.preloader.show();
      app.request.getJSON('https://www.tanie-loty.com.pl/okazje/'+routeTo.params.Url+'?app=true',null,function(result){

        switch(result.type){
          case 'tour':{
            result.record.hotel.additional_info = result.record.hotel.additional_info.split(',');
            if(result.record.hotel.rating>0){
              result.record.hotel.ratingstars="★".repeat( result.record.hotel.rating );
            }            
            tplname='tour.html';break;
          }
          case 'flight':{tplname='flight.html';break;}
          default:{
            result.record.hotel.additional_info = result.record.hotel.additional_info.split(',');
            if(result.record.hotel.rating>0){
              result.record.hotel.ratingstars="★".repeat( result.record.hotel.rating );
            }
            tplname='package.html';
          }
        }

        resolve( { templateUrl: './pages/'+tplname }, { context: {
          result: result,
          img_base: 'https://img.tanie-loty.com.pl/media/slir/w'+(Math.min(960,Math.ceil($$('#app').width()/20)*40))+'-q80/',
          shareable: navigator.share,
          last_list: document.last_list?document.last_list:'/home/',
          favorited: isFavorited(routeTo.path),
        } });
        app.preloader.hide();

      },function(xhr, status){
          url= xhr.requestUrl.substring( 0, xhr.requestUrl.indexOf( "?app=true" ) ).substring( xhr.requestUrl.indexOf(".pl/")+3 ).replace('okazje/','okazje/entries/');
          if(isFavorited(url))removeFavorite(url);
          app.preloader.hide();
          app.dialog.alert('Przepraszamy', 'Wybrana przez Ciebie okazje nie istnieje.'); 
      });
    }

  }, 

  {
    path: '/okazje/lists/:Url',
    //url: './pages/pakiet.html',

    async: function (routeTo, routeFrom, resolve, reject) {
      document.last_list='/okazje/lists/'+routeTo.params.Url;
      var router = this;
      var app = router.app;

        app.preloader.show();

        if(routeTo.params.Url.indexOf('&')>0){
          url = 'https://www.tanie-loty.com.pl/okazje/?'+routeTo.params.Url;  
        }else{
          url = 'https://www.tanie-loty.com.pl/okazje/'+routeTo.params.Url+'?app=true';  
        }
        

        app.request.getJSON(url,null,function(result){

          for (var key in result.list) {
            var obj=result.list[key];
            switch(obj._type){
              case 'pakiety':
              case 'wycieczki':
              case 'loty':
              {
                url=obj._url.replace('/okazje/','/okazje/entries/');
                break;
              }
              default:{
                url='404';
              }
            }

            if(obj._type=='koszyki'){
              card_price='od&nbsp;<b>'+obj.lowest_price+'</b>&nbsp;zł';
            }else{
              card_price='<b>'+obj.price+'</b>&nbsp;zł';
            }

            imgparams='w'+(Math.min(960,Math.ceil($$('#app').width()/20)*40))+'-q80';
            obj.rendered_html='<a href="'+url+'" class="card"><div data-background="'+obj._image_url.replace('{params}',imgparams).replace('w480-h240-q95-c2x1',imgparams)+'" class="card-header card-header-image align-items-flex-end lazy lazy-fade-in"></div><div class="card-content card-content-padding"><p><b>'+obj.title+'</b></p></div><div class="card-footer"><span class="card-price">'+card_price+'</span><span class="col button button-fill">Sprawdź</span></div></a>';

          }

          resolve(
            {
              templateUrl: './pages/list.html',
            },
            {
              context: { list: result.list, title: result.title, type: 'items' }
            }            
          );
          app.preloader.hide();

        },function(){
            //error 
        });
      

    }

  },    

  {
    path: '/favorites/',
    //url: './pages/pakiet.html',

    async: function (routeTo, routeFrom, resolve, reject) {
      document.last_list='/favorites/';
      var router = this;
      var app = router.app;
      app.preloader.show();
      favorites = getFavorites();
      
      for (var key in favorites) {
        var obj=favorites[key];
          card_price='<b>'+obj.price+'</b> zł';
        obj.rendered_html='<a href="'+obj.url+'" class="card"><div data-background="'+obj.image+'" class="card-header card-header-image align-items-flex-end lazy lazy-fade-in"></div><div class="card-content card-content-padding"><p><b>'+obj.title+'</b></p></div><div class="card-footer"><span class="card-price">'+card_price+'</span><span class="col button button-fill">Sprawdź</span></div></a>';

      }

      resolve(
        {
          templateUrl: './pages/list.html',
        },
        {
          context: { list: favorites, title: 'Ulubione', type: 'favorites' }
        }            
      );
      app.preloader.hide();

    }

  },  





  {
    path: '/about/',
    url: './pages/about.html',
  },
  {
    path: '/flightsearch/',
    url: './pages/flightsearch.html',


    on: {

      pageAfterIn: function(){
              renderSBWidget($$('.esky-widget')[0]);
            },

      pageInit: function(){



      /*

        
        app.form.fillFromData('#flight_search', app.form.getFormData('flight_search') )


        var search_flight_from = app.autocomplete.create({
          openIn: 'popup',
          openerEl: '#search_flight_from',
          closeOnSelect: true,
          autoFocus: true,
          source: function (query, render) {
            var results = [];
            if (query.length === 0) {
              render(results);
              return;
            }
            for (var i = 0; i < window.airports.length; i++) {
              if (window.airports[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(window.airports[i]);
            }
            render(results);
          },
          on: {
            change: function (value) {
              $$('#search_flight_from').find('.item-after').text(value[0]);
              $$('#search_flight_from').find('input').val(value[0]);
            },
          },
        });        

        var search_flight_to = app.autocomplete.create({
          openIn: 'popup',
          openerEl: '#search_flight_to',
          closeOnSelect: true,
          autoFocus: true,
          source: function (query, render) {
            var results = [];
            if (query.length === 0) {
              render(results);
              return;
            }
            for (var i = 0; i < window.airports.length; i++) {
              if (window.airports[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(window.airports[i]);
            }
            render(results);
          },
          on: {
            change: function (value) {
              $$('#search_flight_to').find('.item-after').text(value[0]);
              $$('#search_flight_to').find('input').val(value[0]);
            },
          },
        });        

        var flightDate = app.calendar.create({
          inputEl: '#flight-date',
          dateFormat: 'dd M yyyy',
          closeOnSelect: true,
          minDate: new Date(),
        });   

        var flightRange = app.calendar.create({
          inputEl: '#flight-range',
          dateFormat: 'dd M yyyy',
          rangePicker: true,
          closeOnSelect: true,
          minDate: new Date(),
        });   

        $$('[name="flight_type_return"]').on('change', function (e){
          if( $$('[name="flight_type_return"]')[0].checked == true){
            $$('.item-input-flight-date').hide();
            $$('.item-input-flight-range').show();
          }else{
            $$('.item-input-flight-date').show();
            $$('.item-input-flight-range').hide();
          }
        });

        passengersRecalc();

        app.stepper.create({
          el:'.stepper-adt',
          max:9,
        }).on('change', function(v){
          passengersRecalc();
          app.stepper.get('.stepper-chd').params
        })

        app.stepper.create({
          el:'.stepper-chd',
          max:9,
        }).on('change', function(v){
          passengersRecalc();
        });*/

      }
    }



  },
  {
    path: '/news/:Id',

    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;

      app.preloader.show();
      app.request.getJSON('https://www.tanie-loty.com.pl/czytelnia/wp-json/tlplugin/v1/news/'+routeTo.params.Id,null,function(result){
        resolve( { templateUrl: './pages/news.html', }, { context: {
          news: result.news,
          page: routeTo.params.Id,
          shareable: navigator.share,
          img_base: 'https://img.tanie-loty.com.pl/media/slir/w'+(Math.min(960,Math.ceil($$('#app').width()/20)*40))+'-q80/',
        } });

        app.preloader.hide();

      },function(){
          app.preloader.hide();
          app.dialog.alert('Przepraszamy', 'Wybrana przez Ciebie strona nie istnieje.');          
      });
    },    
    on:{
      
      pageAfterIn: function (e, page) {  

        $$('.dummy_li').html( $$('.media-list>ul>li').eq(0).html() );

        // Attach 'infinite' event handler
        $$('.infinite-scroll-content').on('infinite', function () {

          if (!allowInfinite) return;
          allowInfinite = false;
          page=$$('.media-list>ul>li').length/20+1;
          app.request.getJSON('https://www.tanie-loty.com.pl/czytelnia/wp-json/tlplugin/v1/news/'+page,null,function(result){

            allowInfinite = true;
            if (lastItemIndex >= maxItems || !result.news.length>0) {
              app.infiniteScroll.destroy('.infinite-scroll-content');
              $$('.infinite-scroll-preloader').remove();
              return;
            }

            html='';
            result.news.forEach(function(entry) {
              $el = $$('li.dummy_li').eq(0);
              $el.find('.popup-open').attr('data-popup','.popup-news-'+entry.term_id);
              $el.find('.item-media img').attr('src', entry.image_url);
              $el.find('.item-title').html(entry.title);
              $el.find('.item-subtitle').html(entry.post_date);
              $el.find('.item-text').html(entry.excerpt);
              $el.find('.popup').attr('class','popup popup-news-'+entry.term_id);
              $el.find('.popup .occ-deal-pic').attr('style',"").attr('data-background', entry.image_url );
              $el.find('.popup .block h1').html(entry.title);
              $el.find('.popup .popup-content').html('<!-- '+entry.content+' -->');

              html += '<li>' + $el.html() + '</li>';
            });


            $$('.media-list>ul').append(html);
            lastItemIndex = $$('.media-list>ul>li').length;
          });

        });

        app.on('popupOpen', function (popup) {
          $$('#app>.popup .popup-content').html( $$('#app>.popup .popup-content').html().replace('<!--', '').replace('-->', '') );
           app.lazy.create('#app>.popup occ-deal-pic');
           $$('#app>.popup .occ-deal-pic').css('background-image','url('+$$('#app>.popup .occ-deal-pic').attr('data-background')+')');

           $$('.wp-block-embed-youtube').forEach(function(){ $$(this).html( '<div class="embed-container"><iframe src="https://www.youtube.com/embed/'+( $$(this).removeClass('wp-block-embed-youtube').addClass('wp-block-embed-youtube-r').find('.wp-block-embed__wrapper').text().split('?')[1].split('v=')[1].split('&')[0] )+'" frameborder="0" allowfullscreen></iframe></div>' )  });

          $$('.wp-block-embed-wordpress').forEach(function(){
            url=$$(this).removeClass('wp-block-embed-wordpress').addClass('wp-block-embed-wordpress-r').find('.wp-block-embed__wrapper').text();
            $$(this).html( '<div class="embed-container"><a href="'+url+'" target="_blank" class="link external">'+url+'</a></div>' )  });

           $$('.popup .block a').addClass('link').addClass('external').attr('target','_blank');
            FB.init({xfbml      : true,version    : 'v4.0'});

            try{
              instgrm.Embeds.process()  
            }catch(e){}
            
        });

      },

    }

  },
  // Page Loaders & Router
/*  {
    path: '/page-loader-template7/:user/:userId/:posts/:postId/',
    templateUrl: './pages/page-loader-template7.html',
  },
  {
    path: '/page-loader-component/:user/:userId/:posts/:postId/',
    componentUrl: './pages/page-loader-component.html',
  },*/
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/request-and-load.html',
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];


function passengersRecalc(){
        count_adt = parseInt($$('[name="data[Multisearches][adt]"]').val());
        count_chd = parseInt($$('[name="data[Multisearches][chd]"]').val());
        $$('.badge-passengers-count').text(count_adt+count_chd);

}
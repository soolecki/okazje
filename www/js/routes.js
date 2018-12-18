routes = [
  /*{
    path: '/',
    url: './index.html',
  },*/

  {
    path: '/home/',
    options: {
      animate: false,
    },    
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;

      if(!app.data.list_home){
        app.preloader.show();
        app.request.getJSON('https://www.tanie-loty.com.pl/?option=com_okazje&view=home&format=raw&action=app',null,function(result){

          app.data.list_home = result['list_home'];
          app.data.data_filters = result['filters'];

          for (var key in app.data.list_home) {
            var obj=app.data.list_home[key];

            switch(obj._type){
              case 'pakiety':
              case 'wycieczki':
              case 'loty':
              {
                url='/okazje/entries'+(obj.url.replace('/component','').replace('/okazje','').replace('//','/') );
                break;
              }
              default:{
                url='404';
              }
            }

            img_url='https://img.tanie-loty.com.pl/media/slir/w'+(Math.min(960,Math.ceil($$('#app').width()/20)*40))+'-q80/storage_local/okazje/'+JSON.parse(obj.images)[0];

            if(obj._type=='koszyki'){
              card_price='od <b>'+obj.lowest_price+'</b> zł';
            }else{
              card_price='<b>'+obj.price+'</b> zł';
            }

            obj.rendered_html='<a href="'+url+'" class="card"><div data-background="'+img_url+'" class="card-header card-header-image align-items-flex-end lazy lazy-fade-in"></div><div class="card-content card-content-padding"><p><b>'+obj.title+'</b></p></div><div class="card-footer"><span class="card-price">'+card_price+'</span><span class="col button button-fill button-round">Sprawdź</span></div></a>';

          }

          resolve(
            {
              templateUrl: './pages/list.html',
            },
            {
              context: { list: result['list_home'], title: 'Okazje' }
            }            
          );
          updateFilters(app.data.data_filters);
          app.preloader.hide();

        },function(){
            //error 
        });
      }else{
          resolve(
            {
              templateUrl: './pages/list.html',
            },
            {
              context: {
                list: app.data.list_home,
              }
            }            
          );        
      }

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
          img_base: 'https://img.tanie-loty.com.pl/media/slir/w'+(Math.min(960,Math.ceil($$('#app').width()/20)*40))+'-q80/storage_local/okazje/',
          shareable: navigator.share,
        } });
        app.preloader.hide();

      },function(){
          //error 
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
          case 'tour':{tplname='tour.html';break;}
          case 'flight':{tplname='flight.html';break;}
          default:{tplname='package.html';}
        }

        resolve( { templateUrl: './pages/'+tplname }, { context: {
          result: result,
          img_base: 'https://img.tanie-loty.com.pl/media/slir/w'+(Math.min(960,Math.ceil($$('#app').width()/20)*40))+'-q80/storage_local/okazje/',
          shareable: navigator.share,
        } });
        app.preloader.hide();

      },function(){
          //error 
      });
    }

  }, 

  {
    path: '/okazje/lists/:Url',
    //url: './pages/pakiet.html',

    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;

        app.preloader.show();
        app.request.getJSON('https://www.tanie-loty.com.pl/okazje/?'+routeTo.params.Url,null,function(result){

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
              card_price='od <b>'+obj.lowest_price+'</b> zł';
            }else{
              card_price='<b>'+obj.price+'</b> zł';
            }

            imgparams='w'+(Math.min(960,Math.ceil($$('#app').width()/20)*40))+'-q80';
            obj.rendered_html='<a href="'+url+'" class="card"><div data-background="'+obj._image_url.replace('{params}',imgparams).replace('w480-h240-q95-c2x1',imgparams)+'" class="card-header card-header-image align-items-flex-end lazy lazy-fade-in"></div><div class="card-content card-content-padding"><p><b>'+obj.title+'</b></p></div><div class="card-footer"><span class="card-price">'+card_price+'</span><span class="col button button-fill button-round">Sprawdź</span></div></a>';

          }

          resolve(
            {
              templateUrl: './pages/list.html',
            },
            {
              context: { list: result.list, title: result.title }
            }            
          );
          app.preloader.hide();

        },function(){
            //error 
        });
      

    }

  },    

/*  {
    path: '/about/',
    url: './pages/temp-content.html',
  },
  {
    path: '/form/',
    url: './pages/form.html',
  },
  // Page Loaders & Router
  {
    path: '/page-loader-template7/:user/:userId/:posts/:postId/',
    templateUrl: './pages/page-loader-template7.html',
  },
  {
    path: '/page-loader-component/:user/:userId/:posts/:postId/',
    componentUrl: './pages/page-loader-component.html',
  },
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
  },*/
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];

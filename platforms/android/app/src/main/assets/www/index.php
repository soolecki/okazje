<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Security-Policy" content="default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap: content:">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui, viewport-fit=cover">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#774488">
  <meta name="format-detection" content="telephone=no">
  <meta name="msapplication-tap-highlight" content="no">
  <title>Okazje</title>
  <link rel="icon" sizes="512x512" href="icons/favicon-512x512.png">
  <link rel="icon" sizes="192x192" href="icons/favicon-192x192.png">
  <link rel="icon" sizes="128x128" href="icons/favicon-128x128.png">
  <link rel="apple-touch-icon" sizes="128x128" href="icons/favicon-128x128.png">
  <link rel="apple-touch-icon-precomposed" sizes="128x128" href="icons/favicon-128x128.png">

  <link rel="stylesheet" href="framework7/css/framework7.min.css">
  <link rel="stylesheet" href="css/icons.css">

  <link rel="stylesheet" href="css/app.css">
  <!--<style><?php echo file_get_contents('css/app.css')?></style>-->

  <link rel="manifest" href="manifest.json">
</head>

<body>
  <div id="app">
    <div class="statusbar"></div>
    <div class="panel panel-left panel-reveal theme-light">
      <div class="view">
        <div class="page">
          <div class="navbar">
            <div class="navbar-inner">
              <div class="right">
                <a href="#" class="link icon-only panel-close filters-reset">
                  <i class="icon f7-icons ios-only">home</i>
                  <i class="icon material-icons md-only">home</i>
                </a>
              </div>
            </div>
          </div>
          <div class="page-content">

            <div class="subnavbar">
              <div class="navbar-inner">
                <div class="right">Filtry</div>
                <a href="#" class="link float-right icon-only filters-reset padding">
                  <i class="icon size-22 f7-icons ios-only">refresh</i>
                  <i class="icon size-22 material-icons md-only">refresh</i>
                </a>                
              </div>
            </div>

            <form id="filters_form" action="https://www.tanie-loty.com.pl/okazje" method="get" class="form-store-data">
              <input type="hidden" name="view" value="list">
              <input type="hidden" name="app" value="true">
              <div class="list">
                <ul id="filters"></ul>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="view view-main ios-edges">
      <div class="page" data-name="home" style="background:#774488">
        <div class="page-content">
        </div>
      </div>
    </div>

    <!-- Entry -->
    <div class="view view-entry" id="entry">
      <div class="view">
        <div class="page">
        </div>
      </div>
    </div>

  <!-- Cordova -->
  <script src="cordova.js"></script>

  <!-- Framework7 library -->
  <script src="framework7/js/framework7.min.js"></script>

  <!-- App routes -->
  <script src="js/routes.js"></script>
  <!--<script><?php echo file_get_contents('js/routes.js')?></script>-->

  <!-- Your custom app scripts -->
  <script src="js/app.js"></script>
  <!--<script><?php echo file_get_contents('js/app.js')?></script>-->
</body>
</html>

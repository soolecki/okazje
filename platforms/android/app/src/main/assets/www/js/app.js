if('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('/service-worker.js')
           .then(function() { console.log("Service Worker Registered"); });
}

var $$ = Dom7;
var allowInfinite = true;

var lastItemIndex = $$('.media-list>ul>li').length;
var maxItems = 200;
var itemsPerLoad = 20;


// Framework7 App main instance
var app  = new Framework7({
  root: '#app', 
  id: 'com.artweb.okazje',
  name: 'Okazje',
  theme: 'auto',

  precompileTemplates: true,
  template7Pages: true,  
  lazy:{
    threshold: 800,
    sequential: false
  },
  /*pushState: true,*/

  data: function () {
    return {
      /*user: {
        firstName: 'John',
        lastName: 'Doe',
      },*/
      // Demo products for Catalog section
      /*products: [
        {
          id: '1',
          title: 'Apple iPhone 8',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
        },
        {
          id: '2',
          title: 'Apple iPhone 8 Plus',
          description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
        },
        {
          id: '3',
          title: 'Apple iPhone X',
          description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
        },
      ]*/
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
});

// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/',
  //pushState: true,
});
var flightsearchView = app.views.create('#view-flightsearch', {
  url: '/flightsearch/',
  //pushState: true,
});
var newsView = app.views.create('#view-news', {
  url: '/news/1',
  //pushState: true,
});

// Login Screen Demo
$$('#my-login-screen .login-button').on('click', function () {
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();

  // Close login screen
  app.loginScreen.close('#my-login-screen');

  // Alert username and password
  app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
});

$$('#app').on('click', '#filters_form_submit', function (e) {

  inputs=$$('#filters_form select,#filters_form input');
  var str = "";
  inputs.each(function (i, item) {

    if(item.multiple){
      $$(item.selectedOptions).each(function(j, option){
        str += encodeURIComponent(item.name) + "=" + encodeURIComponent(option.value) + "&";
      })
    }else{
      str += encodeURIComponent(item.name) + "=" + encodeURIComponent(item.value) + "&";
    }
  
  });
  homeView.router.navigate("/okazje/lists/"+str);

});  

$$('#app').on('click', '.favorite', function (e) {
  url =homeView.history[homeView.history.length-1];
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

$$('#app').on('click', '.favorite', function (e) {
  //console.log('LINK!');
})

$$(".main-tabs" ).on('tab:show', function() {
  var $tabEl = $$(this).find('.tab-active');
  var tabId = $tabEl.attr('id');

})

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



window.airports = ("Warszawa [WAWA];Krakow [KRK];Katowice [KTW];Gdansk [GDN];Wroclaw [WRO];Warszawa [WAW];Poznan [POZ];Londyn [LON];Berlin [BER];Warszawa [WMI];Rzym [ROM];Eindhoven [EIN];Barcelona [BCN];Rzeszow [RZE];Paryż [PAR];Szczecin [SZZ];Amsterdam [AMS];Londyn [STN];Dublin [DUB];Londyn [LTN];Ateny [ATH];Dortmund [DTM];Split [SPU];Oslo [OSL];Palma [PMI];Malta [MLA];Bydgoszcz [BZG];Bourgas [BOJ];Lizbona [LIS];Frankfurt [FRA];Lodz [LCJ];Nowy Jork [NYC];Lwów [LWO];Lublin [LUZ];Madryt [MAD];Antalya [AYT];Birmingham [BHX];Liverpool [LPL];Bruksela [CRL];Edynburg [EDI];Mediolan [BGY];Bristol [BRS];Sztokholm [NYO];Bangkok [BKK];Kolonia Bonn [CGN];Monachium [MUC];Praga [PRG];Alicante [ALC];Mediolan [MIL];Korfu [CFU];Malaga [AGP];Denpasar, Bali [DPS];Teneryfa [TCI];Neapol [NAP];Porto [OPO];Manchester [MAN];Zakinthos [ZTH];Oslo [TRF];Wiedeń [VIE];Dusseldorf [DUS];Budapeszt [BUD];Kijów [KBP];Sztutgart [STR];Kopenhaga [CPH];Dubrownik [DBV];Berlin [SXF];Hamburg [HAM];Larnaka [LCA];Doncaster Sheffield [DSA];Warna [VAR];Zurych [ZRH];Heraklion [HER];Rejkjawik [REK];Zadar [ZAD];Tirana [TIA];Wenecja [TSF];Los Angeles [LAX];Bolonia [BLQ];Madera Funchal [FNC];Bruksela [BRU];Szymany [SZY];Derby [EMA];Chicago [CHI];Paryż [CDG];Glasgow [GLA];Nicea [NCE];Bari [BRI];Leeds [LBA];Katania [CTA];Rzym [CIA];Rodos  [RHO];Billund [BLL];Sycylia Trapani [TPS];Hurghada [HRG];Faro [FAO];Kutaisi [KUT];Podgorica [TGD];Las Palmas [LPA];Sztokholm [STO];Piza [PSA];Chania [CHQ];Male [MLE];Wenecja [VCE];Saloniki [SKG];Londyn [LHR];Bergen [BGO];Girona [GRO];Goteborg [GOT];Punta Cana [PUJ];Palermo [PMO];Tokio [TYO];Puerto del Rosario [FUE];Cork [ORK];Valencia [VLC];Toronto [YTO];Berlin [TXL];Rzym [FCO];Thira Santoryn [JTR];Dubaj World Central [DWC];Rotterdam [RTM];Stambuł [IST];Hahn [HHN];Paryż[BVA];Sydney [SYD];Nowy Jork [JFK];Belfast [BFS];Chicago [ORD];Sofia [SOF];Londyn [LGW];Tel Aviv Yafo [SDV];Sewilla [SVQ];Hawana [HAV];Mulhouse Basel [BSL];Phuket [HKT];Paphos [PFO];Genewa [GVA];Malme [MMX];Antwerpia [ANR];Tel Aviv Yafo [TLV];Odessa [ODS];Tbilisi [TBS];Cagliari [CAG];Trondheim [TRD];Norymberga [NUE];Stavanger [SVG];Miami [MIA];Arrecife [ACE];Teneryfa [TFS];Hanower [HAJ];Kos [KGS];Kijów [IEV];Zanzibar [ZNZ];Florencja [FLR];Marsylia [MRS];Memmingen-Allgau [FMM];Brema [BRE];Helsinki [HEL];Rejkjawik [KEF];Lyon [LYS];Tunis [TUN];Moskwa [MOW];Nowy Jork [EWR];Monastir [MIR];Shannon [SNN];Wilno [VNO];Singapur [SIN];Zagrzeb [ZAG];Bukareszt [BUH];Ibiza [IBZ];Zielona Gora [IEG];Newcastle [NCL];Barcelona Reus [REU];Aberdeen [ABZ];Olbia [OLB];Hanoi [HAN];Malmo [MMA];Werona [VRN];Pula [PUY];Meksyk [MEX];Rimini [RMI];Batumi [BUS];Ryga [RIX];Dżerba [DJE];Manila [MNL];Dusseldorf [NRN];Kair [CAI];Lamezia-terme [SUF];Milas [BJV];Aalesund [AES];Glasgow [PIK];New Delhi [DEL];Lublana [LJU];Marrakesz [RAK];Paryż [ORY];Port Louis [MRU];Agadir [AGA];Toronto [YYZ];Erewań [EVN];Bordeaux [BOD];Sharm El Sheikh [SSH];Tuluza [TLS];Alghero [AHO];Pekin [PEK];Luksemburg [LUX];Drezno [DRS];Tromso [TOS];Rio de Janeiro [RIO];Amman [AMM];Sztokholm [ARN];Bratysława [BTS];Nikozja [ECN];Dubai [DXB];Kolombo [CMB];Pescara [PSR];Tivat [TIV];San Francisco [SFO];Krabi [KBV];Cancun [CUN];Skopje [SKP];Buenos Aires [BUE];Ponta Delgada, Azores [PDL];Turyn [TRN];Marsa Alam Intl [RMF];Petersburg [LED];Tallin [TLL];Ohrid [OHD];Londyn [LCY];Bournemouth [BOH];Aarhus [AAR];Melbourne [MEL];Kiszyniów [KIV];Waszyngton [WAS];Turku [TKU];Szanghaj [SHA];Mahe Island [SEZ];Kuala Lumpur [KUL];Honolulu [HNL];Karlsruhe/Baden Baden [FKB];Ostrawa [OSR];Izmir [IZM];Dominica [DOM];Lima [LIM];Bilbao [BIO];Mediolan [MXP];Auckland [AKL];Mikonos [JMK];Belgrad [BEG];Rijeka [RJK];Kharkov [HRK];Eilat [ETH];Lourdes/Tarbes [LDE];Euroairport Basel Mulhouse Freiburg [BSL];Vancouver [YVR];Genoa [GOA];Fort Dauphin [FTU];Praslin Island [PRI];Boston [BOS];Perth [PER];Mińsk [MSQ];Tokio [NRT];Algiers [ALG];Las Vegas [LAS];Seul [SEL];Bodo [BOO];Groningen [GRQ];Nantes [NTE];Santiago [SCL];Muenster/Osnabrueck [FMO];Puerto Princesa [PPS];Maastricht [MST];Ho Chi Minh City [SGN];Kefalonia [EFL];Innsbruck [INN];Kristiansand [KRS];Brisbane [BNE];Seul [ICN];Minsk International 1 [MHP];Nairobi [NBO];Aalborg [AAL];Figari [FSC];Berno [BRN];Dworzec w Bazylei [ZDH];Radom [RDO];Tampa [TPA];Istanbul Airport [IST];Oslo [RYG];Mumbai [BOM];Dżakarta [CGK];Ałma Ata [ALA];Antananarywa [TNR];Montego Bay [MBJ];Osaka [OSA];Varadero [VRA];Kulusuk [KUS];Katmandu [KTM];Hong Kong [HKG];Lubeka [LBC];Salzburg [SZG];Leipzig-Halle [LEJ];Nossi-Be [NOS];Seul [GMP];Belfast [BHD];Taszkent [TAS];Rovaniemi [RVN];Bandżul [BJL];Santander [SDR];Moskwa [SVO];Fort De France [FDF];Angling Lake [YAX];Eastleigh near Southampton [SOU];Phnom Penh [PNH];Johannesburg [JNB];Sarajewo [SJJ];Ankara [ESB];Kalgary [YYC];Harstad-narvik [EVE];Koszalin [OSZ];Brindisi [BDS];Detroit, MI [DTW];Guangzhou [CAN];San Paulo [SAO];Dalaman [DLM];Bogota [BOG];Skiathos [JSI];Doha [DOH];Zaporozhye [OZH];Montreal [YUL];Gwatemala [GUA];Nuuk [GOH];Bukareszt [OTP];San Jose [SJO];Kavala [KVA];Sitia [JSH];Melbourne [AVV];Adelaide [ADL];Brac [BWK];Astana [TSE];Kaunas [KUN];Denver [DEN];Mostar [OMO];Langkawi [LGK];Bridgetown [BGI];Mombasa [MBA];Cebu [CEB];Caracas [CCS];Inverness [INV];Menorca [MAH];Castellon Airport [CDT];Coventry [CVT];Molde [MOL];Jersey [JER];Strasburg [SXB];Krasnodar [KRR];Santo Domingo [SDQ];Beirut [BEY];Cardiff [CWL];Taipei [TSA];Holguin [HOG];Wrangell [WRG];Nadi [NAN];Kapsztad [CPT];Haugesund [HAU];Patras [GPA];Lille [LIL];Bastia [BIA];Lagos [LOS];Balikpapan [BPN];Ułan Bator [ULN];Ancona [AOI];Stambuł Sabiha Gocken [SAW];Alta [ALF];Manchester, NH [MHT];Izmir [ADB];Siem Reap [REP];Friedrichshafen [FDH];Birmingham [BHM];Preveza/Lefkas [PVK];Gan Island [GAN];Santiago de Compostela [SCQ];Poprad [TAT];Grenoble [GNB];Koh Samui [USM];Kingston [KIN];Gibraltar [GIB];Konstanca [CND];Louisville, KY [SDF];Kerry County [KIR];Anfa [CAS];Ejlat-Ramon [ETM];Edmonton, AB [YEG];Granada [GRX];Triest [TRS];Quito [UIO];Sarmellek/Balaton [SOB];Ilha Do Sal [SID];Abudża [ABV];Aqaba [AQJ];Milos [MLO];Durban [DUR];Szanghaj [PVG];Muscat [MCT];Koszyce [KSC];Taupo [TUO];Phoenix, AZ [PHX];Ajaccio [AJA];San Diego [SAN];Acapulco [ACA];Reykjavik Airport [RKV];Murcia [MJV];Nassau [NAS];Almeria [LEI];Paderborn [PAD];Montevideo [MVD];Fort Lauderdale, FL [FLL];Reggio Calabria [REG];Minneapolis [MSP];Kaliningrad [KGD];St.tropez [LTT];Sheffield [SZD];Abu Dhabi [AUH];Kazan [KZN];Broome, Western Australia [BME];Aruba [AUA];Aberdeen [ABR];Brno [BRQ];Cuzco [CUZ];Freeport [FPO];Bonn Colony [QKL];Teneryfa [TFN];Wyspa Wielkanocna [IPC];La Paz [LPB];Oran [ORN];Sztokholm [BMA];Kiruna [KRN];Seattle, WA [SEA];Cluj-Napoca [CLJ];Goteborg [GSE];Filadelfia [PHL];Graz [GRZ];Orlando [ORL];Camaguey [CMW];Kano [KAN];Kłajpeda/Połąga [PLQ];Houston [IAH];Vaxjo [VXO];Oulu [OUL];Puerto Plata [POP];Santa Cruz de la Palma [SPC];Christchurch [CHC];Lugano/Agno [LUG];Norwich [NWI];Pointe-a-Pitre [PTP];Charlotte [CLT];Dakar [DKR];Taba [TCP];Austin [AUS];Mediolan [LIN];Atlanta [ATL];Dallas [DAL];Dnepropetrovsk [DNK];Darlington, Durham [MME];Entebbe [EBB];Sana [SAH];Cleveland [CLE];Prisztina [PRN];Ivano-Frankovsk [IFO];Jerez de la Frontera [XRY];Papeete [PPT];Ankavandra [JVA];Rabat [RBA];Orlando [MCO];Sorevag [FAE];Casablanca [CMN];Erfurt [ERF];Dworzec Kolejowy Stuttgart [ZWS];Bacau [BCM];Montpellier [MPL];Panama [PTY];Polokwane [PTG];Fortaleza [FOR];Vinnica [VIN];Ronne [RNN];Mediolan [PMF];Walencja [VLN];Alexandria [ALY];Linz [LNZ];Teheran [THR];Longyearbyen [LYR];Haifa [HFA];Lappeenranta [LPP];Kassel [KSF];Chicago [MDW];Galapagos Is [GPS];Holyhead [HLY];Leknes [LKN];Waszyngton [IAD];Praja [RAI];Goa [GOI];Asuncion [ASU];Paro [PBH];Samana El Catey International [AZS];Wellington [WLG];Bolzano [BZO];Rennes [RNS];La Coruna [LCG];Exeter [EXT];Władywostok [VVO];Kilimandżaro [JRO];Naksos [JNX];Tokio[HND];Kalamata [KLX];Indianapolis, IN [IND];Mitilini [MJT];Gyandzha [KVD];Guadalajara [GDL];Sibiu [SBZ];Poza Rica [PAZ];Karup [KRP];Visby [VBY];Dalat [DLI];Mexicali [MXL];Biszkek [FRU];Saarbruecken [SCN];Koror [ROR];Addis Abeba [ADD];Karpathos [AOK];Kompongsom [KOS];Erzincan [ERC];Chernovtsy [CWC];Pampeluna [PNA];Buayan [GES];Heydar Aliyev International Bina International [GYD];Osaka [KIX];Humberside [HUY];Bermudy [BDA];St Denis de la Reunion [RUN];Samos [SMI];Waterford [WAT];George [GRJ];Iguassu Falls [IGU];Alexandria [HBE];Medellin [MDE];Barcelona [BLA];Rostock-laage [RLG];Ostersund [OSD];Tours [TUF];Umea [UME];Montreal [YMQ];Adana [ADA];Chiang Mai [CNX];Georgetown [GGT];Karaczi [KHI];Wyspa Man [IOM];Cayo Coco [CCC];Ottawa [YOW];Majunga [MJN];Chittagong [CGP];Portland, OR [PDX];East London [ELS];Cambridge [CBG];Kayseri [ASR];Brasilia, Distrito Federal [BSB];Brighton [BSH];Santa Cruz [VVI];Oviedo/Aviles [OVD];Eisenach [EIB];La Rochelle [LRH];Guayaquil [GYE];Cartagena [CTG];Oxford [OXF];Leh [IXL];Damaszek [DAM];Gisborne [GIS];Fort Myers [RSW];Stavropol [STW];Kowanyama [KWM];Civil-marka [ADJ];Winnipeg [YWG];Akureyri [AEY];Rio de Janeiro [GIG];Akra [ACC];Sydney, NS [YQY];Kabul [KBL];Kuwejt [KWI];Kota-Kinabalu [BKI];San Salwador [SAL];Mannheim [MHG];Douala [DLA];Biarritz [BIQ];Siros Island [JSY];Kristiansund [KSU];Craiova [CRA];Canberra [CBR];Paros [PAS];Nykoping [XWZ];Cuenca [CUE];Plymouth [PLH];Nha Trang [NHA];Sztokholm [VST];Dakka [DAC];Dżakarta [JKT];Trypolis [TIP];Port Moresby [POM];Tanger [TNG];Taipei [TPE];Hanimaadhoo [HAQ];Dallas [DFW];Port Of Spain [POS];Saragossa [ZAZ];Nowy Orlean [MSY];Detroit, MI [DTT];Islamabad [ISB];Banja Luka [BNX];Tuzla International [TZL];Rodrigues [RRG];Gazipasa [GZP];Cherson [KHE];Managua [MGA];Perugia [PEG];Nakhon Phanom [KOP];Osh [OSS];Luxor [LXR];Mineralne Wody [MRV];Armenia [AXM];Ilulissat [JAV];Wadi Ad Dawasir [WAE];Nuku Hiva [NHV];Jaunde [NSI];Adan [ADE];Irkuck [IKT];Pittsburgh, PA [PIT];Vigo [VGO];Wientian [VTE];Southend [SEN];Maldonado [PDP];St Martin [SFG];Sennaj/Madras [MAA];Bagdad [BGW];Fukuoka [FUK];Bulawayo [BUQ];Jeju [CJU];Phu Quoc [PQC];Ras Al Khaimah [RKT];Yangon [RGN];San Juan [SJU];Sonderborg [SGD];Altenrhein [ACH];Manama [BAH];Tampere [TMP];Pardubice [PED];Foggia [FOG];Kochi [COK];Beziers [BZR];Da Nang [DAD];Analalava [HVA];Kigali [KGL];Rijad [RUH];Ikaria Island [JIK];Lakselv [LKL];Newquay [NQY];Horta [HOR];Tirgu Mures [TGM];Moskwa [DME];San Antonio [SAT];Aitutaki [AIT];San Paulo [GRU];Modesto [MOD];Xi An [XIY];Timisoara [TSR];Saint Marteen [SXM];Waszyngton [DCA];Galway [GWY];Narsarsuaq [UAK];Busan [PUS];Esbjerg [EBJ];Kirkenes [KKN];Lazaro Cardenas [LZC];Okinawa [OKA];Windhuk [WDH];Symferopol [SIP];Bangalore [BLR];Oskarshamn [OSK];Ovda [VDA];Lulea [LLA];Ivalo [IVL];Curitiba [CWB];Salalah [SLL];Pekin [NAY];Texarkana [TXK];Nashville [BNA];Angelholm/Helsingborg [AGH];Sacramento [SMF];Changsha [CSX];Roros [RRS];Teheran [IKA];Chongqing [CKG];Snowdrift [YSG];Salt Lake City, UT [SLC];Córdoba [COR];Yogyakarta [JOG];Buenos Aires [EZE];Boa Vista [BVC];Sapporo [SPK];Osijek [OSI];Tadji [TAJ];Anchorage [ANC];Cobija [CIJ];Sandane [SDN];Halifax, NS [YHZ];Chengdu [CTU];Apia [APW];Kalispell, MT [FCA];Tegucigalpa [TGU];Bronnoysund [BNN];Usak [USQ];Kristianstad [KID];Londonderry [LDY];Osaka [UKB];Cali [CLO];Avignon [AVN];Egilsstadir [EGS];Lincoln, NE [LNK];Athens, GA [AHN];Namibe [MSZ];La Gomera [GMZ];Narwik [NVK];Rochester, NY [ROC];Brive-la-Gaillarde [BVE];Heringsdorf [HDF];Liberia [LIR];Cairns [CNS];Belgaum [IXG];Colorado Springs, CO [COS];Port Lions [ORI];Suceava [SCV];Nairobi [WIL];Knock [NOC];Buffalo [BUF];Zacatecas [ZCL];Northampton [ORM];Jekaterynburg [SVX];Pau [PUF];Kampala [KLA];Biratnagar [BIR];Kangerlussuaq [SFJ];Zylina [ILZ];Bardufoss [BDU];Luang Prabang [LPQ];Maroua [MVR];Toronto [YHM];Jackson Hole, WY [JAC];Castries [SLU];Merida [MID];Essaouira [ESU];Livingstone [LVI];Suwa [SUV];Albany [ABY];Ningbo [NGB];Valverde [VDE];Dundee [DND];David [DAV];Charlottetown, Prince Edward Is [YYG];Florence [FLO];Campo Grande [CGR];Coolangatta [OOL];Pune [PNQ];Lampedusa [LMP];Shenzhen [SZX];San Jose [SJC];Xiamen [XMN];Windhuk [ERS];Pekin [BJS];Comox [YQQ];Vaasa [VAA];Ad-Dammam [DMM];Madurai [IXM];Donetsk [DOK];Samarkand [SKD];Penang [PEN];Popondetta [PNP];St Barthelemy [SBH];Abidzan [ABJ];Alaska [DUT];Lycksele [LYC];Farafangana [RVA];Lombok [LOP];Jassy [IAS];Puerto Vallarta [PVR];Wielki Kanion [GCN];Karlovy Vary [KLV];Panama City, FL [PFN];Charlotte Amalie, St Thomas [STT];Townsville [TSV];Waranasi (dawniej Benares) [VNS];Tabarka [TBJ];Hiroszima [HIJ];Kaduna [KAD];Jeddah [JED];Windsor [YQG];Kumasi [KMS];Brazzaville [BZV];Sorong [SOQ];English Bay [KEB];Adler/Soczi [AER];Salvador, Bahia [SSA];Toronto Centre [YTZ];Georgetown [GCM];Burbank [BUR];Makale [MQX];Duszanbe [DYU];Floro [FRO];Sundsvall [SDL];Hue [HUI];Iron Mountain [IMT];Dar Es Salaam [DAR];Nowy Jork [LGA];Terre-de-Haut [LSS];Adiyaman [ADF];Ushuaia [USH];Memphis [MEM];Nikolaev [NLV];Calvi [CLY];Santiago [SCU];Uzhgorod [UDJ];Ponce [PSE];Norfolk Internation [ORF];Jacksonville, FL [JAX];Santa Maria [SMA];Atyrau [GUW];Annaba [AAE];Phitsanulok [PHS];Lafayette, LA [LFT];Porlamar [PMV];Kuching [KCH];Guernsey [GCI];Hamilton [HLZ];Raleigh/Durham, NC [RDU];Nador [NDR];Richmond, VA [RIC];Cap Haitien [CAP];Kuusamo [KAO];Pemba Island [PMA];Lahaur [LHE];Guantanamo [GAO];Isafjordur [IFJ];Las Vegas [BLD];Portsmouth [PME];Wielka Inagua [IGA];Joinville-le-Pont [JOI];Nepalganj [KEP];Venetie [VEE];Lusaka [LUN];Tucurui [TUR];Plovdiv [PDV];Luanda Loanda [LAD];Augusta, GA [AGS];Sucre [SRE];Nis [INI];Columbus Port Columbus I [CMH];Hangzhou [HGH];San Luis Potosi [SLP];St. Georges [GND];Nevsehir [NAV];Graciosa [GRW];Aracaju [AJU];Rumjatar [RUM];Konakry [CKY];Dinard [DNR];Singapur [XSP];Paama [PBJ];Salisbury-Ocean City [SBY];Albany [ALB];Dipolog [DPL];Blackpool [BLK];Covington, KY [CVG];Maintirano [MXT];Santa Marta [SMR];Mandalay [MDL];Brescia Montichiari [VBS];Gamba [GAX];Alamogordo [ALM];Pucallpa [PCL];Hagfors [HFS];Karlstad [KSD];Sarasota, FL [SRQ];Hajdarabad [HYD];Bugulma [UUA];Heihe [HEK];San Pedro Sula [SAP];Santiago [STI];Davao [DVO];Linton-On-Ouse [HRT];Libreville [LBV];Linkoping [LPI];Mayaguez [MAZ];Monterrey [MTY];Krivoy Rog [KWG];Taveuni [TVU];Santa Ana, CA [SNA];Chicago [PWK];Bhaunagar [BHU];Fez [FEZ];Omaha, NE [OMA];Trujillo [TRU];Sittwe [AKY];Londyn [YXU];Ontario [ONT];Windsor Locks, CT [BDL];Nanjing [NKG];Bimini [BIM];Russian M [RSH];Island Lake/garde [YIV];Norrkoping [NRK];Flores Island [FLW];Gloucester [GLO];Santiago Del Estero [SDE];Balimo [OPU];Nizhniy Novgorod [GOJ];Svolvaer [SVJ];Uberlandia [UDI];Triwandrum [TRV];Columbus [GTR];Ambatomainty [AMY];Amderma [AMV];Perpignan [PGF];Tucson [TUS];Maputo [MPM];Laramie [LAR];Wiesbaden [UWE];Ende [ENE];Flores [FRS];Hai Phong [HPH];Albuquerque [ABQ];Urgench [UGC];Brest [BES];Mae Hong Son [HGN];Izhevsk [IJK];Tarawa [TRW];Reno, NV [RNO];Faisalabad [LYP];Jonkoping [JKG];Hodeidah [HOD];St. Petersburg, FL [PIE];Klagenfurt [KLU];Little Cayman [LYB];Stokmarknes [SKN];Limnos [LXS];Erbil International irbil Northwest [EBL];Solo City [SOC];Ottawa airport [XDS];Bangor, ME [BGR];Kalmar [KLR];El Calafate [FTE];Beef Island [EIS];Longana [LOD];Herat [HEA];Gulu [ULU];El Oued [ELU];Saratów [RTW];Yiwu [YIW];Iguazu [IGR];Bradford [BRF];Havasupai [HAE];Terceira Island [TER];Porto Alegre [POA];Milwaukee, WI [MKE];Paramaribo [PBM];Savannah [SAV];Oklahoma City, OK. [OKC];Cayenne [CAY];Corpus Christi, TX [CRP];Shenyang [SHE];Thorshofn [THO];Mariupol [MPW];Fargo [FAR];Florianopolis [FLN];Noumea [NOU];Franca [FRC];Multan [MUX];Pasco, WA [PSC];Rostów nad Donem [ROV];Orange [OAG];Bradford [BFD];Port Vila [VLI];Bario [BBN];Volos [VOL];Manado [MDC];Swansea [SWS];Puerto Escondido [PXM];Jessore [JSR];Alliance [AIA];Lorient [LRT];Maui, HI [OGG];Atlantic City [ACY];Oakland [OAK];Kaitaia [KAT];Malololailai [PTF];Semarang [SRG];Wodospad Wiktorii [VFA];Ciudad Del Este [AGT];Buraidah [ELQ];Kansas City, MO [MKC];El Nido [ENI];New Stuyahok [KNW];Butuan [BXU];Launceston [LST];Chiang Rai [CEI];Gaziantep [GZT];Norway House [YNE];Santa Clara [SNU];Kemi [KEM];Aleppo [ALP];Punta Arenas [PUQ];Espiritu Santo [SON];Trabzon [TZX];Kursk [URS];Tapachula [TAP];Skelleftea [SFT];Yuzhno Sakh [UUS];Badajoz [BJZ];Hyeres [TLN];Ufa [UFA];Khasab [KHS];Shiraz [SYZ];Forde [FDE];Barnaul [BAX];Syktyvkar [SCW];Poitiers [PIS];Kubin Island [KUG];Peshawar [PEW];Vitoria [VIX];Besalampy [BPY];Viedma [VDM];Mosjoen [MJF];La Chorrera [LCR];Worland, WY [WRL];Blantyre [BLZ];Lucknow [LKO];Abu Simbel [ABS];Andahuaylas [ANS];Anadolu University [AOE];Neerlerit Inaat [CNP];Qui Nhon [UIH];Natal [NAT];Port Au Prince [PAP];Annecy [NCY];Kadhdhoo [KDO];Batna [BLJ];Recife [REC];Makhachkala [MCX];Dharamśala [DHM];Saskatoon [YXE];Bacolod [BCD];Burlington [BTV];Ubon Ratchathni [UBP];Midland [MAF];Columbia [COU];Chipata [CIP];Cuiaba [CGB];Katiu [KXU];Omsk [OMS];Charleston, SC [CHS];Charny [XFZ];Clermont-Ferrand [CFE];Ambon [AMQ];Newcastle [NTL];Killeen Gr [GRK];Sao Filipe [SFL];Ulaangom [ULO];Ornskoldsvik [OER];Padang [PDG];Riyan/mukalla [RIY];Quimper [UIP];Culiacan [CUL];Moskwa [VKO];Angers [ANE];Campinas [CPQ];Antsiranana [DIE];Binghamton, NY [BGM];Dien Bien Phu [DIN];Victoria [YWH];Lukla [LUA];San Domino Island [TQR];Ayers Rock [AYQ];Valladolid [VLL];Diyarbakir [DIY];Tiruchirapally [TRZ];Saipan [SPN];Christia [JCH];Sainte Marie [SMS];Monterey [MRY];Des Moines, IA [DSM];Edmonton [YEA];Newburgh [SWF];Hat Yai [HDY];Belem [BEL];Gallivare [GEV];Hancock [CMX];Carlisle [CAX];Antigua [ANU];Franceville [MVB];Kariba [KAB];Tijuana [TIJ];Belo Horizonte [BHZ];Madang [MAG];Chalons Vatry Airport [XCR];Kasos Island [KSJ];Bukhara [BHK];Lynchburg, VA [LYH];Kalkuta [CCU];Los Mochis [LMM];Noto Airport [NTQ];Tete [TET];Mananjary [MNJ];Queretaro [QRO];Chester [CEG];Kearney [EAR];Governors Harbour [GHB];Carrickfinn [CFN];Liepaya [LPX];Arusha [ARK];Tagbilaran [TAG];Pemba [POL];Jayapura [DJJ];Sanandaj [SDG];Marilia [MII];Maupiti [MAU];Catamayo, Loja [LOH];Juliaca [JUL];Krasnojarsk [KJA];Pilot Point, AK [PIP];Milton Keynes [KYN];Sanya [SYX];Blenheim [BHE];Trat [TDX];Munich Neubiberg Ai [MIG];Kuressaare [URE];Kweta [UET];Hamadan [HDM];Zhengzhou [CGO];Orebro [ORB];Gilgit [GIL];Quebec City [YQB];Huntsville, AL [HSV];Sand Point [SDP];Rutland [RUT];St Louis [STL];Moscow Byko [BKA];Wolgograd [VOG];Kittila [KTT];Valparaiso, FL [VPS];Benin City [BNI];Kinshasa N&apos;dji [FIH];Alice Springs [ASP];Toledo, OH [TOL];Bukareszt [BBU];Metz Nancy [ETZ];Hollis [HYL];Sligo [SXL];Manaus [MAO];Victoria, TX [VCT];Alor Setar [AOR];Chabarowsk [KHV];Juba [JUB];Dire Dawa [DIR];Samsun [SZF];Kongolo [KOO];Rapid City [RAP];El Dorado [ELD];Saint Johns [YYT];Kuala Lumpur [SZB];Harbin [HRB];Sfax [SFA];Munda [MUA];Charlottesville [CHO];Rodez [RDZ];Iquitos [IQT];Lanseria [HLA];Ballina [BNK];Dandong [DDG];Beira [BEW];Westerland [GWT];Providence [PVD];Daegu [TAE];Boeing Field [BFI];Franklin [FKL];Gatokae Aerodrom [GTA];Linyi [LYI];Bhairawa [BWA];Belgorod [EGO];Kaohsiung [KHH];Tioman [TOD];Kojambatur [CJB];Iqaluit [YFB];Friday Harbor [FRD];Darwin [DRW];Bangui [BGF];Yakima, WA [YKM];Beckley [BKW];Horn Island [HID];Cape Lisburne [LUR];Baia Mare [BAY];Murmańsk [MMK];Ouango-fitini [OFI];LingLing [LLF];Sao Vicente [VXE];Napier/Hastings [NPE];Qingdao [TAO];Sao Nicolau [SNE];Dunedin [DUD];Wollongong [WOL];Anapa [AAQ];Niigata [KIJ];Birjand [XBJ];Marion, IL [MWA];Akron/canton [CAK];Elazig [EZS];Biloela [ZBL];Berlevag [BVG];LTS Pulau Redang [RDN];Rochester [RST];Ioannina [IOA];Lake Charles [LCH];Appleton [ATW];Klemtu [YKT];Malabo [SSG];Boise, ID [BOI];Kastelorizo [KZS];Fort St John [YXJ];Assiut [ATZ];Harare [HRE];Zamboanga [ZAM];Greenville,S.C. [GSP];Rarotonga [RAR];Chulai [VCL];Gaborone [GBE];Salekhard [SLY];Angmagssalik [AGM];Victoria [YYJ];Formosa [FMA];Hao Island [HOI];Grand Junction [GJT];Camiri [CAM];Chingchuankang [RMQ];Yellowknife [YZF];Fredericton [YFC];Kilwa [KIL];Choibalsan [COQ];Eniseysk [EIE];Leon [LEN];Denizli [DNZ];Zhanjiang [ZHA];Helena [HLN];Sveg [EVG];Hilo [ITO];Bejaia [BJA];Elorza [EOZ];Surabaya [SUB];Tozeur [TOE];Montserrat [MNI];Kota Bharu [KBR];Chandigarh [IXC];Pantelleria [PNL];Syrakuzy [SYR];Margate [MGH];Barra [BRR];Chico [CIC];Moron [MXV];Aswan [ASW];Joensuu [JOE];El Paso [ELP];Nizhnevartovsk [NJC];Brus Laguna [BHG];Khon Kaen [KKC];Bandar Seri Begawan [BWN];Garoua [GOU];Butte, (MT) [BTM];Oujda [OUD];Santa Cruz [SRZ];Watertown [ATY];Kostanay [KSN];Pohang [KPO];Pietropawłowsk Kamczacki [PKC];Malatya [MLX];Salta [SLA];Heho [HEH];Reynosa [REX];Leros [LRS];Varkaus [VRK];Palmerston North [PMR];Kiri [KRZ];Pasto [PSO];Nakhichevan [NAJ];Medford [MFR];Levelock, AK [KLL];Akita [AXT];Veracruz [VER];Dubbo [DBO];Curacao [CUR];Pensacola, FL [PNS];Mangalore [IXE];Idaho Falls [IDA];Kardla [KDL];Sinop [OPS];Santa Fe [SAF];Kelowna, BC [YLW];Montes Claros [MOC];Leinster [LER];Konya [KYA];Newport News, VA [PHF];Nagoja [NGO];Savusavu [SVU];Allentown [ABE];Chartum [KRT];Kralendijk [BON];Dzaoudzi [DZA];Hof [HOQ];Woja [WJA];Vestmann [VEY];Jyvaskyla [JYV];Rio de Janeiro [SDU];Greensboro, NC [GSO];Diu [DIU];Ilheus [IOS];Thandwe [SNW];Playa Baracoa [UPB];Rangiroa [RGI];Socotra [SCT];Salem [SLE];Brunswick, GA [BQK];Preston [PST];Yuma, AR [YUM];Matamoros [MAM];Jaipur [JAI];Villahermosa [VSA];Loikaw [LIW];Śrinagar [SXR];Trollhattan [THN];Pelotas [PET];Tokunoshima [TKN];New Bedford [EWB];Corrientes [CNQ];Stella Maris [SML];Puerto Maldonado [PEM];Roberval [YRJ];Ahmedabad [AMD];St Croix Island [STX];Petropavlovsk [PPK];Phalaborwa [PHW];New Plymouth [NPL];Enugu [ENU];Hassi Me [HME];Columbia [CAE];Oradea [OMR];Basco [BSO];Aurukun Mission [AUU];Zhuhai [ZUH];Datong [DAT];Eldoret [EDL];Waszyngton [BWI];Florencia [FLA];Cotonou [COO];Cold Bay [CDB];Arba Mintch [AMH];Canakkale [CKZ];The Bight [TBI];Bamako [BKO];Fergana [FEG];Iloilo [ILO];Orsk [OSW];Cody/Yellowstone [COD];Nakhon Si Thammarat [NST];Buenos Aires [AEP];Beihai [BHY];Heidelberg [HDB];Bata [BSG];Skien [SKE];Voronezh [VOZ];Osaka [ITM];Tuxtla Gut [TGZ];Kingston [YGK];Waingapu [WGP];Santa Maria, Rs [RIA];Legaspi [LGP];Manhattan, KS [MHK];Millingimbi [MGT];Tulcea [TCE];Magnitogorsk [MQF];Tambov [TBW];Luzon Island Clark [CRK];Turaif [TUI];Taiz [TAI];Roma [RMA];Ekuk [KKU];Valledupar [VUP];Barranquilla [BAQ];Coffs Harbour [CFS];Bocas Del Toro [BOC];Sao Jose Do Rio [SJP];Torres [TOH];Caen [CFR];Tamale [TML];Wenzhou [WNZ];Morondava [MOQ];Maracaibo [MAR];Hatay [HTY];Pointe Noire [PNR];Manta [MEC];Karluk [KYK];Kosrae [KSA];Sandnessjoen [SSJ];Mauke Island [MUK];Georgetown [GEO];Wichita Falls [SPS];Carajas [CKS];Palm Springs, CA [PSP];Lamidanda [LDN];La Macarena [LMC];Ronneby [RNB];Erzurum [ERZ];Rotorua [ROT];Haikou [HAK];Nowosybirsk [OVB];Lokichoggio [LKG];Bethel [BET];Jorhat [JRH];Morgantown, WV [MGW];Kramfors [KRF];Mendoza [MDZ];Raiatea [RFP];Arequipa [AQP];Gabes [GAE];Zia International [DAC];Columbus Afb [CBM];Wanxian [WXN];Amritsar [ATQ];Phenian [FNJ];Tulear [TLE];Imphal [IMF];Constantine [CZL];Leon [BJX];Blagoveschensk [BQS];Begishevo [NBC];Tempelhof [THF];Sioux City [SUX];Lichinga [VXC];Hammerfest [HFT];Argyle [GYL];Penza [PEZ];Wewak [WWK];Limoges [LIG];Sharjah [SHJ];Nukutavake [NUK];Kirovsk [KVK];North Platte [LBF];Ziemia Ruperta [BYH];Truk [TKK];Baton Rouge [BTR];Indaur [IDR];Agartala [IXA];Gethsemani [ZGS];Durango [DRO];Lome [LFW];Skardu [KDU];Tomsk [TOF];Batman [BAL];Hafei [HFE];Ahe Airport [AHE];Westport [WSZ];Elba Island [EBA];Frederikshaab [JFR];Virgin Gorda [VIJ];Skagway [SGY];Meixian [MXZ];Jolo [JOL];Huron [HON];Honningsvag [HVG];Jakuck [YKS];Polyarnyj [PYJ];Sioux Falls [FSD];Charleville [CTL];Gyoumri [LWN];Guiyang [KWE];Fort Collins [FNL];Bikini Atoll [BII];Kandavu [KDV];Magadan [GDX];Guayaramerin [GYA];Al-baha [ABT];Agra [AGR];Nosara Beach [NOB];Beida [LAQ];Calbayog [CYP];San Martin DeLos Andes [CPC];Cam Ranh International Airport [CXR];York Landing [ZAC];Geraldton [GET];Medan [MES];Maskat [MSR];Balmaceda [BBA];Chiclayo [CIX];Hualien [HUN];Sege [EGM];Santa Barbara, CA [SBA];Nampula [APL];Lannion [LAI];San Luis Obispo [SBP];Dayton, Oh [DAY];Don Muang [DMK];Lismore [LSY];Naples [APF];Boa Vista [BVB];Cornwall [YCC];Port Harcourt [PHC];Nagpur [NAG];Cuxhaven/Nordholz [FCN];Altay [AAT];Mora [MXX];Osorno [ZOS];Benbecula [BEB];Medyna [MED];Arad [ARW];Montgomery, AL. [MGM];Ndjamena [NDJ];Billings [BIL];Treasure Cay, Ibaco Islands [TCB];Escanaba [ESC];Tallahassee [TLH];Enkoping [XWQ];Sapporo [CTS];Puerto Suarez [PSZ];Kaadedhdhoo [KDM];Aguascalientes [AGU];Arvidsjaur [AJR];Mar Del Plata [MDQ];Kunming [KMG];Chapeco [XAP];Fernando De N [FEN];Xiangfan [XFN];Wick [WIC];Anjouan [AJN];Igiugig [IGG];Cagayan De Oro [CGY];Maceio [MCZ];Bhamo [BMO];Choiseul Bay [CHY];Moab [CNY];Dangriga [DGA];Trang [TST];Hobart [HBA];Cayo Largo Del Sur [CYO];Knoxville [TYS];Playa Samara [PLD];Freetown [FNA];Pereira [PEI];Aasiaat [JEG];Magadiszu [MGQ];Calama [CJC];West Palm Beach, FL [PBI];Ciudad Bolivar [CBL];Tachilek [THL];Daytona Beach [DAB];Dakar [DSS];Wemindji [YNC];Key West [EYW];Sendai [SDJ];Abakan [ABA];Kupang [KOE];Moroni,Komory [HAH];Funafuti [FUN];Tainan [TNN];Molokai [MKK];Neuquen [NQN];Bergerac [EGC];Rouen [URO];Wilmington [ILM];Czelabińsk [CEK];Kuala Terengganu [TGG];Huntington [HTS];Puerto Madryn [PMY];Red Deer [YQF];Ketchikan, AK [KTN];Seiyun [GXF];Schefferville [YKL];Santa Rosa [STS];North Eleuthera [ELH];Long Beach [LGB];Lakeba [LKB];Tobago [TAB];Niuatoputapu [NTT];Grimsey [GRY];Kithira [KIT];Kwigillingok [KWK];Gafsa [GAF];Tianjin [TSN];Tamatave [TMM];Jacksonville [OAJ];Andenes [ANX];Vopnafjordur [VPN];Udaipur [UDR];Shishmaref [SHH];Tacloban [TAC];Garden City [GCK];Sogndal [SOG];Long Akah [LKH];St.Kitts-Nevis [NEV];Baracoa [BCA];Fresno [FAT];Antofagasta [ANF];Labasa [LBS];Kununurra [KNX];Korla [KRL]").split(';');
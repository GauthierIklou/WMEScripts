// ==UserScript==
// @icon            https://www.lyon-entreprises.com/wp-content/uploads/v2h5or-l-400x400.jpg
// @name            GrandLyon-wme
// @description     This script create buttons to permalink page on several Maps.
// @name:fr         GrandLyon-wme
// @description:fr  Ce script crée des boutons pour vous permettre d'accéder à des cartes externes.
// @version         0.2
// @include         https://www.waze.com/editor*
// @include         https://www.waze.com/*/editor*
// @exclude         https://www.waze.com/user/*editor/*
// @exclude         https://www.waze.com/*/user/*editor/*
// @include          https://beta.waze.com/*
// @include         https://guichet-adresse.ign.fr/map/*
// @grant           none
// @author          GauthierIklou sur une excellente base de Xsvn avec l'aide de Sebiseba
// @require         https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.6.0/proj4-src.js
// ==/UserScript==

var MapsFr_version = "0.2";

if ('undefined' == typeof __RTLM_PAGE_SCOPE_RUN__)
{
    (function page_scope_runner() {

        var my_src = "(" + page_scope_runner.caller.toString() + ")();";

        var script = document.createElement('script');
        script.setAttribute("type", "text/javascript");
        script.textContent = "var __RTLM_PAGE_SCOPE_RUN__ = true;\n" + my_src;

        setTimeout(function() {
            document.body.appendChild(script);
            document.body.removeChild(script);
                 if (/guichet-adresse.ign.fr/.test(window.location.href)) { detect_AdresseIGN(); }
            else if (/radars.securite-routiere.gouv.fr/.test(window.location.href)) { detect_AdresseIGN(); }
            else { add_buttons(); }
        }, 3000);
        return;

    })();
}

function detect_AdresseIGN() {
    var t = window.location.href.split("?");
    var c = JSON.parse(t[1]);
    var coord = ol.proj.transform([c[0], c[1]], "EPSG:4326", "EPSG:3857");
        map.getView().setCenter(coord);
        map.getView().setZoom(c[2]);
}

function getQueryString(link, name)
{
    var pos = link.indexOf( name + '=' ) + name.length + 1;
    var len = link.substr(pos).indexOf('&');
    if (-1 == len) len = link.substr(pos).length;
    return parseFloat(link.substr(pos,len));
}

function get_gps(z) {
    var href = $(".permalink")[0].href;
    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoomLevel')) + z;
    return {
        lon: lon,
        lat: lat,
        zoom: zoom
    };
}

function add_buttons()
{
    // https://www.google.com/maps/@48.85824,2.29451,18z
    var btn1 = $('<button style="background-color: #318ce7; width:94px; height:24px; font-size:70%;"><bold>Google</bold></button>');
    btn1.click(function(){

        var gps = get_gps(0);
        var mapsUrl = 'https://www.google.com/maps/@' + gps.lat + ',' + gps.lon + ',' + gps.zoom + 'z';
        window.open(mapsUrl,'_blank');
    });

    // https://www.geoportail.gouv.fr/carte?c=2.29451,48.85824&z=17&l1=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD::GEOPORTAIL:OGC:WMTS(1)&permalink=yes
    // https://www.geoportail.gouv.fr/carte?c=-1.5546417695565673,47.22908556276508&z=18&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=GEOGRAPHICALGRIDSYSTEMS.MAPS.BDUNI.J1::GEOPORTAIL:OGC:WMTS(1)&l2=GEOGRAPHICALGRIDSYSTEMS.FRANCERASTER::GEOPORTAIL:OGC:WMTS(1;h)&l3=ADMINISTRATIVEUNITS.BOUNDARIES::GEOPORTAIL:OGC:WMTS(1)&permalink=yes
    // https://www.geoportail.gouv.fr/carte?c=3.885928810923497,46.80843814580993&z=17&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=GEOGRAPHICALGRIDSYSTEMS.MAPS.BDUNI.J1::GEOPORTAIL:OGC:WMTS(1)&l2=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&permalink=yes
    var btn2 = $('<button style="background-color:#CEFCB8; width:94px; height:24px; font-size:70%;"><bold>Géoportail</bold></button>');
    btn2.click(function(){

        var gps = get_gps(0);
        var mapsUrl = 'https://www.geoportail.gouv.fr/carte?c=' + gps.lon + ',' + gps.lat + '&z=' + gps.zoom + '&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=GEOGRAPHICALGRIDSYSTEMS.MAPS.BDUNI.J1::GEOPORTAIL:OGC:WMTS(1)&l2=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&permalink=yes';
        window.open(mapsUrl,'_blank');
    });

    // https://adresse.data.gouv.fr/map#18/46.804199/1.392931
    var btn3 = $('<button style="background-color:#E6E4FF; width: 94px;height: 24px;font-size:70%;"><bold>AdresseGouv</bold></button>');
    btn3.click(function(){

        var gps = get_gps(0);
        var mapsUrl = 'https://adresse.data.gouv.fr/map#' + gps.zoom + '/' + gps.lat + '/' + gps.lon;
        window.open(mapsUrl,'_blank');
    });

    // https://data.grandlyon.com/jeux-de-donnees/travaux-engages-metropole-lyon/donnees?map=12.080503207472876/45.72883623618907/5.095540244063386/0/0/4
    var btn4 = $('<button style="background-color:#FF6600; width:140px; height:24px; font-size:70%;"><bold>Travaux engagés</bold></button>');
    btn4.click(function(){

        var gps = get_gps(0);
        var mapsUrl = 'https://data.grandlyon.com/jeux-de-donnees/travaux-engages-metropole-lyon/donnees?map=' + gps.zoom + '/' + gps.lat + '/' + gps.lon + '/0/0/2';
        window.open(mapsUrl,'_blank');
    });

    // https://data.grandlyon.com/jeux-de-donnees/chantiers-perturbants-metropole-lyon/donnees?map=14.676136487735944/45.757962781225984/4.86862868144442/0/0/2
    var btn5 = $('<button style="background-color: #E30613; width: 140px;height: 24px;font-size:70%;"><bold>Chantiers(Onlymoov)</bold></button>');
    btn5.click(function(){

        var gps = get_gps(0);
        var mapsUrl = 'https://data.grandlyon.com/jeux-de-donnees/chantiers-perturbants-metropole-lyon/donnees?map=' + gps.zoom + '/' + gps.lat + '/' + gps.lon + '/0/0/2';
        window.open(mapsUrl,'_blank');
    });

    // https://data.grandlyon.com/jeux-de-donnees/numeros-voirie-metropole-lyon/donnees?map=19.273329592493706/45.775915267408436/4.872663451873905/0/0/2
    var btn6 = $('<button style="background-color: #CC00B4; width: 94px;height: 24px;font-size:70%;">Numérotation</button>');
    btn6.click(function(){

        var gps = get_gps(0);
        var mapsUrl = 'https://data.grandlyon.com/jeux-de-donnees/numeros-voirie-metropole-lyon/donnees?map=' + gps.zoom + '/' + gps.lat + '/' + gps.lon + '/0/0/2';
        window.open(mapsUrl,'_blank');
    });
    //https://data.grandlyon.com/jeux-de-donnees/chaussees-trottoirs-metropole-lyon/donnees?map=10.23550836162622/45.70035770402711/4.850000000000023/0/0/2
    var btn7 = $('<button style="background-color: #B6FF00; width: 94px;height: 24px;font-size:70%;">Infos chaussées</button>');
    btn7.click(function(){

        var gps = get_gps(0);
        var mapsUrl = 'https://data.grandlyon.com/jeux-de-donnees/chaussees-trottoirs-metropole-lyon/donnees?map=' + gps.zoom + '/' + gps.lat + '/' + gps.lon + '/0/0/2';
        window.open(mapsUrl,'_blank');
    });
    //https://data.grandlyon.com/jeux-de-donnees/parkings-metropole-lyon/donnees?map=9.666600449867474/45.734287092104864/4.874000000000024/0/0/2
    var btn8 = $('<button style="background-color: #4F89FF; width: 94px;height: 24px;font-size:70%;">Parkings</button>');
    btn8.click(function(){

        var gps = get_gps(0);
        var mapsUrl = 'https://data.grandlyon.com/jeux-de-donnees/parkings-metropole-lyon/donnees?map=' + gps.zoom + '/' + gps.lat + '/' + gps.lon + '/0/0/2';
        window.open(mapsUrl,'_blank');
    });
    //https://www.inforoute69.fr/
    var btn9 = $('<button style="background-color: #4F89FF; width: 282px;height: 24px;font-size:70%;">InfoRoute69</button>');
    btn9.click(function(){
        var mapsUrl = 'https://www.inforoute69.fr/';
        window.open(mapsUrl,'_blank');
    });
    // https://twitter.com/wazerhone
    var btn10 = $('<button style="background-color: #1FA6FF; width: 282px;height: 24px;font-size:70%;">Twitter</button>');
    btn9.click(function(){
        var mapsUrl = 'https://twitter.com/wazerhone';
        window.open(mapsUrl,'_blank');
    });
    //https://www.facebook.com/
    var btn11 = $('<button style="background-color: #0269E3; width: 282px;height: 24px;font-size:70%;">Facebook</button>');
    btn9.click(function(){
        var mapsUrl = '#';
        window.open(mapsUrl,'_blank');
    });
    //https://groups.google.com/g/waze-grand-lyon
    var btn12 = $('<button style="background-color: #4285F4; width: 282px;height: 24px;font-size:70%;">GoogleGrp</button>');
    btn9.click(function(){
        var mapsUrl = 'https://groups.google.com/g/waze-grand-lyon';
        window.open(mapsUrl,'_blank');
    });
    // add new box to left of the map
    var addon = document.createElement("section");
    addon.id = "GrandLyon-wme";

    addon.innerHTML =
        '<b>GrandLyon-wme ' + MapsFr_version + '</b><br>';

    //alert("Create Tab");
    var userTabs = document.getElementById('user-info');
    var navTabs = document.getElementsByClassName('nav-tabs', userTabs)[0];
    var tabContent = document.getElementsByClassName('tab-content', userTabs)[0];

    var newtab = document.createElement('li');
    newtab.innerHTML = '<a title="Maps France" href="#sidepanel-GrandLyon-wme" data-toggle="tab"><img src="https://www.lyon-entreprises.com/wp-content/uploads/v2h5or-l-400x400.jpg" width="25" height="25"></a>';
    navTabs.appendChild(newtab);

    addon.id = "sidepanel-GrandLyon-wme";
    addon.className = "tab-pane";
    tabContent.appendChild(addon);

    $("#sidepanel-GrandLyon-wme").append('<br>');
    $("#sidepanel-GrandLyon-wme").append('<center>Cartes de France<br></center>');
    $("#sidepanel-GrandLyon-wme").append(btn1);
    $("#sidepanel-GrandLyon-wme").append(btn2);
    $("#sidepanel-GrandLyon-wme").append(btn3);
    $("#sidepanel-GrandLyon-wme").append('<br> <hr> <br>');
    $("#sidepanel-GrandLyon-wme").append('<center>Informations Travaux Métropole <br></center>');
    $("#sidepanel-GrandLyon-wme").append(btn4);
    $("#sidepanel-GrandLyon-wme").append(btn5);
    $("#sidepanel-GrandLyon-wme").append(btn9);
    $("#sidepanel-GrandLyon-wme").append('<br> <hr> <br>');
    $("#sidepanel-GrandLyon-wme").append('<center>Autre <br></center>');
    $("#sidepanel-GrandLyon-wme").append(btn6);
    $("#sidepanel-GrandLyon-wme").append(btn7);
    $("#sidepanel-GrandLyon-wme").append(btn8);
    $("#sidepanel-GrandLyon-wme").append('<br> <hr> <br>');
    $("#sidepanel-GrandLyon-wme").append('<center>Socials <br></center>');
    $("#sidepanel-GrandLyon-wme").append(btn10);
    $("#sidepanel-GrandLyon-wme").append(btn11);
    $("#sidepanel-GrandLyon-wme").append(btn12);
}

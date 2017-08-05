var MapClass = function () {

    var self = this;

    const THUNDERFOREST_API_KEY = "49460fca5628445ab71eaced1c9be786";
    const MAP_THEMES = {
        OpenCycleMap: "cycle",
        Transport: "transport",
        Landscape: "outdoors",
        TransportDark: "transport-dark",
        SpinalMap: "spinal-map",
        Pioneer: "pioneer",
        MobileAtlas: "mobile-atlas",
        Neighbourhood: "neighbourhood"
    };
    const DEFAULT_THEME = MAP_THEMES['Pioneer'];
    const DEFAULT_ZOOM = 5;
    const DEFAULT_STYLE =  {
        'color': '#ffffff',
        "fillColor": '#20ffff',
        "weight": 0.5,
        "radius": -6
    };

    this.map = null;
    this.latitude = 40.5527929;
    this.longitude = -3.63587289;
    this.population = true;
    this.range = true;

    this.init = function(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                self.latitude = position.coords.latitude;
                self.longitude = position.coords.longitude;
            });
        }
    };

    this.buildMap = function (geoData) {
        self.map = L.map("map", {center: [self.latitude, self.longitude], zoom: DEFAULT_ZOOM});
        self.addTileLayer(DEFAULT_THEME);
        self.attachEvents();
        self.addMarkers(geoData);
    };

    this.addTileLayer = function (theme) {
        var newLayer = L.tileLayer("https://{s}.tile.thunderforest.com/" + theme + "/{z}/{x}/{y}.png?apikey=" + THUNDERFOREST_API_KEY, {
            attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Icons made by <a href="https://www.flaticon.com/authors/gregor-cresnar" title="Gregor Cresnar">Gregor Cresnar</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>',
            apikey: THUNDERFOREST_API_KEY,
            maxZoom: 10,
            minZoom: 2
        });

        self.map.addLayer(newLayer);
    };

    this.addMarkers = function(geoData){
        geoData.features.splice(1000);
        L.geoJSON(geoData, {
            pointToLayer: function (feature, latlng) {
                var style = DEFAULT_STYLE;
                style['class'] = "marker_" + feature.properties.adm0_a3;
                style['fillOpacity'] = feature.properties.rank_max / 16;
                if (self.population){
                    style['fillColor'] = self.getPopulationColor(feature.properties.pop_max);
                }
                if (self.range){
                    style['radius'] = self.getRangeRadius(feature.properties.rank_max);
                }
                return L.circleMarker(latlng, style);
            }
        }).bindPopup(function (layer) {
            return self.addTooltip(layer.feature);
        }).addTo(self.map);
    };

    this.getPopulationColor = function(x){
        var color;
        switch (true) {
            case x >= 1 && x < 5000:
                color = "#ff0000";
                break;
            case x >= 5000 && x < 15000:
                color = "#ff00ff";
                break;
            case x >= 15000 && x < 50000:
                color = "#ffff00";
                break;
            case x >= 50000 && x < 100000:
                color = "#20ffff";
                break;
            default:
                color = "#3af04f";
                break;
        }
        return color;
    };

    this.getRangeRadius = function(x){
        var radius;
        switch (true) {
            case x >= 1 && x < 3:
                radius = 2;
                break;
            case x >= 3 && x < 6:
                radius = 4;
                break;
            case x >= 6 && x < 10:
                radius = 8;
                break;
            case x >= 10 && x < 16:
                radius = 12;
                break;
            default:
                radius = 16;
                break;
        }
        return radius;
    };

    this.attachEvents = function () {};

    this.addTooltip = function(feature){
        return "<div class='name'>City Name: " + feature.properties.name + "</div>" +
            "<div class='population'>Population:  " + feature.properties.pop_max + "</div>" +
            "<div class='rank'>Rank: " + feature.properties.rank_max + "</div>";
    };

    this.init();
};

var Map = new MapClass();
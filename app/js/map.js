var MapClass = function () {

    var self = this;

    var MAP_THEMES = {
        OpenCycleMap: "cycle",
        Transport: "transport",
        Landscape: "outdoors",
        TransportDark: "transport-dark",
        SpinalMap: "spinal-map",
        Pioneer: "pioneer",
        MobileAtlas: "mobile-atlas",
        Neighbourhood: "neighbourhood"
    };

    this.default_style = null;
    this.default_zoom = null;
    this.default_theme = null;
    this.thunderforest_api_key = null;
    this.latitude = 0;
    this.longitude = 0;
    this.map = null;
    this.population = false;
    this.range = false;
    this.geoJSONLayer = false;
    this.currentLayer = false;

    this.init = function(){
        self.default_style = Config.default_style;
        self.default_zoom = Config.default_zoom;
        self.default_theme = Config.default_theme;
        self.thunderforest_api_key = Config.thunderforest_api_key;
        self.latitude = Config.latitude;
        self.longitude = Config.longitude;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                self.latitude = position.coords.latitude;
                self.longitude = position.coords.longitude;
            });
        }
    };

    this.buildMap = function (geoData) {
        self.map = L.map("map", {center: [self.latitude, self.longitude], zoom: self.default_zoom});
        self.addTileLayer(self.default_theme);
        self.attachEvents();
        self.addMarkers(geoData);
    };

    this.addTileLayer = function (theme) {
        var themeValue = MAP_THEMES[theme];
        self.currentLayer = L.tileLayer("https://{s}.tile.thunderforest.com/" + themeValue + "/{z}/{x}/{y}.png?apikey=" + self.thunderforest_api_key, {
            attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Icons made by <a href="https://www.flaticon.com/authors/gregor-cresnar" title="Gregor Cresnar">Gregor Cresnar and <a href="http://www.freepik.com" title="Freepik">Freepik</a></a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>',
            apikey: self.thunderforest_api_key,
            maxZoom: 10,
            minZoom: 2
        });
        self.map.addLayer(self.currentLayer);
    };

    this.addMarkers = function(geoData){
        geoData.features.splice(1000);
        self.geoJSONLayer = L.geoJSON(geoData, {
            pointToLayer: function (feature, latlng) {
                var style = self.default_style;
                style['class'] = "marker_" + feature.properties.adm0_a3;
                return L.circleMarker(latlng, style);
            }
        }).bindPopup(function (layer) {
            return self.addTooltip(layer.feature);
        }).addTo(self.map);
    };
    this.setPopulation = function(value){
        self.population = value;
    };
    this.setRange = function(value){
        self.range = value;
    };
    this.choropletMap = function(){
        self.geoJSONLayer.eachLayer(function(featureInstanceLayer) {
            if (typeof featureInstanceLayer.feature != "undefined"){
                var feature = featureInstanceLayer.feature;
                var style = {};
                if (self.population){
                    style['fillColor'] = self.getPopulationColor(feature.properties.pop_max);
                }
                if (self.range){
                    style['fillOpacity'] = feature.properties.rank_max / 16;
                    style['radius'] = self.getRangeRadius(feature.properties.rank_max);
                }
                featureInstanceLayer.setStyle(style);
            }
        });
    };
    this.restyleMap = function(newStyle) {
        self.geoJSONLayer.eachLayer(function(featureInstanceLayer) {
            if (typeof featureInstanceLayer.feature != "undefined"){
                featureInstanceLayer.setStyle(newStyle);
            }
        });
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
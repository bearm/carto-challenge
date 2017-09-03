var MapClass = function (config) {

    var self = this;

    const BLUE = "#5a9ff1";
    const RED = "#fa4472";
    const ORANGE = "#FF8313";
    const GREEN = "#00ff6c";
    const YELLOW = "#ffff00";

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

    this.population = false;
    this.range = false;
    this.default_style = null;
    this.default_zoom = null;
    this.default_theme = null;
    this.thunderforest_api_key = null;
    this.latitude = 0;
    this.longitude = 0;
    this.map = null;
    this.geoJSONLayer = null;
    this.currentLayer = null;
    this.cityList = {};

    this.init = function(config){
        self.default_style = config.default_style;
        self.default_zoom = config.default_zoom;
        self.default_theme = config.default_theme;
        self.thunderforest_api_key = config.thunderforest_api_key;
        self.latitude = config.latitude;
        self.longitude = config.longitude;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                self.latitude = position.coords.latitude;
                self.longitude = position.coords.longitude;
            });
        }
    };

    this.buildMap = function (geoData) {
        if (typeof(L) !== 'undefined' && geoData != null && geoData.features.length > 0 ){
            self.map = L.map("map", {center: [self.latitude, self.longitude], zoom: self.default_zoom});
            self.addTileLayer(self.default_theme);
            self.addMarkers(geoData);
        }else{
            return false;
        }
    };

    this.addTileLayer = function (theme) {
        if (self.currentLayer != null){
            self.map.removeLayer(self.currentLayer)
        }
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
                var className = "marker_" + feature.properties.geonameid;
                style['className'] = className;
                self.cityList[className] = feature.properties.name;
                return L.circleMarker(latlng, style);
            }
        }).bindPopup(function (layer) {
            return self.addTooltip(layer.feature);
        }).addTo(self.map);
    };

    this.restyleMap = function(newStyle) {
        self.geoJSONLayer.eachLayer(function(featureInstanceLayer) {
            if (typeof featureInstanceLayer.feature != "undefined"){
                featureInstanceLayer.setStyle(newStyle);
            }
        });
    };

    this.popUpMarker = function(className) {
        self.geoJSONLayer.eachLayer(function(featureInstanceLayer) {
            var feature = featureInstanceLayer.feature;
            if (("marker_" + feature.properties.geonameid) == className){
                featureInstanceLayer.bindPopup(function (layer) {
                    return self.addTooltip(layer.feature);
                });
                featureInstanceLayer.openPopup();
                self.map.setView([featureInstanceLayer._latlng["lat"], featureInstanceLayer._latlng["lng"]], 10);
            }
        });
    };

    this.addTooltip = function(feature){
        return "<div class='name'>City Name: " + feature.properties.name + "</div>" +
            "<div class='population'>Population:  " + feature.properties.pop_max + "</div>" +
            "<div class='rank'>Rank: " + feature.properties.rank_max + "</div>";
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
                var newStyle = {};
                newStyle['fillOpacity'] = self.default_style['fillOpacity'];
                newStyle['radius'] = self.default_style['radius'];
                newStyle['fillColor'] = self.default_style['fillColor'];

                if (self.population){
                    newStyle['fillColor'] = self.getPopulationColor(feature.properties.pop_max);
                }
                if (self.range){
                    newStyle['fillOpacity'] = feature.properties.rank_max / 16;
                    newStyle['radius'] = self.getRangeRadius(feature.properties.rank_max);
                }
                featureInstanceLayer.setStyle(newStyle);
            }
        });
    };

    this.getPopulationColor = function(x){
        var color;
        switch (true) {
            case x >= 1 && x < 5000:
                color = RED;
                break;
            case x >= 5000 && x < 15000:
                color = BLUE;
                break;
            case x >= 15000 && x < 50000:
                color = GREEN;
                break;
            case x >= 50000 && x < 100000:
                color = YELLOW;
                break;
            default:
                color = ORANGE;
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

    this.easterEgg = function(house){
        if (self.currentLayer != null){
            self.map.removeLayer(self.currentLayer)
        }
        self.currentLayer = L.tileLayer('./app/assets/tiles2/{z}/{x}/{y}.png', {
            maxZoom: 4,
            minZoom: 1
        });
        self.map.addLayer(self.currentLayer);
        self.map.setView([self.latitude, self.longitude], 6);
        L.marker(
            [self.latitude, self.longitude],
            {style: self.default_style}
        ).addTo(self.map)
            .bindPopup("<div class='easterPopup'> <div class='text'> Hello member of the " + (house.charAt(0).toUpperCase() + house.slice(1)) + " House. </div><div class='house " + house + "'</div>")
            .openPopup();
    };

    this.resetToDefaultStyles = function(){
        self.restyleMap(self.default_style);
        self.addTileLayer(self.default_theme);
        self.setPopulation(false);
        self.setRange(false);
    };
    this.getCityList = function(){
        return self.cityList;
    };

    this.init(config);
};


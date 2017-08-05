var ChallengeClass = function () {
    var self = this;

    const REQUEST_URL = 'https://xavijam.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20ne_10m_populated_places_simple&format=GeoJSON';

    this.initialize = function(){
        self.getMapData(self.successCallback);
    };

    this.getMapData = function (successCallback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.addEventListener("load", successCallback);
        httpRequest.addEventListener("error", function(){
            window.location = "/404.html";
        });
        httpRequest.open("GET", REQUEST_URL);
        httpRequest.send(null);
    };

    this.successCallback = function (event) {
        var data = JSON.parse(event.target.responseText);
        Map.buildMap(data);
    };

    /*INTERFACE FUNCTIONS*/
    this.toggleMenu = function () {
        var sandwich = document.getElementById('sandwichLines');
        var controls = document.getElementById('sandwichLines');
        sandwich.classList.toggle('close');
        controls.classList.toggle('collapsed');
    };

    this.showSliderValue = function (slider, value) {
        document.getElementById(slider).innerHTML = value;
    };

    this.initialize();

    return this;
};

var Challenge = new ChallengeClass();
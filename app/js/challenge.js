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
        var controls = document.getElementById('menu');
        sandwich.classList.toggle('close');
        controls.classList.toggle('collapsed');
    };
    this.switchSection = function (section) {
        var activeTab = document.getElementsByClassName("tab active")[0];
        var contentTab = document.getElementsByClassName("tabContent active")[0];

        if (!activeTab.classList.contains(section)) {
            var newActiveTab = document.getElementsByClassName("tab " + section)[0];
            var newContentTab = document.getElementsByClassName("tabContent " + section)[0];

            activeTab.classList.toggle('active');
            contentTab.classList.toggle('active');
            newActiveTab.classList.toggle('active');
            newContentTab.classList.toggle('active');
        }
    };
    this.showValue = function (element, value) {
        document.getElementById(element).innerHTML = value;
    };

    this.initialize();

    return this;
};

var Challenge = new ChallengeClass();
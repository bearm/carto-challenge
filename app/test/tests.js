
describe('Test initialize', function () {
    describe('Config File', function () {
        var config = new ConfigClass()
        it('Config must have a default style defined', function () {
            assert.isNotNull(config.default_style, 'Asserts that config is not null')
        })
        it('Config must have a default theme defined', function () {
            assert.isNotNull(config.default_theme, 'Asserts that config is not null')
        })
        it('Config must have a default zoom defined', function () {
            assert.isNotNull(config.default_zoom, 'Asserts that config is not null')
        })
        it('Config must have a thunderforest_api_key defined', function () {
            assert.isNotNull(config.thunderforest_api_key, 'Asserts that config is not null')
        })
        it('Config must have a latitude defined', function () {
            assert.isNotNull(config.latitude, 'Asserts that config is not null')
        })
        it('Config must have a longitude defined', function () {
            assert.isNotNull(config.longitude, 'Asserts that config is not null')
        })

        var Map = new MapClass();
        it('BuildMap must have leaflet loaded', function () {
            assert.equal(Map.buildMap({}), false)
        })
        it('BuildMap musnt have empty object as geoJson', function () {
            assert.equal(Map.buildMap(null), false)
        })
        it('Set values for Population and Range', function () {
            Map.setPopulation(0);
            assert.equal(Map.population, 0);
            Map.setRange(8);
            assert.equal(Map.range, 8);
        })
        var Challenge = new ChallengeClass();
        it('The dom must have a map element id', function () {
            assert.equal(Challenge.initialize(), false);
            var element = document.createElement('div');
            element.id = "map";
            document.getElementsByTagName("BODY")[0].appendChild(element);
            assert.notEqual(Challenge.initialize(), false);
        })
        it('GetMapData must have a valid url', function () {
            assert.equal(Challenge.getMapData("lala.com"), false);
            var validUrl = 'https://xavijam.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20ne_10m_populated_places_simple&format=GeoJSON';
            assert.notEqual(Challenge.getMapData(validUrl), false);
        })
    })
})

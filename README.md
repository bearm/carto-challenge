# :earth_africa: Frontend CARTO challenge :earth_americas:

## :memo: Problem to solve: 
Create a small application for styling data with the data behind this [SQL](https://xavijam.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20ne_10m_populated_places_simple&format=GeoJSON)(1) and implement a component for styling it on top of the map.
###
The component will let users change as many attributes of a data layer as possible (for example the fill and stroke of the geometries, the size, etc.). The data layer should be refreshed when any change happens.

## :computer: Stack used:

* Vanilla JavaScript.
* [Leaflet.js](http://leafletjs.com/) for render the geoJSON
* [Thunderforest](https://www.thunderforest.com/) for tiles Layer
* [Sass](http://sass-lang.com/)
* [Gulp](https://gulpjs.com/)
* [Karma](https://karma-runner.github.io/1.0/index.html)
* [Mocha](https://mochajs.org/")
* [Chai](http://chaijs.com/)

## :wrench: Build
1. **npm install**
2. **gulp build** (executes the css and js task to generate the bundles)

## :white_check_mark: Tests
Unit testing can be find under the app/tests folder, although the code coverage of unit tests is not even 10% you can see a concept of how to proceed. Here you can find the command to execute them:
**./node_modules/karma/bin/karma start**




## carto-challenge
Solution for the CARTO challenge frontend

## Create a small application for styling data with the data behind this [SQL](https://xavijam.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20ne_10m_populated_places_simple&format=GeoJSON)(1) and **implement a component for styling it on top of the map**.

The component will let users change as many attributes of a data layer as possible (for example the fill and stroke of the geometries, the size, etc.). The data layer should be refreshed when any change happens.

### STACK
- Vanilla JavaScript.
- [Leaflet.js](http://leafletjs.com/) for render the geoJSON
- [Thunderforest](https://www.thunderforest.com/) for tiles Layer
- Sass for the CSS - GULP to compile it
- Karma, mocha, chai for the tests.

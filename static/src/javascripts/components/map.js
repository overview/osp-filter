

var _ = require('lodash');
var React = require('react');
var Fluxxor = require('fluxxor');
var L = require('leaflet');
var markerTpl = require('./marker.jade');

require('leaflet.markercluster');
require('leaflet.heat');


// Set Leaflet image path.
L.Icon.Default.imagePath = '/static/dist/images/leaflet'


module.exports = React.createClass({


  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('institutions')
  ],


  /**
   * Get institutions.
   */
  getStateFromFlux: function() {
    return {
      institutions: this.getFlux().store('institutions').getState()
    };
  },


  /**
   * Render the container.
   */
  render: function() {

    // Show markers when data is hydrated.
    if (this.state.institutions.institutions) {
      this.renderMarkers();
    }

    return <div id="map"></div>;

  },


  /**
   * Start the map.
   */
  componentDidMount: function() {
    this._initLeaflet();
    this._initMarkers();
    this._initHeatmap();
    this._initPub();
    this._initSub();
  },


  /**
   * Initialize the Leaflet instance.
   */
  _initLeaflet: function() {

    var self = this;

    this.map = L.map(this.getDOMNode());
    this.focused = false;

    // Create an OSM tile layer.
    var url = '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    L.tileLayer(url).addTo(this.map);

    // Focus on NYC.
    this.map.setView([40.73, -73.93], 6)

    // Track focus state.
    this.map.on('focus', function() {
      self.focused = true;
    });
    this.map.on('blur', function() {
      self.focused = false;
    });

  },


  /**
   * Initialize the marker cluster group.
   */
  _initMarkers: function() {

    this.markers = new L.MarkerClusterGroup({

      iconCreateFunction: function(cluster) {

        var children = cluster.getAllChildMarkers();

        // Add the counts of all the children.
        count = _.reduce(children, function(s, m) {
          return s + m.options.count;
        }, 0);

        // Form the class.
        var c = 'marker-cluster-';
        if (count < 10) {
          c += 'small';
        } else if (count < 100) {
          c += 'medium';
        } else {
          c += 'large';
        }

        return new L.DivIcon({
          html: '<div><span>'+count+'</span></div>',
          iconSize: new L.Point(40, 40),
          className: 'marker-cluster '+c
        });

      }

    });

    this.map.addLayer(this.markers);

  },


  /**
   * Initialize the heatmap.
   */
  _initHeatmap: function() {

    this.heatmap = L.heatLayer([], {
      minOpacity: 0.15
    });

    this.map.addLayer(this.heatmap);

  },


  /**
   * Publish institution selections.
   */
  _initPub: function() {

    var self = this;

    // When a popup is clicked.
    this.map.on('popupopen', function(e) {
      if (self.focused) {
        var opts = e.popup._source.options;
        self.getFlux().actions.institution.query(opts.iid, opts.name);
      }
    });

  },


  /**
   * Manifest store changes.
   */
  _initSub: function() {

    var self = this;

    this.ranks = this.getFlux().store('ranks');

    // When the institution changes.
    this.ranks.on('change', function() {

      var iid = self.ranks.query.institution;

      // Close on unselect.
      if (!iid) self.map.closePopup();

      // Open on select.
      else if (self.idsToMarkers[iid]) {

        // Pan to marker.
        var latLng = self.idsToMarkers[iid]._latlng
        self.map.setView(latLng, 12);

        // Open bubble.
        self.idsToMarkers[iid].openPopup();

      }

    });

  },


  /**
   * Render the marker clusters.
   */
  renderMarkers: function() {

    var self = this;

    this.idsToMarkers = {};
    var points = [];

    _.each(this.state.institutions.institutions, function(i) {

      if (!i.lat) return;

      // Create the marker.
      var marker = new L.Marker([i.lat, i.lon], {
        iid: i.id,
        name: i.name,
        count: i.count
      });

      // Create the popup.
      var popup = markerTpl({
        url: i.url,
        name: i.name
      });

      // Show the marker.
      self.markers.addLayer(marker);
      marker.bindPopup(popup);

      // Register the heatmap point.
      points.push(new L.latLng(i.lat, i.lon));

      // Map id -> marker.
      self.idsToMarkers[i.id] = marker;

    });

    // Show the heatmap.
    this.heatmap.setLatLngs(points);

  },


});



var _ = require('lodash');
var request = require('superagent');
var Fluxxor = require('fluxxor');


module.exports = Fluxxor.createStore({


  actions: {
    SELECT: 'load'
  },


  /**
   * Initialize results.
   */
  initialize: function() {
    this.results = null;
    this.node = null;
  },


  /**
   * Provide state to components.
   */
  getState: function() {
    return {
      results: this.results,
      node: this.node
    };
  },


  /**
   * Load neighbors.
   *
   * @param {Object}
   */
  load: function(node) {

    var self = this;
    this.node = node;

    // Show spinner.
    this.results = null;
    this.emit('change');

    // Load neighbors.
    this.req = request
      .get('/neighbors')
      .query({ cn: node.get('cn') })
      .end(function(err, res) {

        // Show the new rows.
        self.results = res.body.neighbors;
        self.emit('change');

      });

  }


});

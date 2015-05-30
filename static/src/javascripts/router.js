

var Backbone = require('backbone');


module.exports = Backbone.Router.extend({


  routes: {
    '': 'index'
  },


  /**
   * Set the flux instance.
   *
   * @param {Object} options
   */
  initialize: function(options) {
    this.flux = options.flux;
  },


  /**
   * TODO|dev
   */
  index: function() {
    // TODO
  }


});

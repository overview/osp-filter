

var request = require('superagent');
var Fluxxor = require('fluxxor');


module.exports = Fluxxor.createStore({


  /**
   * Load institutions.
   */
  initialize: function() {

    var self = this;

    this.institutions = null;

    request
    .get('/institutions/load')
    .end(function(err, res) {
      self.institutions = res.body.institutions;
      self.emit('change');
    });

  },


  /**
   * Provide state to components.
   */
  getState: function() {
    return {
      institutions: this.institutions
    };
  },


});

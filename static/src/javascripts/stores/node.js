

var _ = require('lodash');
var $ = require('jquery');
var request = require('superagent');
var Fluxxor = require('fluxxor');


module.exports = Fluxxor.createStore({


  actions: {
    QUERY: 'onQuery'
  },


  /**
   * Initialize results, debounce queries.
   */
  initialize: function() {

    this.results = false;

    // Debounce the query callback.
    this.onQuery = _.debounce(this.onQuery, 200);

  },


  /**
   * Run a search query.
   *
   * @param {String} q - The query string.
   */
  onQuery: function(q) {

    var self = this;

    // Catch duplicates.
    if (q.trim() == this.q) return;

    // Show spinner.
    this.results = false;
    this.emit('change');

    // Cancel an in-flight request.
    if (this.req) {
      this.req.abort();
    }

    // Load results.
    this.req = request
      .get('/search')
      .query({q:q})
      .end(function(err, res) {
        self.results = res.body.hits;
        self.emit('change');
      });

    this.q = q;

  }


});

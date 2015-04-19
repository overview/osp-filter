

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

    this.results = null;
    this.lastQuery = null;

    // Debounce the query callback.
    this.onQuery = _.debounce(this.onQuery, 300);

  },


  /**
   * Run a search query.
   *
   * @param {String} q - The query string.
   */
  onQuery: function(q) {

    var self = this;

    // Catch duplicates.
    if (_.isString(q)) q = q.trim();
    if (this.lastQuery === q) return;

    // Show spinner.
    this.results = null;
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

    this.lastQuery = q;

  }


});

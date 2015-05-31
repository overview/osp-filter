

var request = require('superagent');
var Fluxxor = require('fluxxor');


module.exports = Fluxxor.createStore({


  actions: {
    QUERY_KEYWORDS: 'queryKeywords',
    QUERY_STATE: 'queryState',
    QUERY_INSTITUTION: 'queryInstitution',
    QUERY_METADATA: 'search'
  },


  /**
   * Initialize results.
   */
  initialize: function() {
    this.labels = {};
    this.query = {};
    this.results = null;
    this.rank();
  },


  /**
   * Provide state to components.
   */
  getState: function() {
    return {
      query: this.query,
      results: this.results,
      labels: this.labels
    };
  },


  /**
   * Set a query parameter.
   *
   * @param {String} key
   * @param {Mixed} val
   */
  setParam: function(key, val) {
    if (val) {
      this.query[key] = val;
    } else {
      delete this.query[key];
    }
  },


  /**
   * Set a parameter label.
   *
   * @param {String} key
   * @param {Mixed} val
   */
  setLabel: function(key, val) {
    if (val) {
      this.labels[key] = val;
    } else {
      delete this.labels[key];
    }
  },


  /**
   * Set the keywords query.
   *
   * @param {String} query
   */
  queryKeywords: function(query) {
    this.setParam('keywords', query);
    this.rank();
  },


  /**
   * Set the state query.
   *
   * @param {Object} args
   */
  queryState: function(args) {
    this.setParam('state', args.state);
    this.setLabel('state', args.label);
    this.rank();
  },


  /**
   * Set the institution query.
   *
   * @param {Object} args
   */
  queryInstitution: function(args) {
    this.setParam('institution', args.iid);
    this.setLabel('institution', args.label);
    this.rank();
  },


  /**
   * Pull rankings.
   */
  rank: function() {

    var self = this;

    // Cancel an in-flight request.
    if (this.req) this.req.abort();

    // Show spinner.
    this.results = null;
    this.emit('change');

    this.req = request
    .get('/texts/rank')
    .query(this.query)
    .end(function(err, res) {

      // Show the new rows.
      self.results = res.body;
      self.emit('change');

    });

  },


  /**
   * Search metadata.
   *
   * @param {String} query
   */
  search: function(query) {

    var self = this;

    // Clear filters.
    this.query = {};

    // Cancel an in-flight request.
    if (this.req) this.req.abort();

    // Show spinner.
    this.results = null;
    this.emit('change');

    this.req = request
    .get('/texts/search')
    .query({query: query})
    .end(function(err, res) {

      // Show the new rows.
      self.results = res.body;
      self.emit('change');

    });

  },


});



module.exports = {


  /**
   * When a metadata search is executed.
   *
   * @param {String} query
   */
  query: function(query) {
    this.dispatch('QUERY_METADATA', query);
  }


};

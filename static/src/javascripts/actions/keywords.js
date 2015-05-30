

module.exports = {


  /**
   * When a keywords query is executed.
   *
   * @param {String} query
   */
  query: function(query) {
    this.dispatch('QUERY_KEYWORDS', query);
  }


};

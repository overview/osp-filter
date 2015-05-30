

module.exports = {


  /**
   * When an institution is selected.
   *
   * @param {Number} iid
   * @param {String} label
   */
  query: function(iid, label) {
    this.dispatch('QUERY_INSTITUTION', {
      iid: iid,
      label: label
    });
  }


};

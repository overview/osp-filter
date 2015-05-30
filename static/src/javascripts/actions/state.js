

module.exports = {


  /**
   * When a state is selected.
   *
   * @param {String} state
   * @param {String} label
   */
  query: function(state, label) {
    this.dispatch('QUERY_STATE', {
      state: state,
      label: label
    });
  }


};

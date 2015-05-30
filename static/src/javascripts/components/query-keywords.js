

var _ = require('lodash');
var React = require('react/addons');
var Fluxxor = require('fluxxor');
var classNames = require('classnames');


module.exports = React.createClass({


  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('ranks'),
    React.addons.LinkedStateMixin
  ],


  /**
   * Get search state.
   */
  getStateFromFlux: function() {

    var ranks = this.getFlux().store('ranks').getState();

    return {
      query: ranks.query.keywords
    };

  },


  /**
   * Render the keywords search box.
   */
  render: function() {

    var iconCx = classNames({
      'fa': true,
      'fa-fw': true,
      'fa-search': true
    });

    return (
      <div id="filter-keywords" className="input-group filter">

        <input
          className="search form-control"
          type="text"
          placeholder="Filter by keywords in syllabi"
          valueLink={this.linkState('query')}
          onKeyPress={this.onKeyPress}
          onKeyUp={this.onKeyUp}
        />

        <span className="input-group-btn">
          <button className="btn btn-default" onClick={this.query}>
            Search
          </button>
        </span>

      </div>
    );

  },


  /**
   * Search when "Enter" is pressed.
   */
  onKeyPress: function(event) {
    if (event.key == 'Enter') {
      this.query()
    }
  },


  /**
   * Search when the input is cleared.
   */
  onKeyUp: function() {
    if (_.isEmpty(this.state.query)) {
      this.query();
    }
  },


  /**
   * Run the current query.
   */
  query: function() {
    this.getFlux().actions.keywords.query(this.state.query);
  }


});

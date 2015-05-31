

var _ = require('lodash');
var React = require('react/addons');
var Fluxxor = require('fluxxor');
var classNames = require('classnames');


module.exports = React.createClass({


  mixins: [
    Fluxxor.FluxMixin(React),
    React.addons.LinkedStateMixin
  ],


  /**
   * By default, empty query.
   */
  getInitialState: function() {
    return {
      query: null
    };
  },


  /**
   * Render the metadata search box.
   */
  render: function() {

    var iconCx = classNames({
      'fa': true,
      'fa-fw': true,
      'fa-search': true
    });

    return (
      <div id="search" className="input-group filter">

        <input
          className="search form-control"
          type="text"
          placeholder="Search texts"
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
    this.getFlux().actions.search.query(this.state.query);
  }


});

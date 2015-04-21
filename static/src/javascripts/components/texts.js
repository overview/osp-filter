

var classNames = require('classnames');
var React = require('react');
var Fluxxor = require('fluxxor');
var NeighborList = require('./neighbor-list');
var SearchBox = require('./search-box');
var SearchList = require('./search-list');


module.exports = React.createClass({


  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('SelectionStore'),
  ],


  /**
   * Get selection state.
   */
  getStateFromFlux: function() {
    return {
      selection: this.getFlux().store('SelectionStore').getData()
    };
  },


  /**
   * Render the top-level structure.
   */
  render: function() {

    var list = this.state.selection.selected ?
      <NeighborList /> :
      <SearchList />;

    return (
      <div id="texts">
        <SearchBox />
        {list}
      </div>
    );

  }


});

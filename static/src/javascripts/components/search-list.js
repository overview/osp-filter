

var _ = require('lodash');
var React = require('react/addons');
var Fluxxor = require('fluxxor');
var SearchRow = require('./search-row');


module.exports = React.createClass({


  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('SearchStore'),
  ],


  /**
   * Get the search results.
   */
  getStateFromFlux: function() {

    var search = this.getFlux().store('SearchStore');

    return {
      active: search.active,
      results: search.results
    };

  },


  /**
   * Render search results.
   */
  render: function() {

    // Show nothing on startup.
    if (_.isNull(this.state.results)) {
      return null;
    }

    var total = Number(this.state.results.total);

    // No results.
    if (total === 0) {
      return <i className="fa fa-ban"></i>;
    }

    else {

      // Build up the list of result rows.
      var rows = _.map(this.state.results.hits, function(h) {
        return <SearchRow hit={h} key={h._id} />;
      });

      var listCx = React.addons.classSet({
        'active': this.state.active
      });

      var tableCx = React.addons.classSet({
        'table': true,
        'table-condensed': true
      });

      return (
        <div id="search-list" className={listCx}>
          <table className={tableCx}>
            <thead>
              <th>Degree</th>
              <th>Text</th>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      );

    }

  }


});

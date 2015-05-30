

var $ = require('jquery');
var request = require('superagent');
var React = require('react');
var Fluxxor = require('fluxxor');
require('selectize');


module.exports = React.createClass({


  mixins: [Fluxxor.FluxMixin(React)],


  /**
   * Render the institutions dropdown.
   */
  render: function() {
    return (
      <select
        id="filter-institution"
        placeholder="Filter by institution"
        className="filter">
      </select>
    );
  },


  /**
   * Wrap the select, listen for selections.
   */
  componentDidMount: function() {
    this._initSelectize();
    this._initPub();
    this._initSub();
  },


  /**
   * Initialize Selectize.
   */
  _initSelectize: function() {

    this.el = React.findDOMNode(this);

    $(this.el).selectize({

      valueField: 'id',
      searchField: ['name', 'city'],
      labelField: 'name',
      preload: true,

      // Query for institutions.
      load: function(q, cb) {

        var self = this;

        request
        .get('/institutions/search')
        .query({q:q})
        .end(function(err, res) {

          // Clear old results.
          self.clearOptions();
          self.refreshOptions();

          // Render new results.
          cb(res.body.institutions);
          self.setCaret(0);

        });

      },

      // Sort by count.
      score: function() {
        return function(item) {
          return Number(item.count);
        };
      },

      // Format the results.
      render: {
        option: function(item) {
          return React.renderToString(
            <div className="institution">

              <div className="name">
                <i className="fa fa-university"></i>{' '}
                {item.name}
              </div>

              <span className="location">
                {item.city}, {item.state}
              </span>

              {' '}&bull;{' '}

              <span className="count">
                {Number(item.count).toLocaleString()}
              </span>

              {' '}

              syllabi

            </div>
          );
        }
      }

    });

  },


  /**
   * Publish selections.
   */
  _initPub: function() {

    var self = this;

    // Institution selected.
    this.el.selectize.on('item_add', function(val, item) {
      var label = $(item).text();
      self.getFlux().actions.institution.query(val, label);
    });

    // Institution cleared.
    this.el.selectize.on('item_remove', function() {
      self.getFlux().actions.institution.query();
    });

  },


  /**
   * Manifest store changes.
   */
  _initSub: function() {

    var self = this;

    this.ranks = this.getFlux().store('ranks');

    // Manifest new values.
    this.ranks.on('change', function() {

      var oldVal = self.el.selectize.getValue();
      var newVal = self.ranks.query.institution;

      if (newVal != oldVal) {
        self.el.selectize.setValue(newVal, true);
      }

    });

  }


});

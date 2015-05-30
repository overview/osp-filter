

var $ = require('jquery');
var React = require('react');
var Fluxxor = require('fluxxor');
require('selectize');


module.exports = React.createClass({


  mixins: [Fluxxor.FluxMixin(React)],


  /**
   * Render the state dropdown.
   */
  render: function() {
    return (
      <select
        id="filter-state"
        placeholder="Filter by state"
        className="filter">

        <option value=""></option>
        <option value="AL">Alabama</option>
        <option value="AK">Alaska</option>
        <option value="AZ">Arizona</option>
        <option value="AR">Arkansas</option>
        <option value="CA">California</option>
        <option value="CO">Colorado</option>
        <option value="CT">Connecticut</option>
        <option value="DE">Delaware</option>
        <option value="DC">District of Columbia</option>
        <option value="FL">Florida</option>
        <option value="GA">Georgia</option>
        <option value="HI">Hawaii</option>
        <option value="ID">Idaho</option>
        <option value="IL">Illinois</option>
        <option value="IN">Indiana</option>
        <option value="IA">Iowa</option>
        <option value="KS">Kansas</option>
        <option value="KY">Kentucky</option>
        <option value="LA">Louisiana</option>
        <option value="ME">Maine</option>
        <option value="MD">Maryland</option>
        <option value="MA">Massachusetts</option>
        <option value="MI">Michigan</option>
        <option value="MN">Minnesota</option>
        <option value="MS">Mississippi</option>
        <option value="MO">Missouri</option>
        <option value="MT">Montana</option>
        <option value="NE">Nebraska</option>
        <option value="NV">Nevada</option>
        <option value="NH">New Hampshire</option>
        <option value="NJ">New Jersey</option>
        <option value="NM">New Mexico</option>
        <option value="NY">New York</option>
        <option value="NC">North Carolina</option>
        <option value="ND">North Dakota</option>
        <option value="OH">Ohio</option>
        <option value="OK">Oklahoma</option>
        <option value="OR">Oregon</option>
        <option value="PA">Pennsylvania</option>
        <option value="RI">Rhode Island</option>
        <option value="SC">South Carolina</option>
        <option value="SD">South Dakota</option>
        <option value="TN">Tennessee</option>
        <option value="TX">Texas</option>
        <option value="UT">Utah</option>
        <option value="VT">Vermont</option>
        <option value="VA">Virginia</option>
        <option value="WA">Washington</option>
        <option value="WV">West Virginia</option>
        <option value="WI">Wisconsin</option>
        <option value="WY">Wyoming</option>

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

      // Add icons.
      render: {
        option: function(item) {

          var iconCx = 'stateface stateface-'+item.value.toLowerCase();

          return React.renderToString(
            <div className="state">
              <span className={iconCx}></span>
              {item.text}
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

    // State selected.
    this.el.selectize.on('item_add', function(val, item) {
      var label = $(item).text();
      self.getFlux().actions.state.query(val, label);
    });

    // State cleared.
    this.el.selectize.on('item_remove', function() {
      self.getFlux().actions.state.query();
    });

  },


  /**
   * Manifest store changes.
   */
  _initSub: function() {

    var self = this;

    this.ranks = this.getFlux().store('ranks');

    // Manifest new `state` values.
    this.ranks.on('change', function() {

      var newVal = self.ranks.query.state;
      var oldVal = self.el.selectize.getValue();

      if (newVal != oldVal) {
        self.el.selectize.setValue(newVal, true);
      }

    });

  }


});

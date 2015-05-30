

var React = require('react');
var Fluxxor = require('fluxxor');


module.exports = React.createClass({


  mixins: [Fluxxor.FluxMixin(React)],


  /**
   * Render params.
   */
  render: function() {
    return (
      <button
        className="btn btn-default"
        onClick={this.props.close}>

        <i className="fa fa-times-circle"></i>{' '}
        <span className="key">{this.props.label}:</span>{' '}
        {this.props.value}

      </button>
    );
  }


});

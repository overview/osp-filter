

var React = require('react');
var Fluxxor = require('fluxxor');

var TextPG = require('../models/text-pg');


module.exports = React.createClass({


  mixins: [Fluxxor.FluxMixin(React)],


  /**
   * Wrap the incoming text.
   */
  componentWillMount: function() {
    this.setState({
      text: new TextPG(this.props.text)
    });
  },


  /**
   * Render a rank result row.
   */
  render: function() {

    var scoreStyle = {
      color: this.state.text.getColor()
    };

    return (
      <tr>

        <td className="rank">
          {this.state.text.formatInt('rank')}
        </td>

        <td className="count">
          {this.state.text.formatInt('f_count')}
        </td>

        <td className="score" style={scoreStyle}>
          {this.state.text.formatScore()}
        </td>

        <td className="text">

          <div className="title">
            {this.state.text.get('title')}
          </div>

          <div className="author">
            {this.state.text.get('author')}
          </div>

        </td>

      </tr>
    );

  }


});

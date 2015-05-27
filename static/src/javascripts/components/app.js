

var React = require('react');
var Fluxxor = require('fluxxor');

var RankList = require('./rank-list');
var QueryKeywords = require('./query-keywords');
var QueryInst = require('./query-inst');
var QueryState = require('./query-state');
var ParamList = require('./param-list');


module.exports = React.createClass({


  mixins: [Fluxxor.FluxMixin(React)],


  /**
   * Render the application.
   */
  render: function() {
    return (
      <div className="container">
        <div className="row">

          <div id="filters" className="col-md-5">

            <div className="media page-header">

              <div className="media-left">
                <img src="/static/src/images/osp.jpg" />
              </div>

              <div className="media-body">
                <h2 className="media-heading">Open Syllabus Project</h2>
                <small>Harvard Library Open Metadata</small>
              </div>

            </div>

            <QueryKeywords />
            <QueryState />
            <QueryInst />

          </div>

          <div id="texts" className="col-md-7">
            <ParamList />
            <RankList />
          </div>

        </div>
      </div>
    );
  }


});

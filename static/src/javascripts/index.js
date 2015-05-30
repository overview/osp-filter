

var $ = require('jquery');
var Backbone = require('backbone');
var React = require('react');
var Fluxxor = require('fluxxor');
Backbone.$ = $;

var App = require('./components/app');
var Router = require('./router');


var flux = module.exports = new Fluxxor.Flux(
  require('./stores'),
  require('./actions')
);


React.render(
  <App flux={flux} />,
  document.getElementById('search')
);


new Router({ flux: flux });
Backbone.history.start();

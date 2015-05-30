

var Backbone = require('backbone');
var chroma = require('chroma-js');
var config = require('../config');


module.exports = Backbone.Model.extend({


  /**
   * Compute the text's teaching score.
   *
   * @returns {Number}
   */
  getScore: function() {
    var count = this.get('t_count');
    return (Math.log(count)/Math.log(config.maxCount)) * 10;
  },


  /**
   * Get the score color.
   *
   * @returns {String}
   */
  getColor: function() {
    var scale = chroma.scale(['#F04124', '#43ac6a']).mode('lab');
    return scale(this.getScore()/10).hex()
  },


  /**
   * Format an integer field for display.
   *
   * @param {String} key
   * @returns {String}
   */
  formatInt: function(key) {
    return Number(this.get(key)).toLocaleString();
  },


  /**
   * Format the teaching score.
   *
   * @returns {String}
   */
  formatScore: function() {
    return this.getScore().toFixed(2);
  }


});

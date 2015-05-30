

module.exports = {

  options: {
    paths: 'node_modules',
    sourceMap: true,
    sourceMapURL: 'style.css.map',
    outputSourceFiles: true
  },

  dist: {
    src: '<%= src %>/stylesheets/index.less',
    dest: '<%= dest %>/style.css'
  }

}

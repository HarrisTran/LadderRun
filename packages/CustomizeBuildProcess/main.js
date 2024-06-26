
function onBeforeBuildFinish(options, callback) {
  Editor.log('Building ' + options.platform + ' to ' + options.dest); // you can display a log in the Console panel

  Editor.log('what the fuck!')            // save main.js

  callback();
}


module.exports = {
  load () {
    Editor.Builder.on('before-change-files', onBeforeBuildFinish);
  },

  unload () {
    Editor.Builder.on('before-change-files', onBeforeBuildFinish);
  },
};

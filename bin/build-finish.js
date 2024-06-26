module.exports = function (options) {
  const ejs = require('ejs');
  const fs = require('fs');
  const path = require('path');
  const remoteBundleList = options.bundles.filter(bundle => bundle.name == 'Alien' || bundle.name == 'Sweet' || bundle.name == 'Castle' || bundle.name == 'Pyramid' || bundle.name == 'Zombie')
  for(let folder of remoteBundleList.map(bundle => bundle.scriptDest)){
    Editor.log(folder)
    try {
      fs.unlinkSync(folder);
    } catch (e) {
      Editor.error(e)
    }
  }
  // const htmlPath = path.resolve(options.project, 'build/web-mobile/index.html')
  // const tpl = fs.readFileSync(htmlPath).toString()
  // const result = ejs.render(tpl, {
  //   project: options.title,
  //   orientation: options.webOrientation,
  //   webDebugger: ''
  // });
  // fs.writeFileSync(path.resolve(options.dest, 'index.html'), result);
  Editor.log(`Xây dựng kết thúc rồi, làm gì tiếp theo nhỉ ?`);
}
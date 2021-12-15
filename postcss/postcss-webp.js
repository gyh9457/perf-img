const postcss = require('postcss');

const backgroundReg = /^background(-image)?$/;
const wrapperClass = 'webp';
const ImageReg = /\.(gif|png|jpe?g)/;
const StaticImageReg = /(\.png|\.jpe?g)/;

module.exports = postcss.plugin('postcss-reverse-props', (options = {}) => {
  return (root) => {
    root.walkRules((rule) => {
      if (rule.selector.indexOf(`.${wrapperClass}`) !== -1) {
        return;
      }
      const backgroundImage = rule.nodes.filter(
        (el) => el.type === 'decl' && el.prop.match(backgroundReg),
      );
      if (backgroundImage && backgroundImage.length) {
        rule.walkDecls(backgroundReg, (decl) => {
          const hasUrl = decl.value.match(/url\((.*)?\)/);
          if (hasUrl) {
            const imageUrl = hasUrl[1].replace(/'|"/gi, '');
            if (
              imageUrl.indexOf('.webp') !== -1 ||
              imageUrl.startsWith('data:image')
            ) {
              return;
            }
            const webpImageUrl = imageUrl.replace(ImageReg, '.webp');
            const webpRule = postcss.rule({
              selector: `:global(.${wrapperClass}) ${rule.selector}`,
            });
            webpRule.append({
              prop: 'background-image',
              value: `url(${webpImageUrl})`,
              important: decl.important,
            });
            rule.parent.append(webpRule);
            decl.value = decl.value.replace(StaticImageReg, '-m$1');
          }
        });
      }
    });
  };
});

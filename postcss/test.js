const postcss = require('postcss');
const less = require('less');
const fs = require('fs');
const syntax = require('postcss-less');
const webp = require('./postcss-webp');

(async function test() {
  try {
    const text = await fs.readFileSync('./index.less');
    const lessText = await postcss().process(text, { syntax, from: undefined });
    const { css } = await less.render(lessText.css);
    postcss([webp])
      .process(css, {
        from: './index.css',
      })
      .then((result) => {
        console.log(result.content);
      });
  } catch (error) {
    console.log(error);
  }
})();

const { readFile, writeFile } = require('fs/promises');
const { existsSync } = require('fs');
const globby = require('globby');
const imageminWebp = require('imagemin-webp');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGif2webp = require('imagemin-gif2webp');
const { getExtension, print } = require('./util');

async function handleFile(sourcePath) {
  const webpFileName = sourcePath.replace(/\.\w+/, '.webp');
  const minFileName = sourcePath.replace(/(\.\w+)/, '-m$1');
  const webpFileExist = existsSync(webpFileName);
  const minFileExist = existsSync(minFileName);
  const ext = getExtension(sourcePath);
  const info = {
    origin: sourcePath,
    webp: webpFileName,
    min: {
      file: minFileName,
      generate: ext !== 'gif', // gif 不生成原图压缩
    },
  };
  let data;
  if (!webpFileExist || !minFileExist) {
    data = await readFile(sourcePath);
  }
  if (!webpFileExist) {
    if (ext === 'git') {
      const gifData = await imageminGif2webp({
        quality: 85,
      })(data);
      await writeFile(webpFileName, gifData);
    } else {
      const webpData = await imageminWebp({
        quality: 85,
      })(data);
      await writeFile(webpFileName, webpData);
    }
  }
  if (!minFileExist) {
    if (ext === 'png') {
      const pngData = await imageminPngquant({
        quality: [0.65, 0.8],
      })(data);
      await writeFile(minFileName, pngData);
    } else if (ext !== 'gif') {
      const jpgData = await imageminMozjpeg({
        quality: 70,
      })(data);
      await writeFile(minFileName, jpgData);
    }
  }
  print(info);
}

async function task(input) {
  const filePaths = await globby(input, {
    onlyFiles: true,
  });
  return Promise.all(
    filePaths
      .filter((filePath) => !/-m\.\w+$/.test(filePath))
      .map(async (filePath) => {
        try {
          await handleFile(filePath);
        } catch (error) {
          console.log(filePath);
          console.log(error);
        }
      }),
  );
}

(async () => {
  await task(`src/**/*.{jpg,jpeg,png,gif}`);
  console.log('generate all webp and min files success');
})();

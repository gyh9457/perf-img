const { unlink } = require('fs/promises');
const globby = require('globby');

async function task(input) {
  const filePaths = await globby(input, {
    onlyFiles: true,
  });
  return Promise.all(
    filePaths.map(async (filePath) => {
      await unlink(filePath);
      console.log(`remove file`, filePath);
    }),
  );
}

(async () => {
  await task(['src/**/*.webp', 'src/**/*-m.{jpg,jpeg,png}']);
  console.log('remove all webp and min files success');
})();

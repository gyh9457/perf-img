const { statSync } = require('fs');

function formatSize(size) {
  return `${(size / 1024).toFixed(2)} KiB`;
}

function offPercent(size, minSize) {
  if (minSize >= size) {
    return '0% off';
  }
  return `${Math.round((1 - minSize / size) * 100).toFixed(0)}% off`;
}

function getExtension(file) {
  const arr = file.split('.');
  return arr[arr.length - 1].toLowerCase();
}

// 记录节省的字节数
let originSize = 0;
let webpSize = 0;
let minSize = 0;

function print({ origin, webp, min }) {
  const size = {
    origin: statSync(origin).size,
    webp: statSync(webp).size,
  };
  size.min = min.generate ? statSync(min.file).size : size.origin;
  console.log(
    origin,
    formatSize(size.origin),
    ', webp',
    formatSize(size.webp),
    offPercent(size.origin, size.webp),
    ', min',
    formatSize(size.min),
    offPercent(size.origin, size.min),
  );

  originSize += size.origin;
  webpSize += size.webp;
  minSize += size.min;
}

function printAll() {
  console.log(
    `total origin image size`,
    formatSize(originSize),
    ', webp',
    formatSize(webpSize),
    offPercent(originSize, webpSize),
    ', min',
    formatSize(minSize),
    offPercent(originSize, minSize),
  );
}

module.exports = {
  getExtension,
  print,
  printAll,
};

// @ts-nocheck
const isSupportWebp = function () {
  try {
    return (
      document
        .createElement('canvas')
        .toDataURL('image/webp', 0.5)
        .indexOf('data:image/webp') === 0
    );
  } catch (err) {
    return false;
  }
};

export const useWebp = isSupportWebp();

/**
 *
 * @param {*} src 图片资源路径，必须使用绝对路径 例如 @/asset/img/a.png
 * @returns img module
 */
export function importImg(src) {
  const srcArr = src.split('/');
  const suffix = srcArr.pop();
  const isGif = /\.gif$/.test(suffix); // gif 不压缩
  const name = `${suffix.replace(/\.\w+$/, '')}${useWebp || isGif ? '' : '-m'}`;
  const pathArr = `${srcArr.join('/')}`.split('/');

  const importImage = (r) => {
    const matchKey = r.keys().filter((key) => {
      const arr = key
        .replace(/\.\//, '')
        .replace(/\.\w+$/, '')
        .split('/');
      const itemName = arr.pop();
      const srcPath = pathArr.slice(pathArr.length - arr.length).join('/');
      const itemPath = arr.join('/');
      if (itemName === name && srcPath === itemPath) {
        return true;
      }
      return false;
    })[0];
    // matchKey 是相对于 src 的相对路径
    return r(matchKey);
  };

  const getContext = () => {
    if (useWebp) {
      return require.context('/src', true, new RegExp('\\.webp$'));
    } else if (isGif) {
      return require.context('/src', true, new RegExp('\\.gif$'));
    } else {
      return require.context('/src', true, new RegExp('-[m]{1}\\.\\w+$'));
    }
  };

  const image = importImage(getContext());
  return image;
}

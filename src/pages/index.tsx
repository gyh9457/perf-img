import style from './index.less';
import Image from '@/component/Image';
import { useWebp } from '@/util/img';

const ImgOne = '@/asset/one.png';
const ImgMoon = '@/asset/moon.jpeg';
const LoadingGif = '@/asset/loading.gif';

export default function IndexPage() {
  return (
    // 最外层容器添加是否支持 webp 样式
    <div className={`${useWebp ? 'webp' : ''}`}>
      <div className={style.box}>
        <Image src={ImgOne} />
        <Image src={ImgMoon} />
        <Image src={LoadingGif} />
      </div>
    </div>
  );
}

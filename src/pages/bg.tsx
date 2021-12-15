// 构建前优化，支持 css demo
import { useEffect } from 'react';
import style from './index.less';

function Bg() {
  useEffect(() => {
    const root = document.getElementById('root');
    root!.classList.add('webp');
  }, []);
  return (
    <div>
      <div className={style.one}></div>
    </div>
  );
}

export default Bg;

// @ts-nocheck
import React from 'react';
import { importImg } from '@/util/img';

function Image({ src }: { src: string }) {
  return <img src={importImg(src)} />;
}

export default Image;

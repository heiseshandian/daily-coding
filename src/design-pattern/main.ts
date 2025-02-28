import { iframeFactory } from './flyweight';
document.addEventListener('DOMContentLoaded', () => {
  const iframe1 = iframeFactory.create();
  iframe1.src = 'http://baidu.com';

  const iframe2 = iframeFactory.create();
  iframe1.src = 'http://QQ.com';

  setTimeout(() => {
    const iframe3 = iframeFactory.create();
    iframe3.src = 'http://163.com';
  }, 3000);
});

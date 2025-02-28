import { ref, effect } from './reactivity';
import { VNode, renderer } from './renderer';
const bol = ref(false);

effect(() => {
  const vnode: VNode = {
    type: 'div',
    props: bol.value
      ? {
          onClick: () => {
            alert('parent clicked');
          },
        }
      : {},
    children: [
      {
        type: 'p',
        props: {
          onClick: () => {
            bol.value = true;
          },
        },
        children: 'text',
      },
    ],
  };

  renderer.render(vnode, document.getElementById('app')!);
});

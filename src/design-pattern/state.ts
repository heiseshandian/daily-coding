/* 
允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。

我们以逗号分割，把这句话分为两部分来看。第一部分的意思是将状态封装成独立的类，
并将请求委托给当前的状态对象，当对象的内部状态改变时，会带来不同的行为变化。
电灯的例子足以说明这一点，在off和on这两种不同的状态下，我们点击同一个按钮，
得到的行为反馈是截然不同的。

第二部分是从客户的角度来看，我们使用的对象，在不同的状态下具有截然不同的行为，
这个对象看起来是从不同的类中实例化而来的，实际上这是使用了委托的效果。
*/
export function loadUploadPlugin() {
  const plugin = document.createElement('embed');
  plugin.style.display = 'none';
  plugin.type = 'application/txftn-webkit';

  Object.assign(plugin, {
    sign() {
      console.log('开始文件扫描');
    },
    pause() {
      console.log('暂停文件上传');
    },
    uploading() {
      console.log('文件上传中');
    },
    del() {
      console.log('删除文件');
    },
    done() {
      console.log('文件上传完成');
    },
  });

  document.body.appendChild(plugin);
  return plugin;
}

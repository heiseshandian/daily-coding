/* 
一些值得注意的地方

1) 组合模式不是父子关系
组合模式是一种HAS-A关系而不是IS-A关系。组合对象包含一组叶子对象，但是叶子对象并不是组合对象的
子类。组合对象把请求委托给所有叶子对象，它们能够合作的关键在于拥有相同的接口。

2）对叶对象操作的一致性
组合模式除了要求组合对象和叶对象拥有相同的接口之外，还有一个必要条件，
就是对一组叶对象的操作必须具有一致性。

比如公司要给全体员工发放元旦的过节费1000块，这个场景可以运用组合模式，
但如果公司给今天过生日的员工发送一封生日祝福的邮件，组合模式在这里就没有用武之地了，
除非先把今天过生日的员工挑选出来。只有用一致的方式对待列表中的每个叶对象的时候，
才适合使用组合模式。

3）双向映射关系
发放过节费的通知步骤是从公司到各个部门，再到各个小组，最后到每个员工的邮箱里。
这本身是一个组合模式的好例子，但要考虑的一种情况是，也许某些员工属于多个组织架构。
比如某位架构师既隶属于开发组，又隶属于架构组，对象之间的关系并不是严格意义上的层次结构，
在这种情况下，是不适合使用组合模式的，该架构师很可能会收到两份过节费。

这种复合情况下我们必须给父节点和子节点建立双向映射关系，
一个简单的方法是给小组和员工对象都增加集合来保存对方的引用。
但是这种相互间的引用相当复杂，而且对象之间产生了过多的耦合性，
修改或者删除一个对象都变得困难，此时我们可以引入中介者模式来管理这些对象。
*/
interface Composable {
  execute: () => void;
}

const openAirCommand: Composable = {
  execute() {
    console.log('open air conditioner');
  },
};

const playMusicCommand: Composable = {
  execute() {
    console.log('play music');
  },
};

export class MacroCommand implements Composable {
  commands: Composable[] = [];

  add(command: Composable | Composable[]) {
    if (Array.isArray(command)) {
      this.commands.push(...command);
    } else {
      this.commands.push(command);
    }
  }

  execute() {
    for (let i = 0; i < this.commands.length; i++) {
      this.commands[i].execute();
    }
  }
}

const macroCommand = new MacroCommand();
macroCommand.add([openAirCommand, playMusicCommand]);

const openQQCommand: Composable = {
  execute() {
    console.log('open QQ');
  },
};
const macroCommand2 = new MacroCommand();
macroCommand2.add([macroCommand, openQQCommand]);

macroCommand2.execute();

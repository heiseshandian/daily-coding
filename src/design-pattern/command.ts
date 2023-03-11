import { AnimatePropName, Animate, AnimateEventType } from './strategy';

/* 
命令模式最常见的应用场景是：有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，
也不知道被请求的操作是什么。此时希望用一种松耦合的方式来设计程序，
使得请求发送者和请求接收者能够消除彼此之间的耦合关系。
*/
interface Command {
    execute: () => any;

    /* 
    撤销是命令模式里一个非常有用的功能，试想一下开发一个围棋程序的时候，
    我们把每一步棋子的变化都封装成命令，则可以轻而易举地实现悔棋功能。
    同样，撤销命令还可以用于实现文本编辑器的Ctrl+Z功能。
    */
    undo?: () => any;
}

const MenuBar = {
    refresh() {
        console.log('刷新菜单');
    },
};

// 用命令对象来解耦请求的发送方与请求的接收方，命令对象可以在程序中自由传递
class RefreshMenuBarCommand implements Command {
    receiver: { refresh: () => void };

    public execute() {
        this.receiver.refresh();
    }

    constructor(receiver: { refresh: () => void }) {
        this.receiver = receiver;
    }
}

function setCommand(btn: HTMLButtonElement, command: Command) {
    btn.addEventListener('click', () => {
        command.execute();
    });
}

export function bindMenuEvents(menuBtn: HTMLButtonElement) {
    setCommand(menuBtn, new RefreshMenuBarCommand(MenuBar));
}

export class MoveCommand implements Command {
    receiver: Animate;

    propName: AnimatePropName;
    endPos: number;
    oldPos: number = 0;

    constructor(receiver: Animate, propName: AnimatePropName, endPos: number) {
        this.receiver = receiver;

        this.endPos = endPos;
        this.propName = propName;
    }

    public execute() {
        this.receiver.start(this.propName, this.endPos);
        this.oldPos = this.receiver.dom.getBoundingClientRect()[this.receiver.propName!];
    }

    public undo() {
        this.receiver.start('left', this.oldPos);
    }
}

export class MoveCommandSchedular {
    animate: Animate;
    commandQueue: Command[] = [];

    constructor(animate: Animate) {
        this.animate = animate;
    }

    private running: boolean = false;
    private runningCommand: Command | null = null;

    public runCommand(command: Command) {
        if (this.running) {
            this.commandQueue.push(command);
        } else {
            this.bindEvents();
            command.execute();
            this.runningCommand = command;
        }
    }

    public undoCommand() {
        if (this.commandQueue.length > 0) {
            this.commandQueue.pop();
            return;
        }

        if (this.runningCommand) {
            this.runningCommand.undo!();
        }
    }

    animationEndHandler = () => {
        // 最后一个命令执行结束后解绑事件
        if (this.commandQueue.length === 0) {
            this.unbindEvents();
            this.runningCommand = null;
            this.running = false;
        }

        const first = this.commandQueue.shift();
        if (first) {
            first.execute();
            this.runningCommand = first;
        }
    };

    animationStartHandler = () => {
        this.running = true;
    };

    private bindEvents() {
        this.animate.listen(AnimateEventType.AnimationEnd, this.animationEndHandler);
        this.animate.listen(AnimateEventType.AnimationStart, this.animationStartHandler);
    }

    private unbindEvents() {
        this.animate.remove(AnimateEventType.AnimationEnd, this.animationEndHandler);
        this.animate.remove(AnimateEventType.AnimationStart, this.animationStartHandler);
    }
}

/* 
上一节我们讨论了如何撤销一个命令。很多时候，我们需要撤销一系列的命令。
比如在一个围棋程序中，现在已经下了10步棋，我们需要一次性悔棋到第5步。
在这之前，我们可以把所有执行过的下棋命令都储存在一个历史列表中，
然后倒序循环来依次执行这些命令的undo操作，直到循环执行到第5个命令为止。

然而，在某些情况下无法顺利地利用undo操作让对象回到execute之前的状态。
比如在一个Canvas画图的程序中，画布上有一些点，我们在这些点之间画了N条曲线
把这些点相互连接起来，当然这是用命令模式来实现的。
但是我们却很难为这里的命令对象定义一个擦除某条曲线的undo操作，
因为在Canvas画图中，擦除一条线相对不容易实现。

这时候最好的办法是先清除画布，然后把刚才执行过的命令全部重新执行一遍，
这一点同样可以利用一个历史列表堆栈办到。记录命令日志，然后重复执行它们，
这是逆转不可逆命令的一个好办法。
*/
type Action = () => void;

interface Actions {
    attack: Action;
    defense: Action;
    jump: Action;
    crouch: Action;
}

const actions = {
    attack() {
        console.log('攻击');
    },
    defense() {
        console.log('防御');
    },
    jump() {
        console.log('跳跃');
    },
    crouch() {
        console.log('蹲下');
    },
};

class ActionCommand implements Command {
    actionName: keyof Actions;
    receiver: Actions;

    constructor(receiver: Actions, actionName: keyof Actions) {
        this.receiver = receiver;
        this.actionName = actionName;
    }

    public execute() {
        this.receiver[this.actionName]();
    }
}

enum ActionKeyCodes {
    KeyW = 'KeyW',
    KeyA = 'KeyA',
    KeyS = 'KeyS',
    KeyD = 'KeyD',
}

const keyCodesToActions: Record<string, keyof Actions> = {
    [ActionKeyCodes.KeyW]: 'jump',
    [ActionKeyCodes.KeyS]: 'crouch',
    [ActionKeyCodes.KeyA]: 'attack',
    [ActionKeyCodes.KeyD]: 'defense',
};

export function bindActionEvents() {
    const commandStack: ActionCommand[] = [];

    document.addEventListener('keydown', (e) => {
        if (!keyCodesToActions[e.code]) {
            return;
        }

        const command = new ActionCommand(actions, keyCodesToActions[e.code]);
        command.execute();

        commandStack.push(command);
    });

    // 从命令堆栈中取出所有命令依次执行，从而实现攻击回放功能
    document.getElementById('replay')?.addEventListener('click', () => {
        while (commandStack.length > 0) {
            const first = commandStack.shift();
            first?.execute();
        }
    });
}

/* 
宏命令：用于封装一组命令

宏命令是一组命令的集合，通过执行宏命令的方式，可以一次执行一批命令。想象一下，
家里有一个万能遥控器，每天回家的时候，
只要按一个特别的按钮，它就会帮我们关上房间门，顺便打开电脑并登录QQ。
*/
const closeDoorCommand: Command = {
    execute() {
        console.log('关门');
    },
};

const openAirConditionerCommand: Command = {
    execute() {
        console.log('打开空调');
    },
};

const playMusicCommand: Command = {
    execute() {
        console.log('播放音乐');
    },
};

export class MacroCommand implements Command {
    commandList: Command[] = [];

    public add(command: Command) {
        this.commandList.push(command);
    }

    public execute() {
        for (let i = 0; i < this.commandList.length; i++) {
            this.commandList[i].execute();
        }
    }

    public undo() {
        for (let i = 0; i < this.commandList.length; i++) {
            const { undo } = this.commandList[i];

            if (undo) {
                undo.call(this.commandList[i]);
            }
        }
    }
}

const macroCommand = new MacroCommand();
macroCommand.add(closeDoorCommand);
macroCommand.add(openAirConditionerCommand);
macroCommand.add(playMusicCommand);

macroCommand.execute();

/* 
智能命令与傻瓜命令

一般来说，命令模式都会在command对象中保存一个接收者来负责真正执行客户的请求，
这种情况下命令对象是“傻瓜式”的，它只负责把客户的请求转交给接收者来执行，
这种模式的好处是请求发起者和请求接收者之间尽可能地得到了解耦。

但是我们也可以定义一些更“聪明”的命令对象，“聪明”的命令对象可以直接实现请求，
这样一来就不再需要接收者的存在，这种“聪明”的命令对象也叫作智能命令。
没有接收者的智能命令，退化到和策略模式非常相近，从代码结构上已经无法分辨它们，
能分辨的只有它们意图的不同。策略模式指向的问题域更小，所有策略对象的目标总是一致的，
它们只是达到这个目标的不同手段，它们的内部实现是针对“算法”而言的。
而智能命令模式指向的问题域更广，command对象解决的目标更具发散性。
命令模式还可以完成撤销、排队等功能。

如上的closeDoorCommand没有接收者，命令本身就包含了处理逻辑，这种就是智能命令
*/

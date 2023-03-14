import { cache } from './proxy';
import { getSingleClass } from './singleton';

enum UploadType {
    ActiveX,
    Flash,
    Plugin,
}

class Upload {
    uploadType: UploadType;
    fileName: string;
    fileSize: number;
    dom: HTMLDivElement | null = null;

    constructor(uploadType: UploadType, fileName: string, fileSize: number) {
        this.uploadType = uploadType;
        this.fileName = fileName;
        this.fileSize = fileSize;
    }

    id: number = 0;

    public init(id: number) {
        this.id = id;
        this.dom = document.createElement('div');
        this.dom.innerHTML = `
            <span>文件名称${this.fileName},文件大小${this.fileSize}</span>
            <button class="delete-file">删除</button>
        `;

        this.dom.querySelector('.delete-file')?.addEventListener('click', () => {
            this.deleteFile();
        });

        document.body.appendChild(this.dom);
    }

    private deleteFile() {
        if (this.fileSize < 3000) {
            return this.dom?.parentNode?.removeChild(this.dom);
        }

        if (window.confirm(`确认需要删除该文件吗？${this.fileName}`)) {
            return this.dom?.parentNode?.removeChild(this.dom);
        }
    }
}

let id = 0;
export function startUpload(uploadType: UploadType, files: File[]) {
    for (let i = 0; i < files.length; i++) {
        const { name, size } = files[i];
        const upload = new Upload(uploadType, name, size);
        upload.init(id++);
    }
}

/* 
上述代码中有多少个文件就创建了多少个Upload对象，但其实Upload中的uploadType属性
是没必要存在多个实例的，这里我们把uploadType抽取出来作为Upload的内部状态，其他属性
作为外部状态
*/
class FlyweightUpload {
    // 内部状态
    uploadType: UploadType;
    uploadManager: UploadManager;

    // 外部状态
    name?: string;
    dom?: HTMLDivElement;
    state?: UploadState;

    constructor(uploadType: UploadType, uploadManager: UploadManager) {
        this.uploadType = uploadType;
        this.uploadManager = uploadManager;
    }

    /* 
    状态模式

    将每个状态封装成单独的类，每个状态类用于处理不同状态下的行为，当然我们这里用状态对象代替了状态类
    本质上是一样的

    状态模式和策略模式

    相同点：都有上下文，策略或者状态类，上下问将请求委托给子类来执行

    不同点：策略模式中的各个策略类之间是平等又平行的，它们之间没有任何联系，
    所以客户必须熟知这些策略类的作用，以便客户可以随时主动切换算法；
    而在状态模式中，状态和状态对应的行为是早已被封装好的，
    状态之间的切换也早被规定完成，“改变行为”这件事情发生在状态模式内部。
    对客户来说，并不需要了解这些细节。这正是状态模式的作用所在。
    */
    stateOperations: Record<
        UploadState,
        {
            delFile?: (id: number) => void;
            startOrPause?: (id: number) => void;
        }
    > = {
        [UploadState.Sign]: {},
        [UploadState.Pause]: {
            delFile: (id: number) => {
                this.uploadManager.remove(id);
            },
            startOrPause: (id: number) => {
                this.uploadManager.updateExternalState(id, {
                    state: UploadState.Uploading,
                });
            },
        },
        [UploadState.Uploading]: {
            delFile: (id: number) => {
                this.uploadManager.remove(id);
            },
            startOrPause: (id: number) => {
                this.uploadManager.updateExternalState(id, {
                    state: UploadState.Pause,
                });
            },
        },
        [UploadState.Done]: {},
        [UploadState.Error]: {},
    };

    public deleteFile(id: number) {
        this.uploadManager.setExternalState(id, this);

        const op = this.stateOperations[this.state!];
        if (op.delFile) {
            op.delFile(id);
        }
    }

    public startOrPause(id: number) {
        this.uploadManager.setExternalState(id, this);

        const op = this.stateOperations[this.state!];
        if (op.startOrPause) {
            op.startOrPause(id);
        }
    }
}

const createUploadFactory = cache((uploadType: UploadType, uploadManager: UploadManager) => {
    return new FlyweightUpload(uploadType, uploadManager);
});

enum UploadState {
    Sign,
    Pause,
    Uploading,
    Done,
    Error,
}

interface UploadItem {
    name: string;
    dom: HTMLDivElement;

    state: UploadState;
}

// 通过管理器管理外部状态
class UploadManager {
    uploads: Record<number, UploadItem> = {};

    public add(id: number, uploadType: UploadType, name: string) {
        const flyweightUpload = createUploadFactory(uploadType, this);

        const dom = this.createDom(name);
        this.bindEvents(dom, id, flyweightUpload);
        document.body.appendChild(dom);

        this.uploads[id] = {
            name,
            dom,
            state: UploadState.Sign,
        };
    }

    public remove(id: number) {
        if (!this.uploads[id]) {
            return;
        }

        delete this.uploads[id];
    }

    private createDom(name: string) {
        const dom = document.createElement('div');
        dom.innerHTML = `
            <span>文件名称${name}</span>
            <button data-action="startOrPause">扫描中</button>
            <button data-action="delFile">删除</button>
        `;

        return dom;
    }

    private bindEvents(dom: HTMLDivElement, id: number, flyweightUpload: FlyweightUpload) {
        const startOrPauseBtn = dom.querySelector('[data-action="startOrPause"]');
        const delBtn = dom.querySelector('[data-action="delFile"]');
        if (startOrPauseBtn) {
            startOrPauseBtn.addEventListener('click', () => {
                flyweightUpload.startOrPause(id);
            });
        }
        if (delBtn) {
            delBtn.addEventListener('click', () => {
                flyweightUpload.deleteFile(id);
            });
        }
    }

    public setExternalState(id: number, flyweightUpload: FlyweightUpload) {
        Object.assign(flyweightUpload, this.uploads[id]);
    }

    public updateExternalState(id: number, uploadItem: Partial<UploadItem>) {
        if (!this.uploads[id]) {
            return;
        }

        Object.assign(this.uploads[id], uploadItem);
    }
}

const getUploadManagerInstance = getSingleClass(UploadManager);

export function flyweightStartUpload(uploadType: UploadType, files: File[]) {
    for (let i = 0; i < files.length; i++) {
        const { name } = files[i];
        getUploadManagerInstance().add(id++, uploadType, name);
    }
}

/* 
享元模式的适用性

享元模式是一种很好的性能优化方案，但它也会带来一些复杂性的问题，
从前面两组代码的比较可以看到，使用了享元模式之后，
我们需要分别多维护一个factory对象和一个manager对象，
在大部分不必要使用享元模式的环境下，这些开销是可以避免的。

适合使用享元模式的场景
1) 一个程序中使用了大量的相似对象。
2) 由于使用了大量对象，造成很大的内存开销。
3) 对象的大多数状态都可以变为外部状态。
4) 剥离出对象的外部状态之后，可以用相对较少的共享对象取代大量对象
*/

/* 
对象池技术

对象池的原理很好理解，比如我们组人手一本《JavaScript权威指南》，
从节约的角度来讲，这并不是很划算，因为大部分时间这些书都被闲置在各自的书架上，
所以我们一开始就只买一本，或者一起建立一个小型图书馆（对象池），
需要看书的时候就从图书馆里借，看完了之后再把书还回图书馆。
如果同时有三个人要看这本书，而现在图书馆里只有两本，那我们再马上去书店买一本放入图书馆。

对象池技术的应用非常广泛，HTTP连接池和数据库连接池都是其代表应用。
在Web前端开发中，对象池使用最多的场景大概就是跟DOM有关的操作。
很多空间和时间都消耗在了DOM节点上，如何避免频繁地创建和删除DOM节点就成了一个有意义的话题。
*/

interface Pool<T = any> {
    create: (...args: any[]) => T;
    recover: (t: T) => void;
}

// 通用对象池技术
export function createPoolFactory<T>(fn: (...args: any[]) => T): Pool<T> {
    const pool: T[] = [];

    return {
        create(...args: any[]) {
            if (pool.length === 0) {
                return fn.apply(this, args);
            } else {
                return pool.shift()!;
            }
        },
        recover(t: T) {
            pool.push(t);
        },
    };
}

export const toolTipFactory = createPoolFactory(() => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    return div;
});

export const iframeFactory = createPoolFactory(() => {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);

    iframe.onload = () => {
        // 避免iframe重复加载
        iframe.onload = null;
        // iframe加载完之后回收节点
        iframeFactory.recover(iframe);
    };

    return iframe;
});

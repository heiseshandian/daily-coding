/* 
迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。
*/

/* 
内部迭代器

迭代规则提前定义好，外部调用的时候很简单，缺点是不够灵活，比如说我们想同时迭代多个数组就比较困难
*/
export function each<T>(obj: ArrayLike<T>, callback: (cur: T, i: number, obj: ArrayLike<T>) => boolean) {
    for (let i = 0; i < obj.length; i++) {
        // 提前终止迭代器
        if (callback(obj[i], i, obj) === false) {
            break;
        }
    }
}

/* 
外部迭代器

提供迭代能力，实际迭代行为由外部自行决定，调用复杂但是使用更灵活
*/
export function createIterator<T>(obj: ArrayLike<T>) {
    let current = 0;

    return {
        next() {
            current++;
        },
        getCurrentItem() {
            return obj[current];
        },
        isDone() {
            return current >= obj.length;
        },
        length: obj.length,
    };
}

type CustomizedIterator<T = any> = ReturnType<typeof createIterator<T>>;

export function isEqual(iterator1: CustomizedIterator, iterator2: CustomizedIterator) {
    if (iterator1.length !== iterator2.length) {
        return false;
    }

    while (!iterator1.isDone() && !iterator2.isDone()) {
        if (iterator1.getCurrentItem() !== iterator2.getCurrentItem()) {
            return false;
        }

        iterator1.next();
        iterator2.next();
    }
    return true;
}

/* 
迭代器应用举例

存在的问题分析：
为了得到一个upload对象，这个getUploadObj函数里面充斥了try, 
catch以及if条件分支。缺点是显而易见的。
第一是很难阅读，
第二是严重违反开闭原则。在开发和调试过程中，我们需要来回切换不同的上传方式，每次改动都相当痛苦。
后来我们还增加支持了一些另外的上传方式，比如，HTML5上传，
这时候唯一的办法是继续往getUploadObj函数里增加条件分支。
*/
export const getUploadObj = () => {
    try {
        // IE上传控件
        // @ts-expect-error
        return new ActiveXObject('TXFTNActiveX.FTNUpload');
    } catch (e) {
        if (supportFlash()) {
            const flash = document.createElement('object');
            flash.type = 'application/x-shockwave-flash';
            document.body.appendChild(flash);

            return flash;
        } else {
            const input = document.createElement('input');
            input.name = 'file';
            input.type = 'file';
            document.body.appendChild(input);

            return input;
        }
    }
};

function supportFlash(): boolean {
    return true;
}

function getActiveUploadObj() {
    try {
        // @ts-expect-error
        return new ActiveXObject('TXFTNActiveX.FTNUpload');
    } catch (e) {
        return false;
    }
}

function getFlashUploadObj() {
    if (supportFlash()) {
        const flash = document.createElement('object');
        flash.type = 'application/x-shockwave-flash';
        document.body.appendChild(flash);

        return flash;
    } else {
        return false;
    }
}

function getFileInputUploadObj() {
    const input = document.createElement('input');
    input.name = 'file';
    input.type = 'file';
    document.body.appendChild(input);

    return input;
}

// 使用迭代器重构 getUploadObj
export function getUploadObj2() {
    const methods = [getActiveUploadObj, getFlashUploadObj, getFileInputUploadObj];

    for (let i = 0; i < methods.length; i++) {
        const upload = methods[i]();
        if (upload !== false) {
            return upload;
        }
    }
}

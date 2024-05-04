addBtns();

const ob = new MutationObserver(function () {
    addBtns();
});
ob.observe(document, { childList: true, subtree: true });

function addBtns() {
    addCopyBtn();
    addClearCacheBtn();
}

/**
 * 添加复制按钮
 * @returns void
 */
function addCopyBtn() {
    addBtn('复制今日完成课程', handleClickCopyBtn);
}

/**
 * 添加清空历史按钮
 */
function addClearCacheBtn() {
    addBtn('清空历史', () => {
        if (delete localStorage[CACHE_KEY]) {
            showSuccessMessage('Cache has been cleared successfully');
        } else {
            showErrorMessage('Something went wrong');
        }
    });
}

/**
 *
 * @param {string} content 按钮文案
 * @param {Function} clickHandler
 */
function addBtn(content, clickHandler) {
    const btnContainer = document.querySelector('.b-head-c');
    if (btnContainer[content]) {
        return;
    }

    const btn = document.createElement('a');
    btn.textContent = content;
    btn.classList.add('baymax-copy-btn');
    btn.addEventListener('click', clickHandler);

    btnContainer.appendChild(btn);
    btnContainer[content] = true;
}

const CACHE_KEY = 'baymax_algorithm_5_7';

/**
 * 处理复制逻辑
 */
function handleClickCopyBtn() {
    const txts = document.querySelectorAll(
        '.history-list .history-record .r-info .r-txt'
    );

    const prevToCopy = localStorage.getItem(CACHE_KEY) ?? '[]';
    const prevSet = new Set(JSON.parse(prevToCopy));

    const pattern = /^\[算法讲解.*/;
    const toCopy = Array.from(txts)
        .filter(
            (n) =>
                n.querySelector('.time-wrap .progress')?.textContent?.trim() ===
                '已看完'
        )
        .map((n) => {
            const titleLink = n.querySelector('.title');
            const href = titleLink.getAttribute('href');
            const title = titleLink.textContent.trim();
            return `[${title}](https:${href})`;
        })
        .filter((t) => pattern.test(t))
        .filter((t) => !prevSet.has(t));

    localStorage.setItem(CACHE_KEY, JSON.stringify(toCopy));

    copyToClipboard(`- ${getTime()}\n${toCopy.join('\n')}`);
}

/**
 * 获取当前日期字符串
 *
 * @returns 当前日期字符串
 */
function getTime() {
    // 往前推 5 小时，对于凌晨 5 点以前的场景算作 前一天的工作量
    const today = new Date(Date.now() - 5 * 60 * 60 * 1000);

    const month = today.getMonth() + 1;
    const day = today.getDate();

    return `${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
}

// FIXME:目前以下逻辑在多个脚本中重复，需要想办法优化下，比如说通过 gulp 构建的方式打包出来完整的

/**
 * 复制内容到剪贴板
 * @param {string} toCopy
 */
function copyToClipboard(toCopy) {
    navigator.clipboard
        .writeText(toCopy)
        .then(() => {
            showSuccessMessage('Text successfully copied to clipboard');
        })
        .catch((err) => {
            console.error(err);
            showErrorMessage('Unable to copy text to clipboard');
        });
}

function showMessage(message, type) {
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';
    document.body.appendChild(messageContainer);

    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);

    messageContainer.classList.remove('container-hidden');

    setTimeout(function () {
        hideMessage(messageContainer);
    }, 3000);
}

function hideMessage(messageContainer) {
    messageContainer.classList.add('container-hidden');
    setTimeout(function () {
        document.body.removeChild(messageContainer);
    }, 500);
}

function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

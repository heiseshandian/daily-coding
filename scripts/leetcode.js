// 自动复制leetcode上的链接地址、标题、描述等
addBtns();
// 自动跳转到英文站
autoJumpBackToEnglishVersion();

const observer = new MutationObserver(function () {
    addBtns();
    saveTitle();
});

observer.observe(document, { childList: true, subtree: true });

document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        saveTitle();
    }
});

function autoJumpBackToEnglishVersion() {
    if (location.href.startsWith('https://leetcode.cn')) {
        location.replace(
            location.href.replace('https://leetcode.cn', 'https://leetcode.com')
        );
    }
}

function addBtns() {
    addCopyBtn();
    addCopyGptPrompt();
}

const COPY_BTN_CONTENT = 'copy content';

async function addCopyBtn() {
    const btnContainer = await getBtnContainer();
    if (btnContainer.hasAddedCopyBtn) {
        return;
    }

    const copyBtn = document.createElement('button');
    copyBtn.textContent = COPY_BTN_CONTENT;
    copyBtn.classList.add('special-copy-btn');
    copyBtn.addEventListener('click', handleClickCopyBtn);

    btnContainer.appendChild(copyBtn);
    btnContainer.hasAddedCopyBtn = true;
}

const GPT_PROMPT = 'gpt prompt';

async function addCopyGptPrompt() {
    const btnContainer = (await getBtnContainer('.items-center.gap-4 button'))
        .parentNode;
    if (btnContainer.hasAddGptPrompt) {
        return;
    }

    const gptPrompt = document.createElement('button');
    gptPrompt.textContent = GPT_PROMPT;
    'whitespace-nowrap focus:outline-none text-white dark:text-dark-white text-md flex h-8 items-center gap-1 rounded-lg px-4 font-medium purple-btn'
        .split(' ')
        .forEach((cls) => {
            gptPrompt.classList.add(cls);
        });
    gptPrompt.addEventListener('click', handleClickGptPrompt);

    btnContainer.appendChild(gptPrompt);
    btnContainer.hasAddGptPrompt = true;
}

/**
 * 由于 btnContainer 是异步加载的，这里使用 raf 来获取
 *
 * @param {string} selectors
 * @returns {Promise<HTMLDivElement>} btnContainer
 */
function getBtnContainer(selectors = '.flexlayout__tab .text-title-large') {
    let btnContainer;
    let resolveFn = () => {};

    const updateBtnContainer = () => {
        btnContainer = document.querySelector(selectors);
        if (!btnContainer) {
            requestAnimationFrame(updateBtnContainer);
        } else {
            resolveFn(btnContainer);
        }
    };
    updateBtnContainer();

    return new Promise((resolve) => {
        resolveFn = resolve;
    });
}

/**
 * 点击复制按钮后将内容复制到剪贴板
 */
function handleClickCopyBtn() {
    const container = document.querySelector('.flexlayout__tab');

    const href = location.href;

    let title = container.querySelector('.text-title-large')?.textContent;
    title = removeSuffix(title, COPY_BTN_CONTENT);

    let desc = container.querySelector(
        '[data-track-load="description_content"]'
    )?.textContent;
    desc = fixConstraints(desc).trimEnd('\n');

    let lines = document.querySelector('.view-lines')?.textContent;
    lines = removeComment(lines);

    const toCopy = reduceMultipleEmptyLines(
        `/*\n${href}\n${title}\n${desc}\n*/\nexport ${lines}\n`
    );

    copyToClipboard(toCopy);
}

/**
 * 删除注释
 *
 * @param {string} lines
 */
function removeComment(lines) {
    return lines.replace(/\/\*[\s\S]*?\*\//, '');
}

/**
 * 将 title 保存到 localStorage
 */
async function saveTitle() {
    const titleElement = await getBtnContainer(
        '.flexlayout__tab .text-title-large'
    );

    let title = removeSuffix(titleElement.textContent, COPY_BTN_CONTENT);
    localStorage.setItem('leetcode_title_baymax', title);
}

/**
 * 从 localStorage 取出之前保存的标题
 *
 */
function getTitleFromCache() {
    return localStorage.getItem('leetcode_title_baymax');
}

/**
 * 点击复制gpt prompt
 */
function handleClickGptPrompt() {
    const title = getTitleFromCache();

    let lines = document.getElementById('code').nextElementSibling.textContent;
    lines = `// code start\n${lines}\n // code end\n`;

    const output =
        'Output markdown instead of formatting the markdown content directly.';

    const toCopy = `${title}\n${lines}\n${output}`;

    copyToClipboard(toCopy);
}

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

/**
 * 将 Constraints 中的 105 变成 10^5 （默认情况下上划线没有复制出来）
 * @param {string} desc
 */
function fixConstraints(desc) {
    // -4 * 10^4 <= Node.val <= 4 * 10^4
    const prefixReg = /10([1-9])\s+(<=?)/g;
    const suffixReg = /(<=?)\s+(?:\d\s+\*\s+)?10([1-9])/g;
    // [1, 4 * 10^4]
    const squareReg = /10([1-9])\]/g;

    // -2^31 <= nums.length <= 2^31-1
    const twoPrefixReg = /-?2([1-3]{2})\s+(<=?)/g;
    const twoSuffixReg = /(<=?)\s+(?:\d\s+\*\s+)?2([1-3]{2})/g;

    return desc
        .replace(prefixReg, '10^$1 $2')
        .replace(suffixReg, '$1 10^$2')
        .replace(twoPrefixReg, '2^$1 $2')
        .replace(twoSuffixReg, '$1 2^$2')
        .replace(squareReg, '10^$1]');
}

/**
 * 删除 inputString 指定的 suffixToRemove 后缀
 * @param {string} inputString
 * @param {string} suffixToRemove
 * @returns
 */
function removeSuffix(inputString, suffixToRemove) {
    if (inputString.endsWith(suffixToRemove)) {
        return inputString.slice(0, -suffixToRemove.length);
    } else {
        return inputString;
    }
}

function reduceMultipleEmptyLines(text) {
    return text.replace(/(\n\s*\n)+/g, '\n\n');
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

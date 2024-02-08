// 自动复制leetcode上的链接地址、标题、描述等
addCopyBtn();

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

/**
 * 由于 btnContainer 是异步加载的，这里使用 raf 来获取
 *
 * @returns {Promise<HTMLDivElement>} btnContainer
 */
function getBtnContainer() {
    let btnContainer;
    let resolveFn;

    const updateBtnContainer = () => {
        btnContainer = document.querySelector(
            '.flexlayout__tab .text-title-large'
        );
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

    const lines = document.querySelector('.view-lines')?.textContent;

    const toCopy = reduceMultipleEmptyLines(
        `/*\n${href}\n${title}\n${desc}\n*/\nexport ${lines}\n`
    );

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
    const prefixReg = /10([1-9])\s+<=/g;
    const suffixReg = /<=\s+(?:\d\s+\*\s+)?10([1-9])/g;
    // [1, 4 * 10^4]
    const squareReg = /10([1-9])\]/g;

    return desc
        .replace(prefixReg, '10^$1 <=')
        .replace(suffixReg, '<= 10^$1')
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

    messageContainer.classList.remove('hidden');

    setTimeout(function () {
        hideMessage(messageContainer);
    }, 3000);
}

function hideMessage(messageContainer) {
    messageContainer.classList.add('hidden');
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

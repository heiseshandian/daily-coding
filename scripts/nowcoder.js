// 自动复制 nowcoder 上的链接地址、标题、描述等
addBtns();

const observer = new MutationObserver(function () {
    addBtns();
});

observer.observe(document, { childList: true, subtree: true });

function addBtns() {
    addCopyBtn();
}

const COPY_BTN_CONTENT = 'copy content';

async function addCopyBtn() {
    const btnContainer = await getBtnContainer('.section-title');
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
 * @param {string} selectors
 * @returns {Promise<HTMLDivElement>} btnContainer
 */
function getBtnContainer(selectors) {
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
    const title = document
        .querySelector('.hide-txt')
        .textContent?.replace(/\s+/g, ' ')
        .trim();

    // Extract Password Requirements
    const requirements = Array.from(
        document.querySelectorAll('.describe-table p, .describe-table div')
    )
        .map((el) => {
            const content = el.textContent.trim();
            const annotation = el.querySelector('annotation');
            if (annotation) {
                return content.replace(annotation.textContent, '');
            }
            return content;
        })
        .filter((text) => text !== '');

    // Extract Input Description
    const inputDescription = document
        .querySelector('.section-sub-title')
        .textContent.trim();

    // Extract Output Description
    const outputDescription = document
        .querySelector('.section-sub-title:nth-of-type(2)')
        .textContent.trim();

    // Extract Example Inputs and Outputs
    const exampleInputs = document
        .querySelector('.question-sample .sample-item pre')
        .textContent.trim()
        .split('\n');

    const exampleOutputs = document
        .querySelector('.question-sample .sample-item:nth-of-type(2) pre')
        .textContent.trim()
        .split('\n');

    const toCopy = `/*
${location.href}
${title}

描述：
${requirements.map((v) => `  ${v}`).join('\n')}
    
输入描述：
  ${inputDescription}

输出描述：
  ${outputDescription}

示例：
输入：
${exampleInputs.map((v) => `  ${v}`).join('\n')}
输出：
${exampleOutputs.map((v) => `  ${v}`).join('\n')}
*/`;

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

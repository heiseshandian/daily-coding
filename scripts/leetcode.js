// 自动复制leetcode上的链接地址、标题、描述等
addCopyBtn();

async function addCopyBtn() {
    const btnContainer = await getBtnContainer();
    if (btnContainer.hasAddedCopyBtn) {
        return;
    }

    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'copy content';
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
        btnContainer = document.querySelector('.flexlayout__tab .text-title-large');
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
    const title = container.querySelector('.text-title-large')?.textContent;
    const desc = container.querySelector('[data-track-load="description_content"]')?.textContent;

    const toCopy = reduceMultipleEmptyLines(`${href}\n${title}\n${desc}`);

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

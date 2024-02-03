// 自动复制leetcode上的链接地址、标题、描述等
function addCopyBtn() {
    const btnContainer = document.querySelector('.flexlayout__tab .text-title-large');
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

function reduceMultipleEmptyLines(text) {
    return text.replace(/(\n\s*\n)+/g, '\n\n');
}

function handleClickCopyBtn() {
    const container = document.querySelector('.flexlayout__tab');

    const href = location.href;
    const title = container.querySelector('.text-title-large')?.textContent;
    const desc = container.querySelector('[data-track-load="description_content"]')?.textContent;

    const toCopy = reduceMultipleEmptyLines(`${href}\n${title}\n${desc}`);

    navigator.clipboard
        .writeText(toCopy)
        .then(() => {
            console.log('Text successfully copied to clipboard');
        })
        .catch((err) => {
            console.error('Unable to copy text to clipboard', err);
        });
}

setTimeout(() => {
    addCopyBtn();
}, 4000);

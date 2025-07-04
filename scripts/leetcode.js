// 自动复制leetcode上的链接地址、标题、描述等
addBtns();
// 自动跳转到英文站
autoJumpBackToEnglishVersion();

const observer = new MutationObserver(function () {
  addBtns();
});

observer.observe(document, { childList: true, subtree: true });

function autoJumpBackToEnglishVersion() {
  if (location.href.startsWith('https://leetcode.cn')) {
    location.replace(
      location.href.replace('https://leetcode.cn', 'https://leetcode.com')
    );
  }
}

function addBtns() {
  addCopyBtn();
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

/**
 * 由于 btnContainer 是异步加载的，这里使用 raf 来获取
 *
 * @param {string} selectors
 * @returns {Promise<HTMLDivElement>} btnContainer
 */
/**
 * 获取按钮容器元素
 * @param {string} selectors - CSS选择器
 * @param {Object} options - 配置选项
 * @param {number} options.timeout - 超时时间（毫秒），默认 5000ms
 * @returns {Promise<HTMLElement>} 按钮容器元素
 */
function getBtnContainer(
  selectors = '.flexlayout__tab .text-title-large.font-semibold',
  options = {}
) {
  const { timeout = 5000 } = options;

  // 参数验证
  if (typeof selectors !== 'string') {
    return Promise.reject(new Error('selectors must be a string'));
  }

  return new Promise((resolve, reject) => {
    let timeoutId;
    let rafId;
    let startTime = Date.now();

    const updateBtnContainer = () => {
      const btnContainer = document.querySelector(selectors);

      // 找到元素
      if (btnContainer) {
        clearTimeout(timeoutId);
        cancelAnimationFrame(rafId);
        resolve(btnContainer);
        return;
      }

      // 超时检查
      if (Date.now() - startTime > timeout) {
        clearTimeout(timeoutId);
        cancelAnimationFrame(rafId);
        reject(new Error(`Failed to find element with selector: ${selectors}`));
        return;
      }

      // 继续查找
      rafId = requestAnimationFrame(updateBtnContainer);
    };

    // 启动查找
    updateBtnContainer();

    // 设置超时
    timeoutId = setTimeout(() => {
      cancelAnimationFrame(rafId);
      reject(new Error('getBtnContainer timeout'));
    }, timeout);
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

  const toCopy = buildToCopy(href, title, desc, lines);

  copyToClipboard(toCopy);
}

function buildToCopy(href, title, desc, lines) {
  if (isPythonCode(lines)) {
    return reduceMultipleEmptyLines(
      `"""\n${href}\n${title}\n${desc}\n"""\n${lines
        .replace(/\s/g, ' ')
        .replace('Solution:', 'Solution:\n')}\n`
    );
  }

  return reduceMultipleEmptyLines(
    `/*\n${href}\n${title}\n${desc}\n*/\nexport ${lines}\n`
  );
}

function isPythonCode(lines) {
  return lines.startsWith('class Solution:');
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

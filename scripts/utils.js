function getCriticalCss(element) {
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );

  if (!element || !(element instanceof Element)) {
    console.error('请传入有效的DOM元素');
    return '';
  }

  // 收集所有元素（包括传入元素及其所有子元素）
  const allElements = [element, ...element.querySelectorAll('*')];

  // 收集所有样式表
  const allStylesheets = Array.from(document.styleSheets);

  // 收集所有CSS规则
  const allRules = [];
  allStylesheets.forEach((sheet) => {
    try {
      Array.from(sheet.cssRules || []).forEach((rule) => allRules.push(rule));
    } catch (e) {
      console.error('无法读取样式表规则', e);
    }
  });

  // 收集匹配元素的选择器
  const criticalSelectors = new Set();

  allRules.forEach((rule) => {
    if (rule.selectorText) {
      try {
        // 检查选择器是否匹配任何目标元素
        const matchesAnyElement = allElements.some((el) =>
          el.matches(rule.selectorText)
        );

        if (matchesAnyElement) {
          criticalSelectors.add(rule.cssText);
        }
        // 新增：处理 ::before 和 ::after 伪类
        if (
          rule.selectorText.includes('::before') ||
          rule.selectorText.includes('::after')
        ) {
          const baseSelector = rule.selectorText.replace(
            /::before|::after/g,
            ''
          );
          const matchesBase = allElements.some((el) =>
            el.matches(baseSelector)
          );
          if (matchesBase) {
            criticalSelectors.add(rule.cssText);
          }
        }
      } catch (e) {
        // 忽略无效选择器
      }
    } else if (rule.cssRules) {
      // 处理@media等特殊规则
      Array.from(rule.cssRules).forEach((nestedRule) => {
        if (nestedRule.selectorText) {
          try {
            const matchesAnyElement = allElements.some((el) =>
              el.matches(nestedRule.selectorText)
            );

            if (matchesAnyElement) {
              criticalSelectors.add(
                `@media ${rule.conditionText} { ${nestedRule.cssText} }`
              );
            }
            // 新增：处理 ::before 和 ::after 伪类
            if (
              nestedRule.selectorText.includes('::before') ||
              nestedRule.selectorText.includes('::after')
            ) {
              const baseSelector = nestedRule.selectorText.replace(
                /::before|::after/g,
                ''
              );
              const matchesBase = allElements.some((el) =>
                el.matches(baseSelector)
              );
              if (matchesBase) {
                criticalSelectors.add(
                  `@media ${rule.conditionText} { ${nestedRule.cssText} }`
                );
              }
            }
          } catch (e) {
            // 忽略无效选择器
          }
        }
      });
    }
  });

  let ret = Array.from(criticalSelectors).join('\n');
  // 移除类似[data-v-hash]的后缀
  ret = ret.replace(/\[data-v-[a-z0-9]+\]/g, '');

  // 转换rem单位到px
  ret = ret.replace(/(\d+\.?\d*)rem/g, (match, num) => {
    return Math.ceil(parseFloat(num) * rootFontSize) + 'px';
  });

  copyToClipboard(ret);

  // 返回关键CSS
  return ret;
}

/**
 * 复制内容到剪贴板
 * @param {string} toCopy
 */
function copyToClipboard(toCopy) {
  // 优先使用navigator.clipboard API
  if (navigator.clipboard) {
    // 确保页面处于focused状态
    if (!document.hasFocus()) {
      window.focus();
    }

    return navigator.clipboard.writeText(toCopy).catch(() => {
      // 如果失败，回退到execCommand方法
      legacyCopyToClipboard(toCopy);
    });
  }

  // 不支持clipboard API时使用execCommand方法
  legacyCopyToClipboard(toCopy);
}

function legacyCopyToClipboard(toCopy) {
  const textarea = document.createElement('textarea');
  textarea.value = toCopy;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

// 暴露到window对象
window.getCriticalCss = getCriticalCss;

/**
 * 由于 btnContainer 是异步加载的，这里使用 raf 来获取
 *
 * @param {string} selectors
 * @returns {Promise<HTMLDivElement>} btnContainer
 */
/**
 * 获取按钮容器元素（通过提供一个返回目标元素的函数）
 * @param {() => (HTMLElement|null|undefined)} getElementFn - 返回目标元素的函数；未找到时应返回 null/undefined
 * @param {Object} options - 配置选项
 * @param {number} options.timeout - 超时时间（毫秒），默认 5000ms
 * @returns {Promise<HTMLElement>} 按钮容器元素
 */
function getBtnContainer(getElementFn, options = {}) {
  const { timeout = 5000 } = options;

  // 参数验证
  if (typeof getElementFn !== 'function') {
    return Promise.reject(new Error('getElementFn must be a function'));
  }

  return new Promise((resolve, reject) => {
    let timeoutId;
    let rafId;
    const startTime = Date.now();

    const updateBtnContainer = () => {
      let el;
      try {
        el = getElementFn();
      } catch (e) {
        // 若函数抛错，继续重试
      }

      // 找到元素
      if (el instanceof Element) {
        clearTimeout(timeoutId);
        cancelAnimationFrame(rafId);
        resolve(el);
        return;
      }

      // 超时检查
      if (Date.now() - startTime > timeout) {
        clearTimeout(timeoutId);
        cancelAnimationFrame(rafId);
        reject(new Error('Failed to obtain element within timeout'));
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

async function addBtn() {
  const container = await getBtnContainer(
    () => document.querySelectorAll('[aria-current="page"]')?.[0]?.parentElement
  );

  if (!container) {
    return;
  }

  const maxPage = getBiggestPage(container) || 150;

  // 在容器中添加按钮
  const btn = document.createElement('button');
  btn.textContent = '任意门';
  btn.style.marginLeft = '8px';
  btn.className =
    'btn btn-sm bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700';

  btn.onclick = () => {
    const upper = Math.max(1, Math.floor(maxPage));
    const randomPage = Math.floor(Math.random() * upper) + 1;

    const url = new URL(location.href);
    url.searchParams.set('page', randomPage);
    location.href = url.toString();
  };

  container.appendChild(btn);
}

function getBiggestPage(container) {
  if (!container || !(container instanceof Element)) return null;

  const pages = Array.from(container.querySelectorAll('a[href*="page="]'))
    .map((a) => {
      // Try URL API first
      let href = a.getAttribute('href') || '';
      try {
        const url = new URL(href, location.origin); // handles relative links
        const v = parseInt(url.searchParams.get('page'), 10);
        return Number.isFinite(v) ? v : null;
      } catch {
        // Fallback regex parse
        const m = href.match(/[?&]page=(\\d+)/);
        return m ? parseInt(m[1], 10) : null;
      }
    })
    .filter((n) => n != null);

  return pages.length ? Math.max(...pages) : null;
}

addBtn();

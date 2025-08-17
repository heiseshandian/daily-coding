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

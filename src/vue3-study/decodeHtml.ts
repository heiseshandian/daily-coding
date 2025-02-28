import { getSingle } from '../design-pattern/singleton';
// https://regexr.com/
// (?:ABC) non-capturing group
const HTML_NAMED_CHAR_REG = /&(?:#x?)?/i;
const HTML_DECIMAL_CHAR_REG = /^&#([0-9]+);?/;
const HTML_HEX_CHAR_REG = /^&#x([0-9a-f]+);?/i;

// 对于允许不带分号的字符集搞两份配置
// 仅处于演示目的，完整的字符集不止这些
const namedCharacterReferences: any = {
  gt: '>',
  'gt;': '>',
  lt: '<',
  'lt;': '<',
  'ltcc;': '⪦',
};

const getMaxLenOfNamedCharacterReferences = getSingle(() => {
  return Math.max(
    ...Object.keys(namedCharacterReferences).map((k) => k.length)
  );
});

export function decodeHtml(rawText: string, asAttr = false) {
  const end = rawText.length;

  // 解码后的文本
  let decodedText = '';
  let maxLenOfNamedChar = getMaxLenOfNamedCharacterReferences();

  let offset = 0;
  function advance(len: number) {
    offset += len;
    rawText = rawText.slice(len);
  }

  while (offset < end) {
    const head = HTML_NAMED_CHAR_REG.exec(rawText);
    // 没有需要解码的内容了
    if (!head) {
      const remaining = end - offset;
      decodedText += rawText.slice(0, remaining);
      advance(remaining);
      break;
    }

    // 截取 & 字符之前的内容添加到decodedText上
    decodedText += rawText.slice(0, head.index);
    // 消费 & 字符之前的内容
    advance(head.index);

    // 命名字符集
    if (head[0] === '&') {
      let name = '';
      let value = '';

      // 字符&的下一个字符必须是ASCII字母或者数字
      if (/[0-9a-z]/i.test(rawText[1])) {
        // 从最大长度开始匹配字符集
        for (let i = maxLenOfNamedChar; i >= 1; i--) {
          name = rawText.slice(1, i);
          if (name in namedCharacterReferences) {
            value = namedCharacterReferences[name];
            break;
          }
        }

        // 解码成功
        if (value) {
          const semi = name.endsWith(';');
          // <a href="foo.html?a=1&lt=2">
          // 历史原因，如果是作为attr来解析 && 不以分号结尾 && 接下来的字符是=0-9a-z则把& 和 name当做普通字符
          // 不解码
          if (
            asAttr &&
            !semi &&
            /[=0-9a-z]/i.test(rawText[name.length + 1] || '')
          ) {
            decodedText += '&' + name;
            advance(name.length + 1);
          } else {
            decodedText += value;
            advance(value.length);
          }
        } else {
          decodedText += '&' + name;
          advance(name.length + 1);
        }
      } else {
        decodedText += '&';
        advance(1);
      }
    } else {
      const hex = head[0] === '&#x' || head[0] === '&#X';
      const pattern = hex ? HTML_HEX_CHAR_REG : HTML_DECIMAL_CHAR_REG;
      const body = pattern.exec(rawText);
      if (body) {
        // https://html.spec.whatwg.org/multipage/parsing.html#numeric-character-reference-end-state
        let cp = Number.parseInt(body[1], hex ? 16 : 10);
        if (cp === 0) {
          cp = 0xfffd;
        } else if (cp > 0x10ffff) {
          cp = 0xfffd;
        } else if (cp >= 0xd800 && cp <= 0xdfff) {
          cp = 0xfffd;
        } else if ((cp >= 0xfdd0 && cp <= 0xfdef) || (cp & 0xfffe) === 0xfffe) {
          // noop
        } else if (
          (cp >= 0x01 && cp <= 0x08) ||
          cp === 0x0b ||
          (cp >= 0x0d && cp <= 0x1f) ||
          (cp >= 0x7f && cp <= 0x9f)
        ) {
          cp = CCR_REPLACEMENTS[cp] || cp;
        }
        decodedText += String.fromCodePoint(cp);
        advance(body[0].length);
      }
    }
  }

  return decodedText;
}

// https://html.spec.whatwg.org/multipage/parsing.html#numeric-character-reference-end-state
const CCR_REPLACEMENTS: Record<number, number | undefined> = {
  0x80: 0x20ac,
  0x82: 0x201a,
  0x83: 0x0192,
  0x84: 0x201e,
  0x85: 0x2026,
  0x86: 0x2020,
  0x87: 0x2021,
  0x88: 0x02c6,
  0x89: 0x2030,
  0x8a: 0x0160,
  0x8b: 0x2039,
  0x8c: 0x0152,
  0x8e: 0x017d,
  0x91: 0x2018,
  0x92: 0x2019,
  0x93: 0x201c,
  0x94: 0x201d,
  0x95: 0x2022,
  0x96: 0x2013,
  0x97: 0x2014,
  0x98: 0x02dc,
  0x99: 0x2122,
  0x9a: 0x0161,
  0x9b: 0x203a,
  0x9c: 0x0153,
  0x9e: 0x017e,
  0x9f: 0x0178,
};

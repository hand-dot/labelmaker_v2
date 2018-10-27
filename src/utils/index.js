export default {
  zenkaku2hankaku(val) {
    if (typeof val !== 'string') return val;
    const regex = /[Ａ-Ｚａ-ｚ０-９！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝]/g;
    return val
      .replace(regex, s => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .replace(/[‐－―−]/g, '-') // ハイフンなど
      .replace(/[～〜]/g, '~') // チルダ
      // スペース;
      .replace(/　/g, ' '); // eslint-disable-line 
  },
  splitByLength(str, length) {
    if (!str || !length || length < 1) {
      return [];
    }
    const regexPattern = new RegExp(
      `(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]){1,${length}}`,
      'g',
    );

    return str.match(regexPattern) || [];
  },
  mm2pt(mm) {
    if (mm === null || isNaN(mm)) throw Error('Error: mm2pt unexpected argument'); // eslint-disable-line 
    // https://www.ddc.co.jp/words/archives/20090701114500.html
    const pointRatio = 2.8346;
    return parseFloat(mm) * pointRatio;
  },
};

export default {
  zenkaku2hankaku(val) {
    if (val === null || val === undefined) return val;
    const regex = /[Ａ-Ｚａ-ｚ０-９！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝]/g;
    return val
      .replace(regex, s => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .replace(/[‐－―−]/g, '-') // ハイフンなど
      .replace(/[～〜]/g, '~') // チルダ
      // スペース;
      .replace(/　/g, ' '); // eslint-disable-line 
  },
};

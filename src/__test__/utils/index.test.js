import utils from '../../utils';

describe('zipcode', () => {
  test('invalid', () => {
    expect(utils.zenkaku2hankaku('０ １ ２ ３ ４ ５ ６ ７ ８ ９')).toEqual('0 1 2 3 4 5 6 7 8 9');
    expect(utils.zenkaku2hankaku('０１２３４５６７８９')).toEqual('0123456789');
    expect(utils.zenkaku2hankaku('ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ')).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    expect(utils.zenkaku2hankaku('ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ')).toEqual('abcdefghijklmnopqrstuvwxyz');
    expect(utils.zenkaku2hankaku('Ａ Ｂ Ｃ Ｄ Ｅ Ｆ Ｇ Ｈ Ｉ Ｊ Ｋ Ｌ Ｍ Ｎ Ｏ Ｐ Ｑ Ｒ Ｓ Ｔ Ｕ Ｖ Ｗ Ｘ Ｙ Ｚ')).toEqual('A B C D E F G H I J K L M N O P Q R S T U V W X Y Z');
    expect(utils.zenkaku2hankaku('ａ ｂ ｃ ｄ ｅ ｆ ｇ ｈ ｉ ｊ ｋ ｌ ｍ ｎ ｏ ｐ ｑ ｒ ｓ ｔ ｕ ｖ ｗ ｘ ｙ ｚ')).toEqual('a b c d e f g h i j k l m n o p q r s t u v w x y z');
    expect(utils.zenkaku2hankaku('！ ＂ ＃ ＄ ％ ＆ ＇ （ ） ＊ ＋ ， － ． ／ ： ； ＜ ＝ ＞ ？ ＠ ［ ＼ ］ ＾ ＿ ｀ ｛ ｜ ｝ ～')).toEqual('! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ ` { | } ~');
    expect(utils.zenkaku2hankaku('！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝～')).toEqual('!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~');
    expect(utils.zenkaku2hankaku(null)).toEqual(null);
    expect(utils.zenkaku2hankaku('')).toEqual('');
    expect(utils.zenkaku2hankaku()).toEqual(undefined);
  });
});

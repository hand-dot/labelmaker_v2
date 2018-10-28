import regexp from '../../utils/regexp';

const zipVaridator = (value, callback) => (value === '' || (value.toString && regexp.zipcode(value.toString())) ? callback(true) : callback(false));

export default [
  {
    title: '[To]郵便番号',
    data: 'to_zip',
    validator: zipVaridator,
  },
  {
    title: '[To]おところ',
    data: 'to_add',
  },
  {
    title: '[To]おなまえ',
    data: 'to_name',
  },
  {
    title: '[To]電話番号',
    data: 'to_tel',
  },
  {
    title: '[From]郵便番号',
    data: 'from_zip',
    validator: zipVaridator,
  },
  {
    title: '[From]おところ',
    data: 'from_add',
  },
  {
    title: '[From]おなまえ',
    data: 'from_name',
  },
  {
    title: '[From]電話番号',
    data: 'from_tel',
  },
  {
    title: '品名',
    data: 'desc',
  },
];

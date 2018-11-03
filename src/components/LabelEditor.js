import React, { Component } from 'react';
import Handsontable from 'handsontable';
import Grid from '@material-ui/core/Grid';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';
import 'handsontable/dist/handsontable.full.min.css';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import NativeSelect from '@material-ui/core/NativeSelect';
import '../styles/handsontable-custom.css';
import '../styles/animation.css';
import templates from '../templates';
import util from '../utils';
import pdfUtil from '../utils/pdf';
import templateUtil from '../utils/template';

const PDF_REFLESH_MS = 100;
const windowSeparatorRatio = window.innerWidth * 0.1;
const emptyIframe = new Blob(['<div>Loading...</div>'], { type: 'text/html' });

const getTemplate = selectedTemplate => templateUtil.fmtTemplate(templates[selectedTemplate]);
const getData = (datas, template) => templateUtil.fmtData(datas, template);

class LabelEditor extends Component {
  constructor(props) {
    super(props);
    this.refleshPdf = debounce(this.refleshPdf, PDF_REFLESH_MS);
    this.hotInstance = null;
    this.state = {
      page: 1,
      selectedTemplate: '宛名8面',
    };
  }

  componentDidMount() {
    const { selectedTemplate } = this.state;
    const template = getTemplate(selectedTemplate);
    if (!this.hotDom) return;
    this.hotInstance = Handsontable(this.hotDom, {
      height: window.innerHeight
       - (this.hotDom ? this.hotDom.getBoundingClientRect().top : 0),
      width: (window.innerWidth / 2) + windowSeparatorRatio - 1,
      rowHeaders: true,
      manualColumnMove: true,
      allowInsertRow: false,
      stretchH: 'all',
      colWidths: 140,
      columns: template.columns,
      dataSchema: template.dataSchema,
      afterChange: (changes) => {
        if (!changes) {
          this.refleshPdf();
          return;
        }
        const needReflech = changes.some((change) => {
          const [,, oldVal, newVal] = change;
          return oldVal !== newVal;
        });
        if (needReflech) this.refleshPdf();
      },
    });
    this.iframe.src = URL.createObjectURL(emptyIframe);
    this.loadSampleData();
  }

  handleChangeTemplate(e) {
    if (!this.hotInstance) return;
    const datas = util.getNotEmptyRowData(this.hotInstance.getSourceData());
    const { selectedTemplate } = this.state;
    const isSampleData = isEqual(datas, getTemplate(selectedTemplate).sampledata);
    if (!isSampleData && !window.confirm('データを変更されていますがテンプレートを変更しますか？')) return;
    const template = getTemplate(e.target.value);
    this.hotInstance.updateSettings({
      columns: template.columns,
      dataSchema: template.dataSchema,
      data: [],
    });
    this.setState({ selectedTemplate: e.target.value, page: 1 }, () => {
      this.loadSampleData();
    });
  }

  handleChangePage(e) {
    const { selectedTemplate, page } = this.state;
    if (!this.hotInstance) return;
    const amount = templateUtil.getLabelLengthInPage(templates[selectedTemplate]) * e.target.value;
    const rowCount = this.hotInstance.getSourceData().length;
    const isRemove = rowCount > amount;
    const arg = isRemove ? ['remove_row', amount, rowCount - amount] : ['insert_row', rowCount, amount - rowCount];
    const [, begin, end] = arg;
    if (isRemove) {
      const removeData = this.hotInstance.getSourceData().slice(begin, begin + end);
      const removeDataHasInput = util.getNotEmptyRowData(removeData).length !== 0;
      if (removeDataHasInput && !window.confirm(`ページを${page}枚から${e.target.value}枚へ減らすと編集したデータが消えますがよろしいですか？`)) {
        return;
      }
    }
    this.hotInstance.alter(...arg);
    this.setState({ page: e.target.value });
    this.refleshPdf();
  }

  async refleshPdf() {
    const { selectedTemplate } = this.state;
    const template = getTemplate(selectedTemplate);
    // FIXME START パフォーマンスが問題になるコード(ローディングを出した方がいい)
    const blob = await pdfUtil.getBlob(
      getData(this.hotInstance.getSourceData(), templates[selectedTemplate]),
      template.image,
      template.position,
    );
    // FIXME ENDパフォーマンスが問題になるコード(ローディングを出した方がいい)
    this.iframe.src = URL.createObjectURL(blob);
  }

  loadSampleData() {
    const { selectedTemplate } = this.state;
    const sampledata = JSON.parse(JSON.stringify(getTemplate(selectedTemplate).sampledata));
    this.hotInstance.loadData(sampledata);
    this.refleshPdf();
  }

  render() {
    const { selectedTemplate, page } = this.state;
    return (
      <Grid container justify="space-between">
        <Grid item xs={6}>
          <div style={{ padding: 5, display: 'flex', alignContent: 'center' }}>
            <FormControl margin="none">
              <InputLabel htmlFor="select-template-helper">テンプレート</InputLabel>
              <NativeSelect
                value={selectedTemplate}
                onChange={this.handleChangeTemplate.bind(this)}
                input={<Input name="template" id="select-template-helper" />}
              >
                {Object.keys(templates).map(_ => (<option key={_} value={_}>{_}</option>))}
              </NativeSelect>
            </FormControl>
            <Typography style={{ display: 'flex', alignItems: 'center', margin: '0 20px' }}>x</Typography>
            <FormControl margin="none">
              <InputLabel htmlFor="select-page-helper">枚数</InputLabel>
              <NativeSelect
                value={page}
                onChange={this.handleChangePage.bind(this)}
                input={<Input name="page" id="select-page-helper" />}
              >
                {[...Array(10).keys()].map(i => i + 1)
                  .map(_ => (<option key={_} value={_}>{_}</option>))}
              </NativeSelect>
            </FormControl>
            <Typography style={{ display: 'flex', alignItems: 'center', marginLeft: 20 }}>
              =
              {' '}
              {templateUtil.getLabelLengthInPage(templates[selectedTemplate]) * page}
              セット
            </Typography>
          </div>
          <div ref={(node) => { this.hotDom = node; }} />
        </Grid>
        <Grid item xs={6}>
          <iframe
            style={{ position: 'fixed', right: 0, border: '1px solid #ccc' }}
            ref={(node) => { this.iframe = node; }}
            height={`${window.innerHeight - (this.iframe ? this.iframe.getBoundingClientRect().top + 5 : 0)}px`}
            width={`${(window.innerWidth / 2) - windowSeparatorRatio}px`}
            title="PDF"
          />
        </Grid>
      </Grid>
    );
  }
}

export default LabelEditor;

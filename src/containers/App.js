import React, { Component } from 'react';
import Handsontable from 'handsontable';
import Grid from '@material-ui/core/Grid';
import debounce from 'lodash.debounce';
import 'handsontable/dist/handsontable.full.min.css';
import Header from '../components/Header';
import TemplateEditor from '../components/TemplateEditor';
import '../styles/handsontable-custom.css';
import '../styles/animation.css';
import templates from '../templates';
import pdfUtil from '../utils/pdf';

const PDF_REFLESH_MS = 500;
const windowSeparatorRatio = window.innerWidth * 0.2;
const emptyIframe = new Blob(['<div>左のテーブルを記入して下さい。</div>'], { type: 'text/html' });

// Hotのデータから全て空の行のデータを除去したものを返します。
const getNotEmptyRowData = sourceData => sourceData.filter(data => Object.keys(data).some(key => data[key])); // eslint-disable-line 

class App extends Component {
  constructor(props) {
    super(props);
    this.hotInstance = null;
    this.state = {
      isTemplateEditor: false, // テンプレート開発者用。公開していません。
      selectedTemplate: 'letterpack',
    };
  }

  componentDidMount() {
    const { selectedTemplate } = this.state;
    if (!this.hotDom) return;
    this.hotInstance = Handsontable(this.hotDom, {
      height: window.innerHeight - (this.hotContainer ? this.hotContainer.getBoundingClientRect().top : 0),
      width: (window.innerWidth / 2) + windowSeparatorRatio,
      rowHeaders: true,
      minRows: 50,
      colWidths: 200,
      columns: templates[selectedTemplate].columns,
      dataSchema: templates[selectedTemplate].dataSchema,
      afterChange: debounce(() => {
        this.refleshPdf();
      }, PDF_REFLESH_MS),
    });
    this.iframe.src = URL.createObjectURL(emptyIframe);
    setTimeout(() => {
      this.loadSampleData();
    }, 4000); // FIXME 読み込みを待ってからじゃないとpdfmakeで落ちる
  }

  handleChangeTemplate(e) {
    if (!this.hotInstance) return;
    const datas = getNotEmptyRowData(this.hotInstance.getSourceData());
    if (datas.length !== 0 && !window.confirm('データがすでに入力されていますがテンプレートを変更しますか？')) return;
    const selectedTemplate = e.target.value;
    this.hotInstance.updateSettings({
      columns: templates[selectedTemplate].columns,
      dataSchema: templates[selectedTemplate].dataSchema,
      data: [],
    });
    this.setState({ selectedTemplate });
    setTimeout(() => { this.loadSampleData(); });
  }

  async refleshPdf() {
    const { selectedTemplate } = this.state;
    const datas = getNotEmptyRowData(this.hotInstance.getSourceData());
    const blob = await pdfUtil.getBlob(datas, templates[selectedTemplate].image, templates[selectedTemplate].position);
    this.iframe.src = URL.createObjectURL(blob);
  }

  loadSampleData() {
    const { selectedTemplate } = this.state;
    const sampledata = JSON.parse(JSON.stringify(templates[selectedTemplate].sampledata));
    this.hotInstance.loadData(sampledata);
  }

  render() {
    const { isTemplateEditor, selectedTemplate } = this.state;
    return (
      <>
        <Header
          template={selectedTemplate}
          templates={Object.keys(templates)}
          handleChangeTemplate={this.handleChangeTemplate.bind(this)}
        />
        <div style={{ marginBottom: 64 }} />
        {isTemplateEditor && <TemplateEditor />}
        {!isTemplateEditor && (
        <Grid container justify="space-between">
          <Grid item xs={6}>
            <div ref={(node) => { this.hotContainer = node; }}>
              <div ref={(node) => { this.hotDom = node; }} />
            </div>
          </Grid>
          <Grid item xs={6}>
            <iframe
              style={{ position: 'fixed', right: 0, border: '1px solid #ccc' }}
              ref={(node) => { this.iframe = node; }}
              height={`${window.innerHeight - (this.iframe ? this.iframe.getBoundingClientRect().top + 5 : 0)}px`}
              width={`${(window.innerWidth / 2) - windowSeparatorRatio}px`}
              id="pdfIframe"
              title="PDF"
            />
          </Grid>
        </Grid>
        )}
      </>
    );
  }
}

export default App;

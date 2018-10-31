import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import debounce from 'lodash.debounce';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import TextField from '@material-ui/core/TextField';
import '../styles/handsontable-custom.css';
import pdfUtil from '../utils/pdf';
import util from '../utils';

// このコンポーネントはテンプレート開発者用。公開していません。
const PDF_REFLESH_MS = 10;
const windowSeparatorRatio = window.innerWidth * 0.2;
const template = {};

const hotColumns = [
  { data: 'Column', title: 'Column' },
  {
    data: 'x(mm)', title: 'x(mm)', width: 80, type: 'numeric',
  },
  {
    data: 'y(mm)', title: 'y(mm)', width: 80, type: 'numeric',
  },
  {
    data: 'size(pt)', title: 'size(pt)', width: 80, type: 'numeric',
  },
  {
    data: 'space(pt)', title: 'space(pt)', width: 80, type: 'numeric',
  },
  {
    data: 'line-height(em)', title: 'line-height(em)', width: 120, type: 'numeric',
  },
  { data: 'SampleData', title: 'SampleData' },
];

const downloadTemplate = (templateName) => {
  const blob = new Blob([JSON.stringify(template)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${templateName}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const setIframe = async (pdfData, base64, positionData) => {
  const blob = await pdfUtil.getBlob(pdfData, base64, positionData);
  document.getElementById('pdfIframe').src = URL.createObjectURL(blob);
};

const setTemplate = (pdfData, image, positionData) => {
  template.sampledata = pdfData;
  template.position = positionData;
  template.image = image;
  template.columns = Object.keys(pdfData[0]).map(key => ({ data: key, title: key }));
  const dataSchema = {};
  Object.keys(pdfData[0]).forEach((key) => { dataSchema[key] = null; });
  template.dataSchema = dataSchema;
};

const formatTemplate2State = ({
  templateName, image, columns, sampledata, position,
}) => {
  const datas = [];
  columns.forEach((column) => {
    const key = column.data;
    const data = {
      Column: key,
      'x(mm)': position[key].position.x,
      'y(mm)': position[key].position.y,
      'size(pt)': position[key].size,
      'space(pt)': position[key].space,
      'line-height(em)': position[key].lineHeight,
      SampleData: sampledata[0][key],
    };
    datas.push(data);
  });
  return { templateName: templateName || '', image: image || null, datas };
};

const refleshPdf = debounce((datas, image) => {
  const pdfData = [{}];
  const positionData = {};
  datas.forEach((data) => {
    pdfData[0][data.Column] = data.SampleData;
    positionData[data.Column] = {
      position: { x: +data['x(mm)'], y: +data['y(mm)'] },
      size: +data['size(pt)'],
      space: +data['space(pt)'],
      lineHeight: +data['line-height(em)'],
    };
  });
  setTemplate(pdfData, image, positionData);
  setIframe(pdfData, image, positionData);
}, PDF_REFLESH_MS);

class TemplateEditor extends Component {
  constructor(props) {
    super(props);
    this.hotInstance = null;
    this.state = {
      templateName: '',
      image: null,
    };
  }

  componentDidMount() {
    if (!this.hotDom) return;
    this.hotInstance = Handsontable(this.hotDom, {
      height: window.innerHeight
       - (this.hotDom ? this.hotDom.getBoundingClientRect().top : 0),
      width: (window.innerWidth / 2) + windowSeparatorRatio - 1,
      rowHeaders: true,
      minRows: 50,
      colWidths: (((window.innerWidth / 2) + windowSeparatorRatio - 55)
       - hotColumns.reduce((num, column) => {
        num += column.width || 0; // eslint-disable-line 
         return num;
       }, 0)) / 2,
      columns: hotColumns,
      dataSchema: {
        Column: '', 'x(mm)': 0, 'y(mm)': 0, 'size(pt)': 18, 'space(pt)': 0, 'line-height(em)': 1, SampleData: '',
      },
      afterChange: debounce((changes) => {
        if (!changes) return;
        const needReflech = changes.some((change) => {
          const [,, oldVal, newVal] = change;
          return oldVal !== newVal;
        });
        if (needReflech) {
          const { image } = this.state;
          refleshPdf(util.getNotEmptyRowData(this.hotInstance.getSourceData()), image);
        }
      }, PDF_REFLESH_MS),
    });
    this.forceUpdate(); // this.iframeを再計算させる
    const blob = new Blob(['<div>左のテンプレートを編集して下さい。</div>'], { type: 'text/html' });
    this.iframe.src = URL.createObjectURL(blob);
  }

  handleChangeTemplateName(e) {
    this.setState({ templateName: e.target.value });
    template.templateName = e.target.value;
  }

  handleChangeImage(event) {
     const files = event.target.files; // eslint-disable-line
    const fileReader = new FileReader();
    fileReader.addEventListener('load', (e) => {
       this.setState({ image: e.target.result }); // eslint-disable-line
      refleshPdf(util.getNotEmptyRowData(this.hotInstance.getSourceData()), e.target.result);
    });
    fileReader.readAsDataURL(files[0]);
  }

  handleChangeTemplate(event) {
    const files = event.target.files; // eslint-disable-line
    const fileReader = new FileReader();
    fileReader.addEventListener('load', (e) => {
        const {templateName, image, datas} = formatTemplate2State(JSON.parse(e.target.result)); // eslint-disable-line
      this.hotInstance.updateSettings({ data: datas });
        this.setState({ templateName: templateName, image }); // eslint-disable-line
      refleshPdf(datas, image);
    });
    fileReader.readAsText(files[0]);
  }

  render() {
    const { templateName } = this.state;
    return (
      <Grid container justify="space-between">
        <Grid item xs={6}>
          <TextField
            style={{ margin: 10 }}
            label="templateName"
            value={templateName}
            onChange={this.handleChangeTemplateName.bind(this)}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
          <div style={{
            padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'bottom',
          }}
          >
            <label htmlFor="image">
              Image:
              <input id="image" type="file" accept="image/*" ref={(node) => { this.fileInput = node; }} onChange={this.handleChangeImage.bind(this)} />
            </label>
            <label htmlFor="importTemplate">
              Load:
              <input id="importTemplate" type="file" accept="application/json" ref={(node) => { this.fileInput = node; }} onChange={this.handleChangeTemplate.bind(this)} />
            </label>
            <button type="button" onClick={(() => { downloadTemplate(templateName); })}>Download</button>
          </div>
          <div ref={(node) => { this.hotDom = node; }} />
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
    );
  }
}

export default TemplateEditor;

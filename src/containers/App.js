import React, { Component } from 'react';
import Handsontable from 'handsontable';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import debounce from 'lodash.debounce';
import 'handsontable/dist/handsontable.full.min.css';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import Header from '../components/Header';
import TemplateEditor from '../components/TemplateEditor';
import '../styles/handsontable-custom.css';
import '../styles/animation.css';
import templates from '../templates';
import pdfUtil from '../utils/pdf';
import templateUtil from '../utils/template';

const PDF_REFLESH_MS = 100;
const windowSeparatorRatio = window.innerWidth * 0.2;
const emptyIframe = new Blob(['<div>Loading...</div>'], { type: 'text/html' });

const getTemplate = selectedTemplate => templateUtil.fmtTemplate(templates[selectedTemplate]);
const getData = (datas, template) => templateUtil.fmtData(datas, template);
// Hotのデータから全て空の行のデータを除去したものを返します。
const getNotEmptyRowData = sourceData => sourceData.filter(data => Object.keys(data).some(key => data[key])); // eslint-disable-line 

const styles = {};
class App extends Component {
  constructor(props) {
    super(props);
    this.hotInstance = null;
    this.state = {
      isTemplateEditor: false, // テンプレート開発者用。公開していません。
      selectedTemplate: 'レターパック',
    };
  }

  componentDidMount() {
    const { selectedTemplate } = this.state;
    if (!this.hotDom) return;
    this.hotInstance = Handsontable(this.hotDom, {
      height: window.innerHeight
       - (this.hotContainer ? this.hotContainer.getBoundingClientRect().top : 0),
      width: (window.innerWidth / 2) + windowSeparatorRatio - 1,
      rowHeaders: true,
      contextMenu: true,
      colWidths: 150,
      columns: getTemplate(selectedTemplate).columns,
      dataSchema: getTemplate(selectedTemplate).dataSchema,
      afterChange: debounce(() => {
        this.refleshPdf();
      }, PDF_REFLESH_MS),
    });
    this.iframe.src = URL.createObjectURL(emptyIframe);
    this.loadSampleData();
  }

  handleChangeTemplate(e) {
    if (!this.hotInstance) return;
    const datas = getNotEmptyRowData(this.hotInstance.getSourceData());
    if (datas.length !== 0 && !window.confirm('データがすでに入力されていますがテンプレートを変更しますか？')) return;
    const selectedTemplate = e.target.value;
    this.hotInstance.updateSettings({
      columns: getTemplate(selectedTemplate).columns,
      dataSchema: getTemplate(selectedTemplate).dataSchema,
      data: [],
    });
    this.setState({ selectedTemplate });
    setTimeout(() => { this.loadSampleData(); });
  }

  async refleshPdf() {
    const { selectedTemplate } = this.state;
    const blob = await pdfUtil.getBlob(
      getData(this.hotInstance.getSourceData(), templates[selectedTemplate]),
      getTemplate(selectedTemplate).image,
      getTemplate(selectedTemplate).position,
    );
    this.iframe.src = URL.createObjectURL(blob);
  }

  loadSampleData() {
    const { selectedTemplate } = this.state;
    const sampledata = JSON.parse(JSON.stringify(getTemplate(selectedTemplate).sampledata));
    this.hotInstance.loadData(sampledata);
  }

  addRow() {
    if (!this.hotInstance) return;
    const { selectedTemplate } = this.state;
    const amount = templateUtil.getLabelLengthInPage(templates[selectedTemplate]);
    const rowNum = this.hotInstance.getSourceData().length;
    this.hotInstance.alter('insert_row', rowNum, amount);
    this.refleshPdf();
  }

  render() {
    const { theme } = this.props;
    const { isTemplateEditor, selectedTemplate } = this.state;
    return (
      <>
        <Header />
        <div style={{ height: theme.mixins.toolbar.minHeight }} />
        {isTemplateEditor && <TemplateEditor />}
        {!isTemplateEditor && (
        <Grid container justify="space-between">
          <Grid item xs={6}>
            <div style={{
              padding: 5, display: 'flex', justifyContent: 'row', alignContent: 'center',
            }}
            >
              <FormControl>
                <InputLabel htmlFor="select-template-helper">テンプレート</InputLabel>
                <NativeSelect
                  value={selectedTemplate}
                  onChange={this.handleChangeTemplate.bind(this)}
                  input={<Input name="age" id="select-template-helper" />}
                >
                  {Object.keys(templates).map(_ => (<option key={_} value={_}>{_}</option>))}
                </NativeSelect>
              </FormControl>
              <Button onClick={this.addRow.bind(this)}>+</Button>
            </div>
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

App.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line
  theme: PropTypes.object.isRequired, // eslint-disable-line
};

export default withStyles(styles, { withTheme: true })(App);

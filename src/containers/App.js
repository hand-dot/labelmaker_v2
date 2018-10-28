import React, { Component } from 'react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import Header from '../components/Header';
import Controls from '../components/Controls';
import TemplateEditor from '../components/TemplateEditor';
import Modal from '../components/Modal';
import { Title, Contents, Action } from '../components/ModalContents/PdfCreated';

import '../styles/handsontable-custom.css';
import '../styles/animation.css';
import templates from '../templates';

import util from '../utils';
import pdfUtil from '../utils/pdf';

// Hotのデータから全て空の行のデータを除去したものを返します。
const getNotEmptyRowData = sourceData => sourceData.filter(data => Object.keys(data).some(key => data[key])); // eslint-disable-line 

// 全角文字を半角にして、おところのカラムで改行の無い、長すぎる(26文字)文字列に改行を挿入する
const formatData = datas => datas.map((data) => {
  const clonedData = JSON.parse(JSON.stringify(data));
  Object.keys(clonedData).forEach((key) => {
    const text = util.zenkaku2hankaku(data[key]);
    if (key === ('to_add' || 'from_add') && !/\n/g.test(data[key])) {
      clonedData[key] = util.splitByLength(text, 26).join('\n');
    }
  });
  return clonedData;
});

class App extends Component {
  constructor(props) {
    super(props);
    this.hotInstance = null;
    this.state = {
      isOpenModal: false,
      isTemplateEditor: false, // テンプレート開発者用。公開していません。
      selectedTemplate: 'letterpack',
    };
  }

  componentDidMount() {
    const { selectedTemplate } = this.state;
    if (!this.hotDom) return;
    this.hotInstance = new Handsontable(this.hotDom, {
      rowHeaders: true,
      stretchH: 'all',
      minRows: 50,
      colWidths: Math.round(window.innerWidth / templates[selectedTemplate].columns.length) - 50,
      columns: templates[selectedTemplate].columns,
      dataSchema: templates[selectedTemplate].dataSchema,
    });
  }

  handleOpenModal = () => {
    this.setState({ isOpenModal: true });
  };

  handleCloseModal = () => {
    this.setState({ isOpenModal: false });
  };

  loadSampleData() {
    const { selectedTemplate } = this.state;
    if (!this.hotInstance) return;
    const datas = getNotEmptyRowData(this.hotInstance.getSourceData());
    if (datas.length !== 0 && !window.confirm('データがすでに入力されていますがサンプルを読み込みますか？')) return;
    const sampledata = JSON.parse(JSON.stringify(templates[selectedTemplate].sampledata));
    this.hotInstance.loadData(sampledata);
  }

  async createPdf() {
    const { selectedTemplate } = this.state;
    if (!this.hotInstance) return;
    const datas = getNotEmptyRowData(this.hotInstance.getSourceData());
    if (datas.length === 0) {
      alert('入力がありません。\n出来上がりを確認したい場合はサンプルを読み込んでもう一度作成して下さい。');
      return;
    }
    const blob = await pdfUtil.create(formatData(datas),
      templates[selectedTemplate].image, templates[selectedTemplate].position);
    if (pdfUtil.open(blob)) {
      this.handleOpenModal();
    } else {
      alert('すみません！失敗しました！\nChromeでもう一度やり直してください。\nそれでもできない場合はフィードバックから現象を教えて下さい！');
    }
  }

  render() {
    const { isTemplateEditor, isOpenModal, selectedTemplate } = this.state;
    return (
      <>
        <Header />

        {isTemplateEditor && <TemplateEditor />}
        {!isTemplateEditor && (<><Controls
          loadSampleData={this.loadSampleData.bind(this)}
          createPdf={this.createPdf.bind(this)}
        />
          <div ref={(node) => { this.hotDom = node; }} /></>)}

        <Modal
          open={isOpenModal}
          onClose={this.handleCloseModal.bind(this)}
          title={(<Title />)}
          action={(<Action onClick={this.handleCloseModal} />)}
        >
          <Contents selectedTemplate={selectedTemplate} />
        </Modal>
      </>
    );
  }
}

export default App;

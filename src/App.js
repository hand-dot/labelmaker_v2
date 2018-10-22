import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import './styles/handsontable-custom.css';
import templates from './templates';

import pdfUtil from './utils/pdf';

class App extends Component {
  constructor(props) {
    super(props);
    this.hotInstance = null;
    this.state = {
      selectedTemplate: 'letterpack',
    };
  }

  componentDidMount() {
    const { selectedTemplate } = this.state;
    this.hotInstance = new Handsontable(this.hotDom, {
      rowHeaders: true,
      stretchH: 'all',
      minRows: 50,
      colWidths: Math.round(window.innerWidth / templates[selectedTemplate].columns.length) - 50,
      columns: templates[selectedTemplate].columns,
      dataSchema: templates[selectedTemplate].dataSchema,
    });
  }

  loadSampleData() {
    const { selectedTemplate } = this.state;
    if (this.hotInstance) {
      const sampledata = JSON.parse(JSON.stringify(templates[selectedTemplate].sampledata));
      this.hotInstance.loadData(sampledata);
    }
  }

  async createPdf() {
    const { selectedTemplate } = this.state;
    if (this.hotInstance) {
      const sourceData = this.hotInstance.getSourceData();
      const extractNonNullData = sourceData.filter(data => Object.keys(data).some(key => data[key]));
      if (extractNonNullData.length === 0) {
        alert('入力がありません。');
        return;
      }
      const blob = await pdfUtil.create(extractNonNullData, templates[selectedTemplate].image, templates[selectedTemplate].position);
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    }
  }

  render() {
    return (
      <div>
        <Grid
          container
          alignContent="center"
          alignItems="center"
          justify="space-between"
          style={{ padding: '0 5px' }}
        >
          <Grid item xs={12}>
            <h1 style={{ fontSize: '1.3rem' }}>レターパック ラベルを一気に作成！</h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ fontSize: '0.8rem', margin: 5, display: 'inline-block' }}>モチベーション維持のため拡散や紹介してくれると嬉しいです。</p>
              <a style={{ marginTop: 10 }} href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-show-count="false">Tweet</a>
            </div>
          </Grid>
          <Grid item xs={12} sm={9}>
            <p style={{ fontSize: '0.8rem' }}>
              <strong>Chrome,Safari,Firefox</strong>
              で動作し、個人情報を送信しません。
              <br />
              エクセルと同等の操作が可能で、alt+Enterで改行や全選択やオートフィルにも対応しています。
              <br />
            また、エクセルからもしくはエクセルへのコピペにも対応しています。
              <span style={{ fontSize: '0.65rem', color: '#999', marginTop: 0.5 }}>*全角数字利用不可/郵便番号は半角数字7桁</span>
            </p>
          </Grid>
          <Grid item xs={6} sm={2}>
            <button style={{ display: 'block', margin: '0 auto' }} type="button" onClick={this.loadSampleData.bind(this)}>
              サンプル読込
            </button>
          </Grid>
          <Grid item xs={6} sm={1}>
            <button style={{ display: 'block', margin: '0 auto' }} type="submit" onClick={this.createPdf.bind(this)}>作成</button>
          </Grid>
        </Grid>
        <div ref={(node) => { this.hotDom = node; }} />
      </div>
    );
  }
}

export default App;

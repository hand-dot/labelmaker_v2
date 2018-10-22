import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Notifications from '@material-ui/icons/Notifications';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import './styles/handsontable-custom.css';
import templates from './templates';

import pdfUtil from './utils/pdf';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
};

const extractNullData = sourceData => sourceData.filter(data => Object.keys(data).some(key => data[key]));


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
      const notNullData = extractNullData(this.hotInstance.getSourceData());
      if (notNullData.length !== 0 && !window.confirm('データがすでに入力されていますがサンプルを読み込みますか？')) {
        return;
      }
      const sampledata = JSON.parse(JSON.stringify(templates[selectedTemplate].sampledata));
      this.hotInstance.loadData(sampledata);
    }
  }

  async createPdf() {
    const { selectedTemplate } = this.state;
    if (this.hotInstance) {
      const notNullData = extractNullData(this.hotInstance.getSourceData());
      if (notNullData.length === 0) {
        alert('入力がありません。');
        return;
      }
      const blob = await pdfUtil.create(notNullData, templates[selectedTemplate].image, templates[selectedTemplate].position);
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="subtitle1" color="inherit" className={classes.grow}>
              レターパックラベルを一括作成！
            </Typography>
            <IconButton color="inherit">
              <Notifications />
              <span style={{ position: 'absolute', left: 15, top: 15 }} id="changelog" />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Grid
          container
          spacing={8}
          alignContent="center"
          alignItems="center"
          justify="space-between"
          style={{ padding: '10px 0' }}
        >
          {/* <Grid item xs={12}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ fontSize: '0.8rem', margin: 5, display: 'inline-block' }}>モチベーション維持のため拡散や紹介してくれると嬉しいです。</p>
              <a style={{ marginTop: 10 }} href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-show-count="false">Tweet</a>
            </div>
          </Grid> */}
          <Grid item xs={12} sm={5}>
            <Typography variant="caption">
              ・
              <strong>Chrome,Safari,Firefox</strong>
              で動作し、個人情報を送信しません。
              <br />
              ・エクセルと同等の操作やショートカット利用可能。
              <br />
              ・エクセルからもしくはエクセルへのコピペにも対応。
            </Typography>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Typography variant="caption">
              ＊全角数字利用不可
              <br />
              ＊郵便番号は半角数字7桁
              <br />
              ＊おところが長い場合はAltを押しながらEnterを押すと改行できます。
              <br />
            </Typography>
          </Grid>
          <Grid item xs={6} sm={1}>
            <Button style={{ display: 'block', margin: '0 auto' }} variant="outlined" size="small" color="primary" onClick={this.loadSampleData.bind(this)}>
              サンプル
            </Button>
          </Grid>
          <Grid item xs={6} sm={1}>
            <Button style={{ display: 'block', margin: '0 auto' }} variant="outlined" size="small" color="primary" onClick={this.createPdf.bind(this)}>作成</Button>
          </Grid>
        </Grid>
        <div ref={(node) => { this.hotDom = node; }} />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line 
};

export default withStyles(styles)(App);

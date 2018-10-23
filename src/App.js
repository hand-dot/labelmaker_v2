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
import Modal from '@material-ui/core/Modal';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import './styles/handsontable-custom.css';
import './styles/animation.css';
import templates from './templates';

import pdfUtil from './utils/pdf';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  paper: {
    position: 'absolute',
    maxWidth: '100%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    margin: `${theme.spacing.unit * 4}px auto`,
  },
});

const extractNullData = sourceData => sourceData.filter(data => Object.keys(data).some(key => data[key]));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

class App extends Component {
  constructor(props) {
    super(props);
    this.hotInstance = null;
    this.state = {
      isOpenModal: false,
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

  handleOpenModal = () => {
    this.setState({ isOpenModal: true });
  };

  handleCloseModal = () => {
    this.setState({ isOpenModal: false });
  };


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
        alert('入力がありません。\n出来上がりを確認したい場合はサンプルを読み込んでもう一度作成して下さい。');
        return;
      }
      const blob = await pdfUtil.create(notNullData, templates[selectedTemplate].image, templates[selectedTemplate].position);
      let result = false;
      if (window.navigator.msSaveBlob) {
        result = window.navigator.msSaveOrOpenBlob(blob, `${Date.now()}.pdf`);
      } else {
        result = window.open(window.URL.createObjectURL(blob));
      }
      if (result) {
        this.handleOpenModal();
      } else {
        alert('すみません！失敗しました！\nChromeでもう一度やり直してください。\nそれでもできない場合はフィードバックから現象を教えて下さい！');
      }
    }
  }

  render() {
    const { isOpenModal, selectedTemplate } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
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
          <Grid item xs={12} sm={5}>
            <Typography style={{ marginLeft: 5 }} variant="caption">
              ・動作環境
              <strong>Chrome,Safari,Firefox,IE11,Edge</strong>
              <br />
              ・入力情報を送信しないため安全
              <br />
              ・エクセルと同等の操作やショートカット利用可能
              <br />
              ・エクセルからもしくはエクセルへのコピペにも対応
            </Typography>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Typography style={{ marginLeft: 5 }} variant="caption">
              ＊全角数字利用不可
              <br />
              ＊郵便番号は半角数字7桁
              <br />
              ＊おところが長い場合はAltを押しながらEnterを押すと改行可能
              <br />
              ＊とりあえずサンプルを読み込んで作成を押してみてください！
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
        {/* Modal */}
        <Modal
          aria-labelledby="created-modal-title"
          aria-describedby="created-modal-description"
          open={isOpenModal}
          onClose={this.handleCloseModal}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
              <Typography style={{ animation: 'good 0.9s linear 0s 3' }} variant="h5" id="modal-title">
                <span role="img" aria-label="Help">
                👍
                </span>
              </Typography>
              <Typography variant="h5">
              いいね！
              </Typography>
            </div>
            <Typography>
              使ってくれてありがとう！あとは保存してA4で印刷すればOK！
            </Typography>
            <img src={templates[selectedTemplate].photo} alt={`${selectedTemplate}の写真`} style={{ maxWidth: '100%' }} />
            <Typography>
              気に入ってもらえたら同僚や友達に紹介して欲しいです!
              <br />
              また、右のフィードバックから感想やアイデア,改善の提案なども募集しています🙏
              <br />
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" size="small" color="primary" onClick={this.handleCloseModal}>OK</Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line 
};

export default withStyles(styles)(App);

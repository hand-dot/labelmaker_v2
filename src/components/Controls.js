import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
  grow: {
    flexGrow: 1,
  },
};

function Controls(props) {
  const { loadSampleData, createPdf } = props;
  return (
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
        <Button style={{ display: 'block', margin: '0 auto' }} variant="outlined" size="small" color="primary" onClick={loadSampleData}>
          サンプル
        </Button>
      </Grid>
      <Grid item xs={6} sm={1}>
        <Button style={{ display: 'block', margin: '0 auto' }} variant="outlined" size="small" color="primary" onClick={createPdf}>作成</Button>
      </Grid>
    </Grid>
  );
}

Controls.propTypes = {
  loadSampleData: PropTypes.func.isRequired,
  createPdf: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired, // eslint-disable-line
  theme: PropTypes.object.isRequired, // eslint-disable-line
};

export default withStyles(styles, { withTheme: true })(Controls);

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export const Title = () => (
      <>
        <Typography style={{ animation: 'good 0.9s linear 0s 3' }} variant="h5" id="modal-title">
          <span role="img" aria-label="Help">
          👍
          </span>
        </Typography>
        <Typography variant="h5">
        いいね！
        </Typography>
    </>
);

export const Contents = () => (
    <>
      <Typography>
        使ってくれてありがとう！あとは保存してA4で印刷すればOK！
      </Typography>
      <Typography>
        うまくいきましたか？右のフィードバックから不具合の報告,
        <br />
        アイデア,改善の提案なども募集しています
        <span role="img" aria-label="Help">
        🙏
        </span>
        <br />
        気に入ってもらえたら同僚や友達に紹介して欲しいです!
      </Typography>
    </>
);

export const Action = ({ onClick }) => (
  <Button variant="outlined" size="small" color="primary" onClick={onClick}>OK</Button>
);

Action.propTypes = {
  onClick: PropTypes.func.isRequired,
};

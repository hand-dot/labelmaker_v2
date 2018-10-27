import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import templates from '../../../templates';


function Contents(props) {
  const { selectedTemplate } = props;
  return (
    <>
      <Typography>
        使ってくれてありがとう！あとは保存してA4で印刷すればOK！
      </Typography>
      <img src={templates[selectedTemplate].photo} alt={`${selectedTemplate}の写真`} style={{ maxWidth: '100%' }} />
      <Typography>
        うまくいきましたか？右のフィードバックから不具合の報告,アイデア,改善の提案なども募集しています
        <span role="img" aria-label="Help">
        🙏
        </span>
        <br />
        気に入ってもらえたら同僚や友達に紹介して欲しいです!
      </Typography>
    </>
  );
}

Contents.propTypes = {
  selectedTemplate: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired, // eslint-disable-line
  theme: PropTypes.object.isRequired, // eslint-disable-line
};

export default Contents;

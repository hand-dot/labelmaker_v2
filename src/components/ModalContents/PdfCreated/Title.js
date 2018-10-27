import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

function Title() {
  return (
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
}

Title.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line
  theme: PropTypes.object.isRequired, // eslint-disable-line
};

export default Title;

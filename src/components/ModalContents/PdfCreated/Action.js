import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

function Action(props) {
  const { onClick } = props;
  return (
    <Button
      variant="outlined"
      size="small"
      color="primary"
      onClick={onClick}
    >
    OK
    </Button>
  );
}

Action.propTypes = {
  onClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired, // eslint-disable-line
  theme: PropTypes.object.isRequired, // eslint-disable-line
};

export default Action;

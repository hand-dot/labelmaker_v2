import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

const styles = theme => ({
  paper: {
    position: 'absolute',
    maxWidth: '100%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

const getModalStyle = () => {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
};

function MyModal(props) {
  const {
    classes, children, title, action, open, onClose,
  } = props;
  return (
    <Modal
      aria-labelledby="finish-modal-title"
      aria-describedby="finish-modal-description"
      open={open}
      onClose={onClose}
    >
      <div style={getModalStyle()} className={classes.paper}>
        <div style={{ display: 'flex', marginBottom: '1rem' }}>
          {title}
        </div>
        {children}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          {action}
        </div>
      </div>
    </Modal>
  );
}

MyModal.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.element.isRequired,
  action: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired, // eslint-disable-line
  theme: PropTypes.object.isRequired, // eslint-disable-line
};

export default withStyles(styles, { withTheme: true })(MyModal);

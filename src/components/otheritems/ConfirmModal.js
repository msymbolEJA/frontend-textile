import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { FormattedMessage } from "react-intl";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmDialog({
  handleConfirm,
  selectedItem,
  setSelectedItem
}) {
  const handleClose = () => {
    setSelectedItem(false);
  };

  return (
    <div>
      <Dialog
        open={selectedItem?.id ? true : false}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          <FormattedMessage id="attention" defaultMessage="Attention" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <FormattedMessage
              id="areYouSure"
              defaultMessage="Are you sure?"
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="primary">
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="secondary">
            <FormattedMessage id={selectedItem?.action ? selectedItem?.action : 'confirm'} defaultMessage="Confirm" />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

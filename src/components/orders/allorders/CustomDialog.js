import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { useIntl } from "react-intl";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

export default function AlertDialog({ open, handleDialogClose, dialog }) {
  const { formatMessage } = useIntl();

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {dialog?.id ? (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialog?.id} -{" "}
            {formatMessage({
              id: "status",
            })}
            :
            {formatMessage({
              id: dialog?.statu || "-",
              defaultMessage: dialog?.statu || "-",
            })}
            <br />
            {formatMessage({
              id: "statusNotInProgress",
            })}
          </DialogContentText>
        </DialogContent>
      ) : null}
      <DialogActions>
        <Button onClick={handleDialogClose} color="primary" autoFocus>
          {formatMessage({
            id: "ok",
          })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

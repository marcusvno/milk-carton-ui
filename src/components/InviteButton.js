import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  IconButton,
  TextField,
  Snackbar,
} from "@mui/material/";
import MuiAlert from "@mui/material/Alert";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function InviteButton({ listID, authID }) {
  const [open, setOpen] = React.useState(false);
  const [openBar, setOpenBar] = React.useState(false);
  const inviteLink = `https://forgotmilk.netlify.app/invite/${listID}/${authID}/`;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCopy = (e) => {
    navigator.clipboard.writeText(inviteLink);
    setOpen(false);
    setOpenBar(true);
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen} sx={{ mr: 1.5 }}>
        <PersonAddIcon />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Invite Link</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Click button to copy the link. Share it with someone to invite them
            to edit list!
          </DialogContentText>
          <br />
          <TextField
            defaultValue={inviteLink}
            size="small"
            sx={{ color: "blue" }}
            inputProps={{ readOnly: true }}
          />{" "}
          <IconButton onClick={(e) => handleCopy(e)}>
            <ContentCopyIcon sx={{ color: "black" }} />
          </IconButton>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openBar}
        onClose={() => setOpenBar(false)}
        autoHideDuration={2000}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </div>
  );
}

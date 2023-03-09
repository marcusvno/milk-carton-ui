import { useState } from "react";
import * as React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { Stack } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function SendItems({ items, setItems, token, listID, scroll }) {
  const [textInput, setTextInput] = useState("");
  const [addedItem, setAddedItem] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let validEntry = true;
    if (addedItem.trim() === "") {
      setOpen(true);
      validEntry = false;
    }
    if (validEntry) {
      axios
        .post(
          `https://safe-plains-62725.herokuapp.com/items/`,
          {
            list_for_items: `${listID}`,
            item: `${addedItem}`,
          },
          {
            headers: {
              authorization: `token ${token}`,
            },
          }
        )
        .then((res) => {
          setItems([...items, res.data]);
          setTextInput("");
          setAddedItem("");
          validEntry = false;
          scroll.current.scrollIntoView({ behavior: "smooth" });
        });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleText = (e) => {
    e.preventDefault();
    setTextInput(e.target.value);
    setAddedItem(e.target.value);
  };

  return (
    <div className="item-entry">
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Please enter a valid item!
        </Alert>
      </Snackbar>
      <form className="send-item-input">
        <label htmlFor="messageInput" hidden>
          Enter Item
        </label>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <TextField
            size="small"
            required
            id="list"
            label="Add Item"
            onChange={handleText}
            value={textInput}
            autoFocus
            autoComplete="off"
          />
          <Button type="submit" variant="contained" onClick={handleSubmit}>
            Add
          </Button>
        </Stack>
      </form>
    </div>
  );
}

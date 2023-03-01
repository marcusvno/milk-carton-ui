import { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { Stack } from "@mui/material";

export function SendItems({ items, setItems, token, listID }) {
  const [textInput, setTextInput] = useState("");
  const [addedItem, setAddedItem] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (addedItem.trim() === "") {
      alert("Enter valid message");
      return;
    }
    // setItems([...items, addedItem]);
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
        // console.log(items);
      });

    setTextInput("");
    setAddedItem("");
  };

  const handleText = (e) => {
    e.preventDefault();
    setTextInput(e.target.value);
    setAddedItem(e.target.value);
  };

  return (
    <div className="item-entry">
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
            autoFocus
          />
          <Button type="submit" variant="contained" onClick={handleSubmit}>
            Add
          </Button>
        </Stack>
      </form>
    </div>
  );
}

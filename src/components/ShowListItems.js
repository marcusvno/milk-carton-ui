import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DeleteItem from "./DeleteItem";
import FlagIcon from "@mui/icons-material/Flag";
import { IconButton } from "@mui/material";
import { useLocation } from "react-router";

export function ShowListItems({
  items,
  setItems,
  token,
  listID,
  scroll,
  archiveStatus,
  owner,
  username,
  shoppingStatus,
}) {
  const location = useLocation();

  //console.log(shoppingStatus);
  if (owner === undefined) {
    const owner = location.state?.owner;
  }
  if (username === undefined) {
    const username = location.state?.username;
  }

  const handleClick = (item) => {
    const newCheckBox = !item.check_box;

    axios
      .patch(
        `https://safe-plains-62725.herokuapp.com/items/${item.id}/`,
        {
          check_box: newCheckBox,
        },
        {
          headers: {
            authorization: `token ${token}`,
          },
        }
      )
      .then((res) => {
        axios
          .get(`https://safe-plains-62725.herokuapp.com/lists/${listID}/`, {
            headers: {
              authorization: `token ${token}`,
            },
          })
          .then((res) => {
            setItems(res.data.listForItems);
          });
      });
  };

  const deleteItem = (itemID) => {
    const newItemArray = items.filter((item) => item.id !== itemID);
    setItems(newItemArray);
  };

  const handleMissing = (flag, itemID) => {
    const newFlag = !flag;
    axios
      .patch(
        `https://safe-plains-62725.herokuapp.com/items/${itemID}/`,
        { missing: newFlag },
        {
          headers: {
            authorization: `token ${token}`,
          },
        }
      )
      .then((res) => {
        axios
          .get(`https://safe-plains-62725.herokuapp.com/lists/${listID}/`, {
            headers: {
              authorization: `token ${token}`,
            },
          })
          .then((res) => {
            setItems(res.data.listForItems);
          });
      });
  };

  return (
    <div className="list-container">
      <List>
        {items.map((item) => (
          <div key={item.id}>
            <Divider />
            <ListItem
              sx={{
                borderRadius: "10px",
                backgroundColor: item.missing ? "rgb(214, 155, 149)" : null,
              }}
            >
              <Checkbox
                checked={item.check_box}
                onChange={() => handleClick(item)}
              />

              <ListItemText
                primary={item.item}
                primaryTypographyProps={{
                  fontSize: "21px",
                  fontFamily: "Montserrat",
                }}
              />
              {archiveStatus || shoppingStatus === false ? null : (
                <>
                  {" "}
                  <IconButton
                    onClick={(e) => handleMissing(item.missing, item.id)}
                  >
                    <FlagIcon />
                  </IconButton>
                </>
              )}
              <DeleteItem
                token={token}
                deleteItem={deleteItem}
                itemID={item.id}
              />
            </ListItem>

            <Divider />
          </div>
        ))}
        <ListItem sx={{ height: "60px" }} ref={scroll}></ListItem>
      </List>
    </div>
  );
}

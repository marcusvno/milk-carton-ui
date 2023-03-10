import { useEffect, useState, useRef } from "react";
import * as React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Stack, Fab, Typography } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import IconButton from "@mui/material/IconButton";
import InviteButton from "./InviteButton.js";
import DeleteList from "./DeleteList";
import { ShowListItems } from "./ShowListItems";
import { SendItems } from "./SendItem";
import RemoveUser from "./RemoveUser";
import { useQuery } from "react-query";
import Paper from "@mui/material/Paper";

export const EditList = ({ token, username, setToken, setUsername }) => {
  const scroll = useRef();
  const [items, setItems] = useState(null);
  const [authID, setAuthID] = useState("");
  const [title, setTitle] = useState("");
  const [archiveStatus, setArchiveStatus] = useState(null);
  const [hasGuests, setHasGuests] = useState();
  const [numberShared, setNumberShared] = useState();
  const [flagColor, setFlagColor] = useState("");
  const location = useLocation();
  const navigate = useNavigate("");
  const [owner, setOwner] = useState("");
  const [shoppingStatus, setShoppingStatus] = useState("");

  const { listID } = useParams();
  //const archiveStatus = location.state?.archiveStatus;
  if (token === undefined) {
    setToken(location.state?.token);
  }
  if (username === undefined) {
    setUsername(location.state?.username);
  }

  useEffect(() => {
    axios
      .get(`https://safe-plains-62725.herokuapp.com/lists/${listID}/`, {
        headers: {
          authorization: `token ${token}`,
        },
      })
      .then((data) => {
        setOwner(data.data.owner);
        setItems(data.data.listForItems);
        setAuthID(data.data.auth_id);
        setTitle(data.data.title);
        setArchiveStatus(data.data.archived);
        setNumberShared(data.data.shared_users.length);
        setShoppingStatus(data.data.active_shopping);

        if (data.data.shared_users.length > 0) {
          setHasGuests(true);
        }
      })
      .catch((error) => {
        if (error.message === "Request failed with status code 403") {
          navigate("/Login");
        }
      });
  }, [listID, token, navigate, owner]);

  const handleBack = (event) => {
    event.preventDefault();
    setItems([]);
    navigate("/Homepage");
  };

  const handleUnarchive = () => {
    axios
      .patch(
        `https://safe-plains-62725.herokuapp.com/lists/${listID}/`,
        { archived: false },
        {
          headers: {
            authorization: `token ${token}`,
          },
        }
      )
      .then((res) => navigate("/Homepage"));
  };

  const handleShopping = () => {
    if (owner === username) {
      axios.patch(
        `https://safe-plains-62725.herokuapp.com/lists/${listID}/`,
        { active_shopping: true },
        {
          headers: {
            authorization: `token ${token}`,
          },
        }
      );
    }
    navigate(`/shopping/${listID}/`, {
      state: {
        title: title,
        owner: owner,
        username: username,
      },
    });
  };

  const titleBarButtons = (guests) => {
    return (
      <>
        <InviteButton listID={listID} authID={authID} token={token} />
        {guests ? (
          <RemoveUser
            listID={listID}
            token={token}
            setHasGuests={setHasGuests}
            numberShared={numberShared}
            username={username}
            owner={owner}
          />
        ) : null}
        {/* {owner === username ? (
          <DeleteList listID={listID} token={token} title={title} />
        ) : null} */}
        <DeleteList listID={listID} token={token} title={title} />
      </>
    );
  };

  return (
    items && (
      <Paper
        elevation={20}
        sx={{
          height: 950,
          width: 400,
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div className="wrap">
          <div className="list">
            <div className="list-display topbar">
              <Stack
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
                sx={{ mt: 0 }}
              >
                <IconButton
                  aria-label="back to homepage"
                  variant="filled"
                  onClick={handleBack}
                >
                  <ArrowBackIcon sx={{ ml: "10px" }} />
                </IconButton>
                <Typography
                  variant="h5"
                  width="100%"
                  justifyContent="center"
                  sx={{
                    fontFamily: "Montserrat",
                    fontWeight: "bolder",
                    textTransform: "uppercase",
                  }}
                >
                  {title}
                </Typography>
                {username === owner ? (
                  titleBarButtons(hasGuests)
                ) : owner !== username ? (
                  <RemoveUser
                    listID={listID}
                    token={token}
                    setHasGuests={setHasGuests}
                    numberShared={numberShared}
                    owner={owner}
                    username={username}
                  />
                ) : null}
              </Stack>

              <SendItems
                items={items}
                setItems={setItems}
                token={token}
                listID={listID}
                scroll={scroll}
              />
            </div>
            <ShowListItems
              items={items}
              setItems={setItems}
              token={token}
              listID={listID}
              flagColor={flagColor}
              scroll={scroll}
              archiveStatus={archiveStatus}
              owner={owner}
              username={username}
              shoppingStatus={shoppingStatus}
            />

            {archiveStatus ? (
              owner === username ? (
                <>
                  <Fab
                    sx={{ left: "190px", top: "880px", position: "absolute" }}
                    color="secondary"
                    variant="extended"
                    onClick={handleUnarchive}
                  >
                    <UnarchiveIcon sx={{ mr: 1 }} />
                    <strong>Unarchive List</strong>
                  </Fab>
                </>
              ) : null
            ) : owner === username ? (
              fabForUser(
                handleShopping,
                listID,
                token,
                scroll,
                owner,
                username,
                shoppingStatus
              )
            ) : (
              fabForGuest(
                handleShopping,
                listID,
                token,
                scroll,
                owner,
                username,
                shoppingStatus
              )
            )}
          </div>
        </div>
      </Paper>
    )
  );
};

function fabForUser(
  handleShopping,
  listID,
  token,
  scroll,
  owner,
  username,
  shoppingStatus
) {
  return (
    <>
      <Fab
        sx={{ left: "220px", top: "880px", position: "absolute" }}
        color="success"
        variant="extended"
        onClick={() =>
          handleShopping(
            handleShopping,
            listID,
            token,
            scroll,
            owner,
            username,
            shoppingStatus
          )
        }
      >
        <ShoppingCartCheckoutIcon sx={{ mr: 1 }} />
        <strong>GO SHOPPING</strong>
      </Fab>
    </>
  );
}

function fabForGuest(
  handleShopping,
  listID,
  token,
  scroll,
  owner,
  username,
  shoppingStatus
) {
  console.log("fabforguest");
  return (
    <>
      {shoppingStatus ? (
        <Fab
          className="rise-shake"
          sx={{ left: "220px", top: "880px", position: "absolute" }}
          color="success"
          variant="extended"
          onClick={() =>
            handleShopping(
              listID,
              token,
              scroll,
              owner,
              username,
              shoppingStatus
            )
          }
        >
          <ShoppingCartCheckoutIcon sx={{ mr: 1 }} />
          <strong>JOIN SHOPPER</strong>
        </Fab>
      ) : null}
    </>
  );
}

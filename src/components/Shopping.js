import { useQuery } from "react-query";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShowListItems } from "./ShowListItems";
import { SendItems } from "./SendItem";
import { useLocation } from "react-router-dom";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteList from "./DeleteList";
import Typography from "@mui/material/Typography";
import React from "react";
import Fab from "@mui/material/Fab";

//import useWebSocket, { ReadyState } from "react-use-websocket";

export default function Shopping({ token }) {
  const [items, setItems] = useState(null);
  const location = useLocation();
  const navigate = useNavigate("");
  //const [color, setColor] = useState("success");

  const { listID } = useParams();
  const title = location.state?.title;
  const owner = location.state?.owner;
  const username = location.state?.username;

  console.log(owner);
  console.log(username);

  const fetchList = () => {
    return axios.get(
      `https://safe-plains-62725.herokuapp.com/lists/${listID}/`,
      {
        headers: {
          authorization: `token ${token}`,
        },
      }
    );
  };

  const { isLoading, data } = useQuery("listInfo", fetchList, {
    refetchInterval: 2000,
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  const handleBack = (event) => {
    event.preventDefault();

    axios
      .patch(
        `https://safe-plains-62725.herokuapp.com/lists/${listID}/`,
        { active_shopping: false },
        {
          headers: {
            authorization: `token ${token}`,
          },
        }
      )
      .then((res) => {
        setItems([]);
      });

    navigate(-1);
  };

  const handleShopping = () => {
    axios
      .patch(
        `https://safe-plains-62725.herokuapp.com/lists/${listID}/`,
        { archived: true, active_shopping: false },
        {
          headers: {
            authorization: `token ${token}`,
          },
        }
      )
      .then((res) => navigate("/Homepage"));
  };

  return (
    <div className="list-display">
      <Stack
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        sx={{ mt: 4 }}
      >
        <IconButton
          aria-label="back to homepage"
          variant="filled"
          onClick={handleBack}
        >
          <ArrowBackIcon />
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
        {owner === username ? (
          <DeleteList listID={listID} token={token} title={data.data.title} />
        ) : null}
        {/* <DeleteList listID={listID} token={token} title={data.data.title} /> */}
      </Stack>
      <SendItems
        items={data.data.listForItems}
        setItems={setItems}
        token={token}
        listID={listID}
      />
      <ShowListItems
        items={data.data.listForItems}
        setItems={setItems}
        token={token}
        listID={listID}
        owner={owner}
        username={username}
        shoppingStatus={data.data.shopping}
      />

      {/* <>
        <Fab
          sx={{ position: "fixed", bottom: 30, right: 30 }}
          color="error"
          variant="extended"
          onClick={handleShopping}
        >
          <ShoppingCartCheckoutIcon sx={{ mr: 1 }} />
          Finish Shopping & Archive
        </Fab>
      </> */}

      {owner === username ? (
        <>
          <Fab
            sx={{ position: "fixed", bottom: 30, right: 30 }}
            color="error"
            variant="extended"
            onClick={handleShopping}
          >
            <ShoppingCartCheckoutIcon sx={{ mr: 1 }} />
            Finish Shopping & Archive
          </Fab>
        </>
      ) : null}
    </div>
  );
}

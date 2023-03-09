import { requestLogin } from "./Requests";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CssVarsProvider } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";

import axios from "axios";
import { useParams } from "react-router";

export default function InviteLogin({ token, setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { listID, inviteID } = useParams();
  const navigate = useNavigate("");

  const handleSubmit = (event) => {
    requestLogin(username, password).then((res) => {
      const inviteToken = res.data.auth_token;
      setToken(res.data.auth_token);

      axios
        .get(`https://safe-plains-62725.herokuapp.com/lists/`, {
          headers: {
            authorization: `token ${inviteToken}`,
          },
        })
        .then((res) => {
          const listCheck = res.data.filter(
            (list) => list.auth_id === inviteID
          );

          if (listID === listCheck[0].id.toString()) {
            axios
              .put(
                `https://safe-plains-62725.herokuapp.com/lists/${listID}/invite/`,
                { username: `${username}` },
                {
                  headers: {
                    authorization: `token ${inviteToken}`,
                  },
                }
              )
              .then((res) => {
                navigate(`/lists/edit/${listID}/`, {
                  state: {
                    token: inviteToken,
                    username: username,
                  },
                });
              });
          }
        });
    });
  };

  return (
    <CssVarsProvider>
      <Sheet
        sx={{
          width: 300,
          mx: "auto", // margin left & right
          my: 4, // margin top & botom
          py: 3, // padding top & bottom
          px: 2, // padding left & right
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "sm",
          boxShadow: "md",
        }}
      >
        <Box
          sx={{
            border: "7px black solid",
            padding: "5px 15px 10px 15px",
            display: "flex",
          }}
        >
          <Typography
            align="left"
            sx={{
              fontWeight: "900",
              fontFamily: "Montserrat",
              fontSize: "2.9em",
              textTransform: "uppercase",
            }}
          >
            <strong>Forgot Milk?</strong>
          </Typography>
        </Box>
        <div>
          <Typography level="h4" component="h1">
            <b>Welcome!</b>
          </Typography>
          <Typography level="body2">Sign in to continue.</Typography>
        </div>

        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            // html input attribute
            name="username"
            type="text"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <Button onClick={handleSubmit} sx={{ mt: 2 /* margin top */ }}>
          Log in
        </Button>

        <Typography
          endDecorator={<Link to="/sign-up">Sign up</Link>}
          fontSize="sm"
          sx={{ alignSelf: "center" }}
        >
          Don't have an account?
        </Typography>
      </Sheet>
    </CssVarsProvider>
  );
}

import axios from "axios";
import { useQuery } from "react-query";
import * as React from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import Link from "@mui/joy/Link";
import { requestMyLists, requestSharedLists } from "./Requests";
import { ListDetails } from "./ListDetails";
import { useEffect, useState } from "react";
import CreateList from "./CreateList";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Homepage = ({ setUser, username, token }) => {
  const [lists, setLists] = useState([]);
  const [sharedLists, setSharedLists] = useState([]);
  const location = useLocation();
  const [snackBar, setSnackBar] = useState(location.state?.openSnackBar);

  let active = [];
  let archived = [];

  //Loods data into useState to prop drill
  useEffect(() => {
    requestMyLists(token).then((res) => {
      setLists(res.data);
    });
  }, [token]);

  useEffect(() => {
    requestSharedLists(token).then((res) => {
      setSharedLists(res.data);
    });
  }, [token]);

  const handleClose = () => {
    setSnackBar(false);
  };

  const filterList = () => {
    active = lists.filter((list) => list.archived === false);
    archived = lists.filter((list) => list.archived === true);
  };

  function ExpandedArchived() {
    const [isExpanded, setExpansion] = useState(false);

    return (
      <div>
        <Button
          color={"secondary"}
          fullWidth
          onClick={() => setExpansion(!isExpanded)}
          // size="large"
          variant="contained"
          sx={{ mb: "10px", backgroundColor: "black" }}
          endIcon={
            isExpanded ? (
              <ExpandCircleDownIcon sx={{ fontSize: "larger" }} />
            ) : (
              <ExpandCircleDownIcon
                sx={{ fontSize: "larger", rotate: "90deg" }}
              />
            )
          }
        >
          <strong>
            Archived Lists {archived.length > 0 ? `(${archived.length})` : null}
          </strong>
        </Button>
        {isExpanded && (
          <div className="expandedArchivedBox">
            {archived.map((list) => (
              <div style={{ mx: "30px" }} key={list.id}>
                <ListDetails list={list} token={token} username={username} />
              </div>
            ))}
            <Button disabled hidden style={{ height: "60px" }} />
          </div>
        )}
      </div>
    );
  }

  //Calls Filtering function to separate the lists from archived and unarchived.
  filterList();

  return (
    <Paper elevation={20} sx={{ height: 900, margin: "0 auto" }}>
      <section className="homepage" style={{ margin: "20px" }}>
        <Snackbar
          open={snackBar}
          onClose={() => setSnackBar(false)}
          autoHideDuration={3000}
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
        >
          <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
            List Deleted
          </Alert>
        </Snackbar>
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
          <div
            className="exit-button"
            style={{
              alignSelf: "center",
              backgroundColor: "black",
              borderRadius: "10px",
              marginLeft: "10px",
            }}
          >
            <IconButton
              sx={{ margin: "0 auto" }}
              onClick={() => {
                setUser(null, null);
              }}
            >
              <Link component={RouterLink} to="/Login" sx={{ color: "white" }}>
                <LogoutIcon />
              </Link>
            </IconButton>
          </div>
        </Box>
        {/* <Divider sx={{ m: 2 }} /> */}
        <Box
          sx={{
            border: "7px black solid",
            borderBottom: "none",
            padding: "15px",
          }}
        >
          <div className="active-lists">
            <Typography
              sx={{
                fontSize: "30px",
                fontWeight: "600",
                fontFamily: "Montserrat",
                borderBottom: "5px black solid",
              }}
            >
              My Grocery Lists
            </Typography>
            {active.map((list) => (
              <ListDetails
                list={list}
                token={token}
                key={list.id}
                username={username}
              />
            ))}
          </div>
        </Box>
        {/* <Divider sx={{ m: "10px" }} /> */}
        <Box
          sx={{
            border: "7px black solid",
            borderTop: "none",
            padding: "0 15px 15px 15px",
          }}
        >
          <div className="shared-lists">
            <Typography
              sx={{
                mb: "5px",
                fontSize: "30px",
                fontWeight: "600",
                fontFamily: "Montserrat",
                borderBottom: "5px black solid",
              }}
            >
              Shared Lists
            </Typography>
            {sharedLists.map((list) =>
              list.archived ? null : (
                <ListDetails
                  list={list}
                  token={token}
                  key={list.id}
                  username={username}
                />
              )
            )}
          </div>
        </Box>
        <Divider sx={{ m: "10px" }} />
        <ExpandedArchived />

        <CreateList token={token} />
      </section>
    </Paper>
  );
};

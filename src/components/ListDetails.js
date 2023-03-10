import { Link } from "react-router-dom";
// import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { Button } from "@mui/material";

export const ListDetails = ({ list, token, username }) => {
  return (
    <Link
      className="homepagelist"
      to={`/lists/edit/${list.id}/`}
      path="relative"
      style={{ textDecoration: "none" }}
      state={{
        //title: list.title,
        //id: list.id,
        token: token,
        username: username,
        //archiveStatus: list.archived,
      }}
    >
      <Button
        className="list-buttons"
        sx={{
          m: "1px",

          textAlign: "left",

          vericalAlign: "center",
          border: "none",
          color: "black",
          borderRadius: 28,

          ":hover": {
            bgcolor: "#AF5!important",
            //            color: "white !important",
          },
        }}
        variant="outlined"
        key={list.id}
        startIcon={<DoubleArrowIcon />}
      >
        <Typography
          sx={{
            justifyText: "left",
            mt: 0.56,
            fontSize: "18px",
            fontWeight: "700",
            fontFamily: "Montserrat",
          }}
        >
          {list.title}
        </Typography>
        <div className="dot-width" />
        {list.active_shopping ? (
          <div
            style={{
              color: "green",
              marginLeft: "10px",
            }}
            size="small"
            className="blink"
            disabled
          >
            <strong style={{ fontSize: "15px" }}>Live</strong>
          </div>
        ) : null}
      </Button>
    </Link>
  );
};

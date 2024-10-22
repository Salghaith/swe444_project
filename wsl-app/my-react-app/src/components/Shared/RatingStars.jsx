import * as React from "react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";

export default function HalfRating(props) {
  return (
    <Box sx={{ width: 300, display: "flex", alignItems: "center" }}>
      <Rating
        name="half-rating-read"
        value={props.rating}
        precision={0.5} //minimum inceament value allowed
        readOnly
        className={props.className}
        //Here should implement when the user wants to rate the business, by modifing readOnly={editable?} and add onChange...
      />
      <Box sx={{ ml: 1 }}>{props.rating}</Box>
      <Box sx={{ ml: 1, fontSize: "small", color: "#a9a9a9" }}>
        ({props.reviewers} {props.reviewers > 1 ? "Reviews" : "Review"})
      </Box>
    </Box>
  );
}
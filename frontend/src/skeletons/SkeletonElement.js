import React from "react";
import PropTypes from "prop-types";
import "./skeleton.css";

export default function SkeletonElement({ type }) {
  const classes = `skeleton ${type}`;
  return <div className={classes}></div>;
}

SkeletonElement.propTypes = {
  type: PropTypes.any,
};

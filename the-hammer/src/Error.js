import React from "react";

const Error = ({ touched, message, network, event }) => {
  if (!touched) {
    return <div className={network ? "cnxInvalid" : "invalid"}>&nbsp;</div>;
  } else {
    return <div className="valid">&nbsp;</div>;
  }
};

export default Error;

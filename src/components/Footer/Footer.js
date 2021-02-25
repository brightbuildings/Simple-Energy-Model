import React from "react";

import "./Footer.css";

function Footer() {
  return (
    <div className="Footer">
      <div className="centered">
        <div className="Copyright">{`Bright Buildings ${new Date().getFullYear()}`}</div>
      </div>
    </div>
  );
}

export default Footer;

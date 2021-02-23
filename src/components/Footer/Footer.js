import React from "react";

import "./Footer.css";

function Footer() {
  return (
    <div className="Footer">
      <div className="Copyright">{`Bright Buildings ${new Date().getFullYear()}`}</div>
    </div>
  );
}

export default Footer;

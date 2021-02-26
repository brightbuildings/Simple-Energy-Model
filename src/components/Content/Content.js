import React, { useState } from "react";
import DataService from "../../services/DataService";

import "./Content.css";

const formatSections = (data, activeSection) => {
  if (data == null) {
    return;
  }
  return Object.entries(data).map(section => {
    let key = section[0];

    // If Parameters, export both A and B
    if (key === "parameters") {
      return (
        <React.Fragment key="parameters">
          <section key={section[0]+"a"} className={`fieldset ${activeSection === section[0]+"a" ? "active" : ""}`}> 
            <h2>{section[1].label}</h2>
            <p>{section[1].content}</p>
          </section>
          <section key={section[0]+"b"} className={`fieldset ${activeSection === section[0]+"b" ? "active" : ""}`}>
            <h2>{section[1].labelB}</h2>
            <p>{section[1].contentB}</p>
          </section>
        </React.Fragment>
      )
    } else {
      return (
        <section key={section[0]} className={`fieldset ${activeSection === section[0] ? "active" : ""}`}>
          <h2>{section[1].label}</h2>
          <p>{section[1].content}</p>
        </section>
      );
    }
  });
};

const formatNavigation = (data, setActiveSection) => {
  if (data == null) {
    return;
  }
  return Object.entries(data).map(section => {
    let key = section[0];

    // If Parameters, export both A and B
    if (key === "parameters") {
      return (
        <React.Fragment key="parameters">
          <button key={section[0]+"a"} onClick={() => setActiveSection(section[0]+"a")}>Parameters A</button>
          <br />
          <button key={section[0]+"b"} onClick={() => setActiveSection(section[0]+"b")}>Parameters B</button>
          <br />
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment key={section[0]}>
          <button onClick={() => setActiveSection(section[0])}>{section[0]}</button>
          <br />
        </React.Fragment>
      );
    }
  });
};

function Content() {
  const [activeSection, setActiveSection] = useState(null);
  const data = DataService.load();
  console.log(Object.entries(data));

  return (
    <div className="centered-narrow">
      <div className="Content">
        <div className="Fields">
          {formatSections(data, activeSection)}
        </div>
        <div className="Navigation">
          {formatNavigation(data, setActiveSection)}
        </div>
      </div>
    </div>
  );
}

export {
  Content,
  formatSections,
  formatNavigation
};

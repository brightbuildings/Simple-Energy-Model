import React from "react";
import DataService from "../../services/DataService";

import "./Content.css";

const formatSections = data => {
  if (data == null) {
    return;
  }
  return Object.entries(data).map(section => {
    let key = section[0];

    // If Parameters, export both A and B
    if (key === "parameters") {
      return (
        <React.Fragment key="parameters">
          <section key={section[0]+"a"} className="fieldset">
            <h2>{section[1].label}</h2>
            <p>{section[1].content}</p>
          </section>
          <section key={section[0]+"b"} className="fieldset">
            <h2>{section[1].labelB}</h2>
            <p>{section[1].contentB}</p>
          </section>
        </React.Fragment>
      )
    } else {
      return (
        <section key={section[0]} className="fieldset">
          <h2>{section[1].label}</h2>
          <p>{section[1].content}</p>
        </section>
      );
    }
  });
};

const formatNavigation = data => {
  if (data == null) {
    return;
  }
  return Object.entries(data).map(section => {
    let key = section[0];

    // If Parameters, export both A and B
    if (key === "parameters") {
      return (
        <React.Fragment key="parameters">
          <button key={section[0]+"a"}>Parameters A</button>
          <br />
          <button key={section[0]+"b"}>Parameters B</button>
          <br />
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment key={section[0]}>
          <button>{section[0]}</button>
          <br />
        </React.Fragment>
      );
    }
  });
};

function Content() {
  const data = DataService.load();
  console.log(Object.entries(data));

  return (
    <div className="centered-narrow">
      <div className="Content">
        <div className="Fields">
          {formatSections(data)}
        </div>
        <div className="Navigation">
          {formatNavigation(data)}
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

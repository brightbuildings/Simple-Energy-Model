import React, { useState } from "react";
import DataService from "../../services/DataService";

import "./Content.css";

const formatSections = (data, activeSection) => {
  if (data == null) {
    return;
  }
  return Object.entries(data).map(section => {
    const key = section[0];
    const value = section[1];

    console.log(section);


    // If Parameters, export both A and B
    if (key === "parameters") {
      const parametersA = [key+"-a", value];
      const parametersB = [key+'-b', value];

      return (
        <React.Fragment key="parameters">
          {formatSection(parametersA, activeSection)}
          {formatSection(parametersB, activeSection)}
        </React.Fragment>
      );
    } else {
      return formatSection(section, activeSection);
    }
  });
};

const formatSection = (section, activeSection) => {
  const key = section[0];
  const value = section[1];

  let labelKey = "label";
  let contentKey = "content";
  if (key === "parameters-b") {
    labelKey = "labelB";
    contentKey = "contentB";
  }
  
  return (
    <section key={key} className={`fieldset ${activeSection === key ? "active" : ""}`}>
      <h2>{value[labelKey]}</h2>
      <p>{value[contentKey]}</p>
      {Object.entries(value.fields).map(field => {
        const key = field[0];
        const value = field[1];

        return (
          <section key={key}>
            <h3>{key}</h3>
            {Object.entries(value).map(input => {
              return formatQuestion(input);
            })}
          </section>
          );
        })
      }
    </section>
  );
}

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
          <button key={section[0]+"a"} onClick={() => setActiveSection(section[0]+"-a")}>Parameters A</button>
          <br />
          <button key={section[0]+"b"} onClick={() => setActiveSection(section[0]+"-b")}>Parameters B</button>
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

const formatQuestion = question => {

  switch (question.type) {
    case "float":
      break;
    case "integer":
      break;
    case "text":
      break;
    case "gap":
      return <br />;
    default:
      break;
  }
};

function Content() {
  const [activeSection, setActiveSection] = useState("introduction");
  const data = DataService.load();

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

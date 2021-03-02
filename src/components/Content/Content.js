import React, { useState } from "react";
import DataService from "../../services/DataService";
import { FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";

import "./Content.css";

const formatSections = (data, activeSection, activeSubsection, setActiveSubsection) => {
  if (data == null) {
    return;
  }
  return Object.entries(data).map(section => {
    const key = section[0];
    const value = section[1];

    // If Parameters, export both A and B
    if (key === "parameters") {
      const parametersA = [key+"-a", value];
      const parametersB = [key+'-b', value];

      return (
        <React.Fragment key="parameters">
          {formatSection(parametersA, activeSection, activeSubsection, setActiveSubsection)}
          {formatSection(parametersB, activeSection, activeSubsection, setActiveSubsection)}
        </React.Fragment>
      );
    } else {
      return formatSection(section, activeSection, activeSubsection, setActiveSubsection);
    }
  });
};

const formatSection = (section, activeSection, activeSubsection, setActiveSubsection) => {
  const key = section[0];
  const value = section[1];

  let labelKey = "label";
  let contentKey = "content";
  if (key === "parameters-b") {
    labelKey = "labelB";
    contentKey = "contentB";
  }
  
  return (
    <FormGroup key={key} className={`fieldset ${activeSection === key ? "active" : ""}`}>
      <h2>{value[labelKey]}</h2>
      <p>{value[contentKey]}</p>

      <div className="subNavigation">
        {Object.entries(value.fields).map(field => {
          const key = field[0];

          return (
            <button 
              key={key}
              onClick={() => setActiveSubsection(key)}
              className={key === activeSubsection ? "active" : "" } 
            >
              {key}
            </button>
          );
        })}
      </div>
      <div className="subNavigationContent">
        {Object.entries(value.fields).map(field => {
          const key = field[0];
          const value = field[1];

          if (activeSubsection !== key) {
            return null;
          }

          return (
            <section key={key} className="Questions">
              {Object.entries(value).map(question => {
                return formatQuestion(question);
              })}
            </section>
            );
          })
        }
      </div>
    </FormGroup>
  );
}

const formatNavigation = (data, activeSection, setActiveSection) => {
  if (data == null) {
    return;
  }
  return Object.entries(data).map(section => {
    let key = section[0];

    // If Parameters, export both A and B
    if (key === "parameters") {
      return (
        <React.Fragment key="parameters">
          <button 
            className={`${section[0]}-a` === activeSection ? "active" : "" } 
            key={section[0]+"a"} 
            onClick={() => setActiveSection(section[0]+"-a")}
          >
            Parameters A
          </button>
          <br />
          <button 
            className={`${section[0]}-b` === activeSection ? "active" : "" } 
            key={section[0]+"b"} 
            onClick={() => setActiveSection(section[0]+"-b")}
          >
            Parameters B
          </button>
          <br />
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment key={section[0]}>
          <button
            className={section[0] === activeSection ? "active" : "" } 
            onClick={() => setActiveSection(section[0])}
          >
            {section[0]}
          </button>
          <br />
        </React.Fragment>
      );
    }
  });
};

const formatQuestion = question => {
  if (question == null) {
    return;
  }
  const key = question[0];
  const value = question[1];

  let required = false;
  if (value?.required === true) {
    required = true;
  }

  switch (value?.type) {
    case "float": // fall through
    case "integer":
      return (
        <InputGroup key={key}>
          <Label for={key}>{value.label}</Label>
          <Input 
            type="number" 
            required={required}
            name={value.key}
            value={value.key}
          />
          {value.unit && (
            <InputGroupAddon addonType="append">
              <InputGroupText>{value.unit}</InputGroupText>
            </InputGroupAddon>
          )}
        </InputGroup>
      );
    case "text":
      return (
        <InputGroup key={key}>
          <Label for={key}>{value.label}</Label>
          <Input 
            type="text" 
            required={required}
            name={value.key}
            value={value.key}
          />
          {value.unit && (
            <InputGroupAddon addonType="append">
              <InputGroupText>{value.unit}</InputGroupText>
            </InputGroupAddon>
          )}
        </InputGroup>
      );
    case "gap":
      return <div key={key} className="spacer">&nbsp;</div>;
    default:
      return;
  }
};

function Content() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [activeSubsection, setActiveSubsection] = useState(null);
  const data = DataService.load();

  return (
    <div className="centered-narrow">
      <div className="Content">
        <div className="Fields">
          {formatSections(data, activeSection, activeSubsection, setActiveSubsection)}
        </div>
        <div className="Navigation">
          {formatNavigation(data, activeSection, setActiveSection)}
        </div>
      </div>
    </div>
  );
}

export {
  Content,
  formatSections,
  formatNavigation,
  formatQuestion
};

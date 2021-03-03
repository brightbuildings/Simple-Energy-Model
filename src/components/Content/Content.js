import React, { useState } from "react";
import DataService from "../../services/DataService";
import { FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";

import "./Content.css";

const formatSections = (data, activeSection, activeSubsection, setActiveSubsection, variables, setVariables) => {
  if (data == null) {
    return;
  }
  return Object.entries(data).map(section => {
    const [key, value] = section;

    // If Parameters, export both A and B
    if (key === "parameters") {
      const parametersA = [key+"-a", value];
      const parametersB = [key+'-b', value];

      return (
        <React.Fragment key="parameters">
          {formatSection(parametersA, activeSection, activeSubsection, setActiveSubsection, variables, setVariables)}
          {formatSection(parametersB, activeSection, activeSubsection, setActiveSubsection, variables, setVariables)}
        </React.Fragment>
      );
    } else {
      return formatSection(section, activeSection, activeSubsection, setActiveSubsection, variables, setVariables);
    }
  });
};

const formatSection = (section, activeSection, activeSubsection, setActiveSubsection, variables, setVariables) => {
  const [key, value] = section;

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
        {Object.entries(value.fields).map((field, index) => {
          const key = field[0];
          const navTitle = field[1].navigation;

          let activeKey = activeSubsection;
          if (index === 0 && activeSubsection === "") {
            activeKey = key;
          }

          return (
            <button 
              key={key}
              onClick={() => setActiveSubsection(key)}
              className={key === activeKey ? "active" : "" } 
            >
              {navTitle}
            </button>
          );
        })}
      </div>
      <div className="subNavigationContent">
        {Object.entries(value.fields).map((field, index) => {
          const [key, value] = field;

          if (index === 0 && activeSubsection === "") {
            // display this entry
          } else if (activeSubsection !== key) {
            return null;
          }

          return (
            <section key={key} className="Questions">
              {Object.entries(value.fields).map(question => {
                return formatQuestion(question, variables, setVariables);
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
  return Object.keys(data).map(key => {

    // If Parameters, export both A and B
    if (key === "parameters") {
      return (
        <React.Fragment key="parameters">
          <button 
            className={`${key}-a` === activeSection ? "active" : "" } 
            key={key+"a"} 
            onClick={() => setActiveSection(key+"-a")}
          >
            Parameters A
          </button>
          <br />
          <button 
            className={`${key}-b` === activeSection ? "active" : "" } 
            key={key+"b"} 
            onClick={() => setActiveSection(key+"-b")}
          >
            Parameters B
          </button>
          <br />
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment key={key}>
          <button
            className={key === activeSection ? "active" : "" } 
            onClick={() => setActiveSection(key)}
          >
            {key}
          </button>
          <br />
        </React.Fragment>
      );
    }
  });
};

const formatQuestion = (question, variables, setVariables) => {
  if (question == null) {
    return;
  }
  const [key, value] = question;

  const required = value?.required === true;

  switch (value?.type) {
    case "float": // fall through
    case "integer":
      return (
        <InputGroup key={key}>
          <Label for={key}>{value.label}</Label>
          <Input 
            type="number" 
            required={required}
            name={key}
            id={key}
            defaultValue={variables[key]}
            onChange={input => setVariables({...variables, [key]: input.currentTarget.value})}
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
            name={key}
            id={key}
            defaultValue={variables[key]}
            onChange={input => setVariables({...variables, [key]: input.currentTarget.value})}
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
  const [activeSubsection, setActiveSubsection] = useState("");
  const [variables, setVariables] = useState({});
  const data = DataService.load();

  return (
    <div className="centered-narrow">
      <div className="Content">
        <div className="Fields">
          {formatSections(data, activeSection, activeSubsection, setActiveSubsection, variables, setVariables)}
        </div>
        <div className="Navigation">
          {formatNavigation(data, activeSection, setActiveSection, setActiveSubsection)}
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

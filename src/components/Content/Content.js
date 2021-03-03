import React, { useState } from "react";
import DataService from "../../services/DataService";
import { FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";

import "./Content.css";

const formatSections = (data, activeSection, activeSubsection, setActiveSubsection, variables, setVariables) => {
  if (data == null) {
    return;
  }
  return Object.entries(data).map(section => {
    return formatSection(section, activeSection, activeSubsection, setActiveSubsection, variables, setVariables);
  });
};

const formatSection = (section, activeSection, activeSubsection, setActiveSubsection, variables, setVariables) => {
  const [key, value] = section;

  return (
    <FormGroup key={key} className={`fieldset ${activeSection === key ? "active" : ""}`}>
      <h2>{value.label}</h2>
      <p>{value.content}</p>

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
  return Object.entries(data).map(navItem => {
    const [key, value] = navItem;

    return (
      <React.Fragment key={key}>
        <button
          className={key === activeSection ? "active" : "" } 
          onClick={() => setActiveSection(key)}
        >
          {value.label}
        </button>
        <br />
      </React.Fragment>
    );
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
    case "select":
      return "TODO";
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

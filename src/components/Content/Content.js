import React, { useState } from "react";
import DataService from "../../services/DataService";
import CalculationService from "../../services/CalculationService";
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

const formatNavigation = (data, activeSection, setActiveSection, setActiveSubsection) => {
  if (data == null) {
    return;
  }
  return Object.entries(data).map(navItem => {
    const [key, value] = navItem;

    return (
      <React.Fragment key={key}>
        <button
          className={key === activeSection ? "active" : "" } 
          onClick={() => {
            setActiveSubsection("");
            setActiveSection(key);
          }}
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
      return (
        <InputGroup key={key}>
          <Label for={key}>{value.label}</Label>
          <Input 
            type="select" 
            required={required}
            name={key}
            id={key}
            value={variables[key] || "disabled"}
            onChange={input => setVariables({...variables, [key]: input.currentTarget.value})}
          >
            <option key="disabled" value="disabled" disabled="disabled">Select an option</option>
            {value.values.map(optionKey => {
              const entries = Object.entries(optionKey);
              return <option key={entries[0][0]}>{entries[0][0]}</option>
            })}
          </Input>
          {value.unit && (
            <InputGroupAddon addonType="append">
              <InputGroupText>{value.unit}</InputGroupText>
            </InputGroupAddon>
          )}
        </InputGroup>
      )
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
  const optionObjects = DataService.getAllOptionsObjects();
  const output = CalculationService.run(variables, optionObjects);

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
      <div className="DevResults" style={{ padding: "1rem", backgroundColor: "white" }}>
        <div>
          <h3>Input</h3>
          <pre>
            {JSON.stringify(variables, undefined, 2)}
          </pre>
        </div>
        <div>
          <h3>Output</h3>
          <pre>
            {JSON.stringify(output, undefined, 2)}
          </pre>
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

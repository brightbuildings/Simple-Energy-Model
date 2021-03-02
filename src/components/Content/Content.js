import React, { useState } from "react";
import DataService from "../../services/DataService";
import { FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";

import "./Content.css";

const formatSections = (data, activeSection, activeSubsection, setActiveSubsection, variables, setVariables) => {
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
        {Object.entries(value.fields).map((field, index) => {
          const key = field[0];
          const navTitle = field[1].navigation;
          console.log(field);

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
          const key = field[0];
          const value = field[1];

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
  return Object.entries(data).map(section => {
    let key = section[0];

    // If Parameters, export both A and B
    if (key === "parameters") {
      return (
        <React.Fragment key="parameters">
          <button 
            className={`${section[0]}-a` === activeSection ? "active" : "" } 
            key={section[0]+"a"}
            onClick={() => {
              setActiveSubsection("");
              setActiveSection(section[0]+"-a")
            }}
          >
            Parameters A
          </button>
          <br />
          <button 
            className={`${section[0]}-b` === activeSection ? "active" : "" } 
            key={section[0]+"b"} 
            onClick={() => {
              setActiveSubsection("");
              setActiveSection(section[0]+"-b")
            }}
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
            onClick={() => {
              setActiveSubsection("");
              setActiveSection(section[0]);
            }}
          >
            {section[0]}
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
  const [activeSubsection, setActiveSubsection] = useState(null);
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

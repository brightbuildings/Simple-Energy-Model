import React, { useState } from "react";
import { FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import DataService from "../../services/DataService";
import CalculationService from "../../services/CalculationService";
import ChartService from "../../services/ChartService";

import "./Content.css";

const formatSections = (data, activeSection, activeSubsection, setActiveSubsection, variables, setVariables, output) => {
  if (data == null) {
    return;
  }
  return Object.entries(data).map(section => {
    return formatSection(section, activeSection, activeSubsection, setActiveSubsection, variables, setVariables, output);
  });
};

const formatSection = (section, activeSection, activeSubsection, setActiveSubsection, variables, setVariables, output) => {
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
                return formatQuestion(question, variables, setVariables, output);
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

const formatQuestion = (question, variables, setVariables, output) => {
  if (question == null) {
    return;
  }
  const [key, value] = question;

  const moreLabel = output?.financing?.[key];
  const required = value?.required === true;

  switch (value?.type) {
    case "float": // fall through
    case "integer":
      return (
        <InputGroup key={key}>
          <Label for={key}>{value.label}{moreLabel && (` (Calculated: ${moreLabel})`)}</Label>
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

const setDefaultVariables = data => {
  const variables = {};
  Object.entries(data).forEach(i => {
    if (i[1].fields != null) {
      Object.entries(i[1].fields).forEach(j => {
        if (j[1].fields != null) {
          Object.entries(j[1].fields).forEach(k => {
            const [key, value] = k;
            variables[key] = value.default;
          });
        }
      });
    }
  });
  return variables;
};

function Content() {
  const data = DataService.load();
  const [activeSection, setActiveSection] = useState("introduction");
  const [activeSubsection, setActiveSubsection] = useState("");
  const [variables, setVariables] = useState(setDefaultVariables(data));
  const optionObjects = DataService.getAllOptionsObjects();
  const output = CalculationService.run(variables, optionObjects);

  return (
    <div className="centered-narrow">
      <div className="Content">
        <div className="Fields">
          {formatSections(data, activeSection, activeSubsection, setActiveSubsection, variables, setVariables, output)}
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
          <ChartService.SimpleEnergyModelBar
            data={{
              datasets: [
                {
                  label: "My first dataset",
                  data: [5],
                  backgroundColor: 'rgba(255,99,132,0.2)',
                  borderColor: 'rgba(255,99,132,1)',
                  borderWidth: 1,
                  hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                  hoverBorderColor: 'rgba(255,99,132,1)',
                },
                {
                  label: "My first dataset 2",
                  data: [10],
                  backgroundColor: 'rgba(255,199,132,0.2)',
                  borderColor: 'rgba(255,199,132,1)',
                  borderWidth: 1,
                  hoverBackgroundColor: 'rgba(255,199,132,0.4)',
                  hoverBorderColor: 'rgba(255,199,132,1)',
                }
              ]
            }}
          />
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
  formatQuestion,
  setDefaultVariables,
};

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

          if (Object.entries(value.fields).length < 2) {
            return "";
          }

          return (
            <div 
              key={key}
              onClick={() => setActiveSubsection(key)}
              className={key === activeKey ? "active SubNavigationButton" : "SubNavigationButton" } 
            >
              <div className="Step">{index+1}</div>
              <button>{navTitle}</button>
            </div>
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
      <button
        key={key}
        className={key === activeSection ? "active" : "" } 
        onClick={() => {
          setActiveSubsection("");
          setActiveSection(key);
        }}
      >
        {value.label}
      </button>
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
  const maximumHeatingEnergyBalance = Math.max(output.annualSpaceHeatingA.totalLoss.valueOf(), output.annualSpaceHeatingB.totalLoss.valueOf());

  return (
    <div className="centered">
      <div className="Navigation">
        {formatNavigation(data, activeSection, setActiveSection, setActiveSubsection)}
      </div>
      <div className="Content">
        <div className="Fields">
          {formatSections(data, activeSection, activeSubsection, setActiveSubsection, variables, setVariables, output)}
        </div>
      </div>
      <div className="DevResults" style={{ padding: "1rem", backgroundColor: "white" }}>
        <div>
          <ChartService.HeatingEnergyBalance
            title="Heating Energy Balance - Model A"
            annualSpaceHeating={output.annualSpaceHeatingA}
            variables={variables}
            yMax={maximumHeatingEnergyBalance}
          />
          <br />
          <br />
          <ChartService.NetZeroEnergySummary
            title="Net-zero Energy Summary - Model A"
            output={output.outputA}
            variables={variables}
            yMax={output.maxEnergy}
          />
          <br />
          <br />
          <h3>Input</h3>
          <pre>
            {JSON.stringify(variables, undefined, 2)}
          </pre>
        </div>
        <div>
          <ChartService.HeatingEnergyBalance
            title="Heating Energy Balance - Model B"
            annualSpaceHeating={output.annualSpaceHeatingB}
            variables={variables}
            yMax={maximumHeatingEnergyBalance}
          />
          <br />
          <br />
          <ChartService.NetZeroEnergySummary
            title="Net-zero Energy Summary - Model B"
            output={output.outputB}
            variables={variables}
            yMax={output.maxEnergy}
          />
          <br />
          <br />
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
  formatQuestion,
  setDefaultVariables,
};

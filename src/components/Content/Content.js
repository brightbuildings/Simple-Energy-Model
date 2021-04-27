import React, { useState } from "react";
import { FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import DataService from "../../services/DataService";
import CalculationService from "../../services/CalculationService";
import ChartService from "../../services/ChartService";

import "./Content.css";

const formatSections = (data, activeSection, activeSubsection, setActiveSubsection, variables, setVariables, output, maximumHeatingEnergyBalance) => {
  if (data == null) {
    return;
  }
  return (
    <React.Fragment>
      {Object.entries(data).map(section => {
        return formatSection(section, activeSection, activeSubsection, setActiveSubsection, variables, setVariables, output, maximumHeatingEnergyBalance);
      })}
      {getGlossarySection(activeSection)}
    </React.Fragment>
  );
};

const formatSection = (section, activeSection, activeSubsection, setActiveSubsection, variables, setVariables, output, maximumHeatingEnergyBalance) => {
  const [key, value] = section;

  return (
    <FormGroup key={key} className={`fieldset ${activeSection === key ? "active" : ""}`}>
      <h2 className="SectionTitle">{value.label}</h2>
      <div className="SectionMain">
        <p dangerouslySetInnerHTML={{__html: value.content}} />
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
                  return <FormatQuestion key={question[0]} question={question} variables={variables} setVariables={setVariables} output={output} />;
                })}
              </section>
              );
            })
          }
        </div>
      </div>
      <div className="SectionOutput">
        {getSidebar(key, output, variables, maximumHeatingEnergyBalance)}
      </div>
    </FormGroup>
  );
}

const getGlossarySection = activeSection => {
  const key = "glossary";

  return (
    <FormGroup key={"glossaryContent"} className={`fieldset ${activeSection === key ? "active" : ""}`}>
      <h2 className="SectionTitle">Glossary</h2>
      <div className="SectionMain Glossary">
        <div className="subNavigationContent">
          <h3>How to use this tool</h3>
          <p>Gather information for the building you would like to assess. This will include:</p>
          <ol>
            <li><strong>Dimensions</strong> (overall length, width, height above grade, depth below grade, window areas) - results will be most accurate for a rectangular building as shown below, overrides can be made to accommodate L-shaped and U-shaped buildings.</li>
            <li>Thermal properties of the <strong>building envelope</strong> (walls, windows, roof, floor)</li>
            <li><strong>Mechanical equipment</strong> information (heating, cooling, ventilation, hot water)</li>
            <li><strong>Electrical equipment</strong> information (lighting, appliances)</li>
          </ol>
          <h3>General Notes</h3>
          <p>Do not perform any retrofit work without considering air, vapour and weather barrier detailing.</p>
          <p>Grant applications will require a pre-retrofit energy audit. Please contact your Energy Advisor before you begin work.</p>
          <p>A HOT2000 energy model will need to be prepared for grant and financing.</p>
          <p>More complex energy analysis can be prepared in PHPP, HOT2000 or IESVE.</p>
          <p>We recommend choosing construction materials with low embodied carbon.</p>
          <h3>Glossary</h3>
          <dl>
            <div className="row"><dt>°C</dt><dd>degree Celsius, temperature scale</dd></div>
            <div className="row"><dt>a</dt><dd>annum, per year</dd></div>
            <div className="row"><dt>ACH, 1/h</dt><dd>Air Changes per Hour, used to describe the air leakage during a blower door test, also used to describe ventilation rates. One air change per hour is the volume of the room being fully replaced every hour.</dd></div>
            <div className="row"><dt>batt</dt><dd>batt insulation, this could be mineral wool, fibreglass or sheeps wool</dd></div>
            <div className="row"><dt>BTU</dt><dd>British Thermal Units, rate: 1 watt = 3.41 BTU per hour, quantity: 1 watt*hour = 3.41 BTU</dd></div>
            <div className="row"><dt>Conc. </dt><dd>concrete</dd></div>
            <div className="row"><dt>effective vs nominal values</dt><dd>effective U-values take into account thermal bridging and other aspects that reduce performance rather than nominal performance stated by the manufacture on the packaging for the insulation alone</dd></div>
            <div className="row"><dt>embodied carbon</dt><dd>total of greenhouse gas emissions that are caused by the manufacture and supply of construction products and materials, as well as the construction process itself</dd></div>
            <div className="row"><dt>Energuide</dt><dd>energy efficiency rating system maintained by the Government of Canada and Natural Resources Canada (NRCan)</dd></div>
            <div className="row"><dt>GJ</dt><dd>gigajoule, 1000 megajoules, or 1 billion joules, unit of energy</dd></div>
            <div className="row"><dt>h</dt><dd>hours</dd></div>
            <div className="row"><dt>heat pump</dt><dd>efficient electric heating system that function based on refrigeration (similar to an air conditioner in reverse, and can provide cooling in the summer), they can be air source or geothermal, they will often require an electric backup heater</dd></div>
            <div className="row"><dt>Heating degree days</dt><dd>Heating degree day is a measurement designed to quantify the demand for energy needed to heat a building. HDD is derived from measurements of outside air temperature. The heating requirements for a given building at a specific location are considered to be directly proportional to the number of HDD at that location.</dd></div>
            <div className="row"><dt>Heating degree hours</dt><dd>similar to heating degree days but measured in hours, heating degree days x 24</dd></div>
            <div className="row"><dt>HELP, Home Energy Loan Program</dt><dd><a href="https://www.saskatoon.ca/engage/home-energy-loan-program-help" rel="noreferrer" target="_blank">Saskatoon Home Energy Loan Program</a></dd></div>
            <div className="row"><dt>I-joist</dt><dd>I-joists are strong, lightweight, "I" shaped engineered wood structural members that are typically used for floor structures. In net-zero retofits they can be used to create an insulation cavity around an existing home.</dd></div>
            <div className="row"><dt>K</dt><dd>Kelvin absolute temperature scale 0 K = -273 °C, a change of 1 K equals a change of 1 °C</dd></div>
            <div className="row"><dt>k, kilo</dt><dd>prefix meaning 1000, one thousand</dd></div>
            <div className="row"><dt>kW</dt><dd>kilowatts, 1000 watts, power, rate of energy consumption, 1000 joules per second</dd></div>
            <div className="row"><dt>kWh</dt><dd>kilowatt*hour, 1000 watt*hours, energy quantity, 1 kilowatt load running for 1 hour, equal to 3.6 megajoules</dd></div>
            <div className="row"><dt>MJ</dt><dd>megajoule, another metric unit of energy quantity, one million joules, 3.6 kilowatt*hours</dd></div>
            <div className="row"><dt>MURB</dt><dd>multi-unit residential building, an apartment or condominium building</dd></div>
            <div className="row"><dt>net-zero energy</dt><dd>A net zero energy home is very energy efficient, it only uses as much energy as it can produce from on-site renewable energy throughout the year. A variation is net-zero carbon.</dd></div>
            <div className="row"><dt>PACE Financing</dt><dd>Loans would be provided by the City to be used for energy efficiency retrofits and energy generation on residential properties.  This financing is different than a regular loan as it is tied to a property, not an individual, and therefore has no impact on credit ratings, mortgage limits or other individual debt limits.  Loans would be paid back to the City through property taxes. See City of Saskatoon Home Energy Loan Program (HELP)</dd></div>
            <div className="row"><dt>passivhaus</dt><dd>Passivhaus is a voluntary sustainable building standard which results in buildings that require very little energy for space heating or cooling.</dd></div>
            <div className="row"><dt>rigid</dt><dd>Rigid insulation, we recommend mineral wool (Rockwool Comfortboard) since it is vapour permeable and allows drying. Expanded polystyrene (EPS) is another option. Wood fibre insulation is emerging as low embodied carbon option.</dd></div>
            <div className="row"><dt>R-value</dt><dd>thermal resistance, higher is better, the ability of an assembly to prevent heat flow, R-value is the inverse of U-value, R = 1/U</dd></div>
            <div className="row"><dt>SHGC</dt><dd>solar heat gain coefficient, defines how much solar gain is allowed in through a window, high solar gain 50% (for passive solar design), low solar gain 30% (if overheating is a risk)</dd></div>
            <div className="row"><dt>U-value</dt><dd>thermal transmittance or heat transfer coefficient, lower is better, the amount of heat that moves through an assembly for a unit area and temperature difference, U-value is the inverse of R-value, U = 1/R</dd></div>
          </dl>
          <h3>Conversion Table</h3>
          <dl>
            <div className="row"><dt>1 m</dt><dd>3.28 ft</dd></div>
            <div className="row"><dt>1 m²</dt><dd>10.8 ft²</dd></div>
            <div className="row"><dt>U-value [metric] </dt><dd>5.678 / R-value [imperial]</dd></div>
            <div className="row"><dt>R-value [imperial]</dt><dd>5.678 / U-value [metric]</dd></div>
          </dl>
          <img src="/img/conversion.png" alt="Conversion table for U <> R" />
          <h3>Technical Notes</h3>
          <ol>
            <li>Insulation effective R-values account for NBC 9.36 typical framing percentages.</li>
            <li>Contact <a href="https://brightbuildings.ca/" rel="noreferrer" target="_blank">Bright Buildings</a> for photos, details and schematics designs.</li>
          </ol>
        </div>
      </div>
    </FormGroup>
  );
};

const getSidebar = (key, output, variables, maximumHeatingEnergyBalance) => {
  switch(key) {
    case "introduction":
      return <img src='/img/render.png' alt='Display of a render to help visualize dimensions.' />;
    case "parametersA":
      return (
        <React.Fragment>
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
        </React.Fragment>
      );
    case "parametersB":
      return (
        <React.Fragment>
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
        </React.Fragment>
      );
    case "financing":
      return <ChartService.FinancingSavingsBar output={output} variables={variables} />;

    // case "business":

    default: 
      return null;
  }
}

const formatNavigation = (data, activeSection, setActiveSection, setActiveSubsection) => {
  if (data == null) {
    return;
  }
  return (
    <React.Fragment>
      {Object.entries(data).map(navItem => {
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
      })}
      <button
        key="glossary"
        className={"glossary" === activeSection ? "active" : "" } 
        onClick={() => {
          setActiveSubsection("");
          setActiveSection("glossary");
        }}
      >
        Glossary
      </button>
    </React.Fragment>
  );
};

const calculatedChanges = (key, value) => {
  const variableCalcs = {};
  if (key === "heatingDegreeDays") {
    variableCalcs.heatingDegreeHours = (value * 24 / 1000) || 0;
  } else if (key === "heatingDegreeHours") {
    variableCalcs.heatingDegreeDays = (value * 1000 / 24) || 0;
  }
  return variableCalcs;
}

const FormatQuestion = ({question, variables, setVariables, output}) => {
  if (question == null) {
    return null;
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
            value={variables[key]}
            onChange={input => {
              const { value } = input.currentTarget;
              const otherChanges = calculatedChanges(key, value);
              setVariables({...variables, ...otherChanges, [key]: value});
            }}
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
      return null;
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
          {formatSections(data, activeSection, activeSubsection, setActiveSubsection, variables, setVariables, output, maximumHeatingEnergyBalance)}
        </div>
      </div>
    </div>
  );
}

export {
  Content,
  formatSections,
  formatNavigation,
  FormatQuestion,
  setDefaultVariables,
  getSidebar,
  getGlossarySection
};

import React from "react";
import ChartComponent, { Bar } from "react-chartjs-2";
const Big = require("big.js");

const SimpleEnergyModelBar = props => {
  console.log(props.ymax);
  return (
    <>
      <h3 className="ChartTitle">{props.title}</h3>
      <Bar
        height={300}
        options={{
          plugins: {
            legend: {
              position: "bottom"
            },
            tooltip: {
              callbacks: {
                label: function (ctx) {
                  const label = ctx.dataset.label;
                  const value = ctx.dataset.data[ctx.parsed.x];
                  return value === null ? null : label + ': ' + value;
                },
                itemSort: function(a, b) {
                  return b.datasetIndex - a.datasetIndex;
              }
              }
            },
          },
          scales: {
            y: {
              stacked: true,
              max: props.ymax
            },
            x: {
              stacked: true
            }
          }
        }}
        {...props}
      />
    </>
  );
};

const HeatingEnergyBalance = props => {
  let tfa = props.variables.interiorFloorArea;
  let internalHeatGains = null;
  let solarGains = null;
  let ventilation = null;
  let infiltration = null;
  let windows = null;
  let floor = null;
  let roof = null;
  let walls = null;
  let wallsBelowGrade = null;
  let spaceHeatingDemand = null;
  try {
    internalHeatGains = parseFloat(Big(props.annualspaceheating.totalInternalHeatGainsKwha).times(props.annualspaceheating.utilizationFactor).div(tfa).round());
    solarGains = parseFloat(Big(props.annualspaceheating.totalSolarGainsKwha).times(props.annualspaceheating.utilizationFactor).div(tfa).round());
    ventilation = parseFloat(Big(props.annualspaceheating.ventilationkwha).div(tfa).round());
    infiltration = parseFloat(Big(props.annualspaceheating.infiltrationkwha).div(tfa).round());
    windows = parseFloat(Big(props.annualspaceheating.exteriorDoorsG1kwha).plus(props.annualspaceheating.windowsG1kwha).div(tfa).round());
    floor = parseFloat(Big(props.annualspaceheating.floorG1kwha).div(tfa).round());
    roof = parseFloat(Big(props.annualspaceheating.roofG1kwha).div(tfa).round());
    walls = parseFloat(Big(props.annualspaceheating.wallAboveGradeG1kwha).div(tfa).round());
    wallsBelowGrade = parseFloat(Big(props.annualspaceheating.wallBelowGradeG1kwha).div(tfa).round());
    spaceHeatingDemand = parseFloat(Big(ventilation).plus(infiltration).plus(windows).plus(floor).plus(roof).plus(walls).plus(wallsBelowGrade).minus(internalHeatGains).minus(solarGains));
  } catch (e) {
    // do nothing
  }
  let max = Big(0);
  try {
    if (tfa == null || Big(tfa).eq(0)) {
      tfa = 1;
    }
  } catch {
    tfa = 1;
  }
  if (props.ymax != null) {
    max = Big(props.ymax).div(tfa);
  }
  const tick = Math.ceil(Math.round(max.toString())/100)*100;

  const data = {
    labels: ["Losses", "Gains"],
    datasets: [
      {
        label: "Ventilation",
        data: [ventilation],
        backgroundColor: hexToRgbA('#a9d18d', 0.7),
        borderColor: '#a9d18d',
        hoverBackgroundColor: '#a9d18d',
      },
      {
        label: "Infiltration",
        data: [infiltration],
        backgroundColor: hexToRgbA('#D9D1FA', 0.7),
        borderColor: '#D9D1FA',
        hoverBackgroundColor: '#D9D1FA',
      },
      {
        label: "Windows",
        data: [windows],
        backgroundColor: hexToRgbA('#fbfd7e', 0.7),
        borderColor: '#fbfd7e',
        hoverBackgroundColor: '#fbfd7e',
      },
      {
        label: "Floor",
        data: [floor],
        backgroundColor: hexToRgbA('#bf8f00', 0.7),
        borderColor: '#bf8f00',
        hoverBackgroundColor: '#bf8f00',
      },
      {
        label: "Roof",
        data: [roof],
        backgroundColor: hexToRgbA('#2e5697', 0.7),
        borderColor: '#2e5697',
        hoverBackgroundColor: '#2e5697',
      },
      {
        label: "Walls - Below Grade",
        data: [wallsBelowGrade],
        backgroundColor: hexToRgbA('#8fabdd', 0.7),
        borderColor: '#8fabdd',
        hoverBackgroundColor: '#8fabdd',
      },
      {
        label: "Walls",
        data: [walls],
        backgroundColor: hexToRgbA('#bdc9eb', 0.7),
        borderColor: '#bdc9eb',
        hoverBackgroundColor: '#bdc9eb',
      },
      {
        label: "Space Heating Demand",
        data: [null, spaceHeatingDemand],
        backgroundColor: hexToRgbA('#ee7e31', 0.7),
        borderColor: '#ee7e31',
        hoverBackgroundColor: '#ee7e31',
      },
      {
        label: "Internal Heat Gains",
        data: [null, internalHeatGains],
        backgroundColor: hexToRgbA('#f6b284', 0.7),
        borderColor: '#f6b284',
        hoverBackgroundColor: '#f6b284',
      },
      {
        label: "Solar Gains",
        data: [null, solarGains],
        backgroundColor: hexToRgbA('#fbfd7e', 0.7),
        borderColor: '#fbfd7e',
        hoverBackgroundColor: '#fbfd7e',
      }
    ]
  };

  return <SimpleEnergyModelBar data={data} {...props} ymax={tick} />
};

const NetZeroEnergySummary = props => {
  const spaceHeating = props.output.spaceHeating.round();
  const hotWater = props.output.hotWater.round();
  const lightsAppliancesPlugs = props.output.lightsAppliancesPlugs.round();
  const electricVehicle = 0;
  const electricityGeneration = Big(spaceHeating).plus(hotWater).plus(lightsAppliancesPlugs);

  const data = {
    labels: ["Space Heating", "Hot Water", "Lights, Appliances, Plugs", "Electric Vehicle", "Total", "83.9 kW Solar Array"],
    datasets: [
      { 
        label: "Space Heating",
        data: [parseFloat(spaceHeating), null, null, null, spaceHeating],
        backgroundColor: hexToRgbA('#ed7e30', 0.7),
        borderColor: '#ed7e30',
        hoverBackgroundColor: '#ed7e30',
      },
      { 
        label: "Hot Water",
        data: [null, hotWater, null, null, hotWater],
        backgroundColor: hexToRgbA('#4472c6', 0.7),
        borderColor: '#4472c6',
        hoverBackgroundColor: '#4472c6',
      },
      { 
        label: "Lights, Appliances, Plugs",
        data: [null, null, lightsAppliancesPlugs, null, lightsAppliancesPlugs],
        backgroundColor: hexToRgbA('#808080', 0.7),
        borderColor: '#808080',
        hoverBackgroundColor: '#808080',
      },
      { 
        label: "Electric Vehicle",
        data: [null, null, null, electricVehicle, electricVehicle],
        backgroundColor: hexToRgbA('#c1c100', 0.7),
        borderColor: '#c1c100',
        hoverBackgroundColor: '#c1c100',
      },
      { 
        label: "83.9 kW Solar Array",
        data: [null, null, null, null, null, electricityGeneration],
        backgroundColor: hexToRgbA('#ffc202', 0.7),
        borderColor: '#ffc202',
        hoverBackgroundColor: '#ffc202',
      },
    ]
  }

  return <SimpleEnergyModelBar data={data} {...props} />
};

const getColor = (index, isHover = false) => {
  const colors = [
    "rgba(255, 255, 0, 0.3",
    "rgba(0, 255, 0, 0.3",
    "rgba(0, 0, 255, 0.3",
    "rgba(255, 0, 255, 0.3",
    "rgba(0, 255, 255, 0.3",
    "rgba(0, 0, 255, 0.3",
    "rgba(255, 0, 0, 0.3",
    "rgba(255, 125, 0, 0.3",
    "rgba(125, 255, 0, 0.3",
    "rgba(0, 125, 255, 0.3",
  ];
  const hoverColors = [
    "rgba(255, 255, 0, 0.5",
    "rgba(0, 255, 0, 0.5",
    "rgba(0, 0, 255, 0.5",
    "rgba(255, 0, 255, 0.5",
    "rgba(0, 255, 255, 0.5",
    "rgba(0, 0, 255, 0.5",
    "rgba(255, 0, 0, 0.5",
    "rgba(255, 125, 0, 0.5",
    "rgba(125, 255, 0, 0.5",
    "rgba(125, 125, 255, 0.5",
  ];
  if (index > colors.length) {
    return "#cccccc";
  }
  return isHover ? hoverColors[index-1] : colors[index-1];
};

const hexToRgbA = (hex, alpha) => {
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c= hex.substring(1).split('');
      if(c.length === 3){
          c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c= '0x'+c.join('');
      return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
  }
  throw new Error('Bad Hex');
};

function FinancingSavingsBar (props){
  // const monthlyPayments = 386.27;
  // const monthlySavings = 458.81;
  const {monthlyPayments, monthlySavings} = props.output.economics;
  const annualPayments = parseFloat(monthlyPayments) * 12; // 4625.24
  const annualEnergySavings = parseFloat(monthlySavings) * 12; // 5505.72

  const interest = 1.03;

  const xLabels = [];
  const dataCost = [];
  const dataSavings = [];
  const dataAnnualSavings = [];

  let totalSavings = 0;
  for (let i = 0; i < (props.variables.paceLoanTerm || 0); i++) {
    xLabels.push(new Date().getFullYear() + i + 1);
    const curYearSavings = annualEnergySavings * interest ** i;
    totalSavings += curYearSavings - annualPayments;
    dataCost.push(annualPayments);
    dataSavings.push(curYearSavings);
    dataAnnualSavings.push(totalSavings);
  }

  const tickCallback = t => {
    return t.toLocaleString('en-CA', {
      style: 'currency', 
      currency: 'CAD',
    })
  }

  return (
    <div>
      <ChartComponent
        type='line'
        height={200}
        data={{
          datasets: [
            {data: dataAnnualSavings, label: 'Total Net Savings', yAxisID: "right-y-axis", "fill": false, borderColor: "#777"},
            {data: dataCost, type: 'bar', label: 'Loan Payments', backgroundColor: "#4f71be", yAxisID: "left-y-axis", barPercentage: 0.8},
            {data: dataSavings, type: 'bar', label: 'Annual Energy Savings', backgroundColor: "#DE8344", yAxisID: "left-y-axis", barPercentage: 0.8},
          ],
          labels: xLabels,
        }}
        options={{
          plugins: {
            tooltips: {
              callbacks: {
                label: (x) => tickCallback(parseFloat(x.value)),
              }
            },
            legend: {
              position: "bottom",
            },
          },
          scales: {
            'x': {
                offset: true
            },
            'left-y-axis': {
              ticks: {beginAtZero: true, callback: tickCallback}, 
              position: "left"
            },
            'right-y-axis': {
              position: 'right', 
              ticks: {callback: tickCallback}
            }
          }
        }}
      />
    </div>
  );
}

const ChartService = {
  SimpleEnergyModelBar,
  getColor,
  FinancingSavingsBar,
  HeatingEnergyBalance,
  NetZeroEnergySummary,
};

export default ChartService;
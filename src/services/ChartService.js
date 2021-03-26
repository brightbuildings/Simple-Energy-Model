import React from "react";
import { Bar } from "react-chartjs-2";
const Big = require("big.js");

const SimpleEnergyModelBar = props => {
  let max = Big(0);
  let tfa = props.variables.interiorFloorArea;
  try {
    if (tfa == null || Big(tfa).eq(0)) {
      tfa = 1;
    }
  } catch {
    tfa = 1;
  }
  max = Big(props.yMax).div(tfa);
  const tick = Math.round(max.toString());
  return <Bar
    height={300}
    options={{
      legend: {
        position: "bottom"
      },
      title: {
        text: props.title,
        display: true
      },
      tooltips: {
        mode: "label",
        callbacks: {
          label: function (tooltipItem, data) {
            const tooltip = data.datasets[tooltipItem.datasetIndex];
            const value = tooltip.data[tooltipItem.index];
            return value === null ? null : tooltip.label + ': ' + value;
          },
        },
        itemSort: function(a, b) {
          return b.datasetIndex - a.datasetIndex;
       }
      },
      scales: {
        yAxes: [{
          stacked: true,
          ticks: {
            min: 0,
            max: tick
          }
        }],
        xAxes: [{
          stacked: true
        }]
      }
    }}
    {...props}
  />;
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
    internalHeatGains = Big(props.annualSpaceHeating.totalInternalHeatGainsKwha).times(props.annualSpaceHeating.utilizationFactor).div(tfa).round();
    solarGains = Big(props.annualSpaceHeating.totalSolarGainsKwha).times(props.annualSpaceHeating.utilizationFactor).div(tfa).round();
    ventilation = Big(props.annualSpaceHeating.ventilationkwha).div(tfa).round();
    infiltration = Big(props.annualSpaceHeating.infiltrationkwha).div(tfa).round();
    windows = Big(props.annualSpaceHeating.exteriorDoorsG1kwha).plus(props.annualSpaceHeating.windowsG1kwha).div(tfa).round();
    floor = Big(props.annualSpaceHeating.floorG1kwha).div(tfa).round();
    roof = Big(props.annualSpaceHeating.roofG1kwha).div(tfa).round();
    walls = Big(props.annualSpaceHeating.wallAboveGradeG1kwha).div(tfa).round();
    wallsBelowGrade = Big(props.annualSpaceHeating.wallBelowGradeG1kwha).div(tfa).round();
    spaceHeatingDemand = Big(ventilation).plus(infiltration).plus(windows).plus(floor).plus(roof).plus(walls).plus(wallsBelowGrade).minus(internalHeatGains).minus(solarGains);
  } catch (e) {
    // do nothing
  }
  

  const data = {
    labels: ["Losses", "Gains"],
    datasets: [
      {
        label: "Walls",
        data: [walls],
        backgroundColor: getColor(10),
        borderColor: getColor(10),
        hoverBackgroundColor: getColor(10, true),
      },
      {
        label: "Walls - Below Grade",
        data: [wallsBelowGrade],
        backgroundColor: getColor(9),
        borderColor: getColor(9),
        hoverBackgroundColor: getColor(9, true),
      },
      {
        label: "Roof",
        data: [roof],
        backgroundColor: getColor(8),
        borderColor: getColor(8),
        hoverBackgroundColor: getColor(8, true),
      },
      {
        label: "Floor",
        data: [floor],
        backgroundColor: getColor(7),
        borderColor: getColor(7),
        hoverBackgroundColor: getColor(7, true),
      },
      {
        label: "Windows",
        data: [windows],
        backgroundColor: getColor(6),
        borderColor: getColor(6),
        hoverBackgroundColor: getColor(6, true),
      },
      {
        label: "Infiltration",
        data: [infiltration],
        backgroundColor: getColor(5),
        borderColor: getColor(5),
        hoverBackgroundColor: getColor(5, true),
      },
      {
        label: "Ventilation",
        data: [ventilation],
        backgroundColor: getColor(4),
        borderColor: getColor(4),
        hoverBackgroundColor: getColor(4, true),
      },
      {
        label: "Space Heating Demand",
        data: [null, spaceHeatingDemand],
        backgroundColor: getColor(1),
        borderColor: getColor(1),
        hoverBackgroundColor: getColor(1, true),
      },
      {
        label: "Internal Heat Gains",
        data: [null, internalHeatGains],
        backgroundColor: getColor(2),
        borderColor: getColor(2),
        hoverBackgroundColor: getColor(2, true),
      },
      {
        label: "Solar Gains",
        data: [null, solarGains],
        backgroundColor: getColor(3),
        borderColor: getColor(3),
        hoverBackgroundColor: getColor(3, true),
      }
    ]
  };

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

const ChartService = {
  HeatingEnergyBalance
};

export default ChartService;
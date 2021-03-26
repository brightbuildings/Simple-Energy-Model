import React from "react";
import { Bar } from "react-chartjs-2";
const Big = require("big.js");

const SimpleEnergyModelBar = props => {
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
          stacked: true
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
  const tfa = props.variables.interiorFloorArea;
  const internalHeatGains = Big(props.annualSpaceHeating.totalInternalHeatGainsKwha).times(props.annualSpaceHeating.utilizationFactor).div(tfa).toFixed(0);
  const solarGains = Big(props.annualSpaceHeating.totalSolarGainsKwha).times(props.annualSpaceHeating.utilizationFactor).div(tfa).toFixed(0);
  const ventilation = Big(props.annualSpaceHeating.ventilationkwha).div(tfa).toFixed(0);
  const infiltration = Big(props.annualSpaceHeating.infiltrationkwha).div(tfa).toFixed(0);
  const windows = Big(props.annualSpaceHeating.exteriorDoorsG1kwha).plus(props.annualSpaceHeating.windowsG1kwha).div(tfa).toFixed(0);
  const floor = Big(props.annualSpaceHeating.floorG1kwha).div(tfa).toFixed(0);
  const roof = Big(props.annualSpaceHeating.roofG1kwha).div(tfa).toFixed(0);
  const walls = Big(props.annualSpaceHeating.wallAboveGradeG1kwha).div(tfa).toFixed(0);
  const wallsBelowGrade = Big(props.annualSpaceHeating.wallBelowGradeG1kwha).div(tfa).toFixed(0);
  const spaceHeatingDemand = Big(ventilation).plus(infiltration).plus(windows).plus(floor).plus(roof).plus(walls).plus(wallsBelowGrade).minus(internalHeatGains).minus(solarGains);

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
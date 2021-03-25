import React from "react";
import { Bar } from "react-chartjs-2";

const SimpleEnergyModelBar = props => {
  return <Bar
    options={{
      scales: {
        yAxes: [{
          stacked: true
        }]
      }
    }}
    {...props}
  />;
};

const ChartService = {
  SimpleEnergyModelBar,
};

export default ChartService;
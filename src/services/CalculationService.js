const inputs = {
  "winterSetpoint": 20,
  "summerSetpoint": 25,
  "groundTemperature": 5,
  "winterDesignTemperature": -40,
  "summerDesignDB": 30,
  "summerDesignWB": 21,
};

const heatingAndCooling = (variables, optionObjects) => {
  const heatingDeltaT = inputs.winterDesignTemperature - inputs.winterSetpoint;
  const coolingDeltaT = inputs.summerDesignDB - inputs.summerSetpoint;
  const summerSetpointEnthalpy = 50;
  const summerDesignEnthalpy = 61;
  const coolingDeltaHRaw = summerDesignEnthalpy - summerSetpointEnthalpy; // kJ/kg
  const coolingDeltaH = coolingDeltaHRaw / 3.6; // Wh/kg
  const airDensity = 1/0.87;
  const ventilationRaw = optionObjects.ventilation.values.find(el => { return !!el[variables.ventilation]; });
  const ventilation = !!ventilationRaw ? ventilationRaw[variables.ventilation].efficiency : null;

  return {
    coolingDeltaH,
    ventilation
  };
};

const run = (variables, optionObjects) => {
  return {
    heatingAndCooling: heatingAndCooling(variables, optionObjects),
  };
};

module.exports = {
  run,
};

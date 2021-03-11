const inputs = {
  "winterSetpoint": 20.0,
  "summerSetpoint": 25.0,
  "groundTemperature": 5.0,
  "winterDesignTemperature": -40.0,
  "summerDesignDB": 30.0,
  "summerDesignWB": 21.0,
};

const heatingAndCooling = (variables, optionObjects) => {

  // Inputs
  const heatingDeltaT = inputs.winterSetpoint - inputs.winterDesignTemperature;
  const coolingDeltaT = inputs.summerDesignDB - inputs.summerSetpoint;
  const summerSetpointEnthalpy = 50;
  const summerDesignEnthalpy = 61;
  const coolingDeltaHRaw = summerDesignEnthalpy - summerSetpointEnthalpy; // kJ/kg
  const coolingDeltaH = coolingDeltaHRaw / 3.6; // Wh/kg
  const airDensity = 1/0.87;
  const ventilationEfficiency = getOption("ventilation", "efficiency", variables, optionObjects);
  const infiltrationAnnualEnergy = getOption("airtightness", "annualEnergy", variables, optionObjects);
  const infiltrationHeatingLoad = getOption("airtightness", "heatingLoad", variables, optionObjects);
  const ventilation = 0.3;
  const infiltrationAnnualEnergyAirflowRate = parseFloat(variables.buildingVolume) * infiltrationAnnualEnergy;
  const infiltrationHeatingLoadAirflowRate = parseFloat(variables.buildingVolume) * infiltrationHeatingLoad;
  const ventilationAirflowRate = 2.5 * parseFloat(variables.interiorFloorArea) * ventilation;

  // Calculations
  // Opaque Assemblies
  // U Value (W/m2K)
  const wallAboveGradeU = getOption("wallAboveGrade", "u", variables, optionObjects);
  const wallBelowGradeU = getOption("wallBelowGrade", "u", variables, optionObjects);
  const roofU = getOption("roof", "u", variables, optionObjects);
  const floorU = getOption("floor", "u", variables, optionObjects);
  const doorU = getOption("solidDoor", "u", variables, optionObjects);
  // Area (m2)
  const height = parseFloat(variables.height);
  const length = parseFloat(variables.length);
  const width = parseFloat(variables.width);
  const north = parseFloat(variables.north);
  const east = parseFloat(variables.east);
  const south = parseFloat(variables.south);
  const west = parseFloat(variables.west);
  const depth = parseFloat(variables.depth);
  const exteriorSolidDoorArea = parseFloat(variables.exteriorSolidDoorArea);
  const wallAboveGradeArea = 2 * (length * height) +
                             2 * (width * height) -
                             (north + east + south + west + exteriorSolidDoorArea);
  const wallBelowGradeArea = 2 * (length * depth) + 
                             2 * (width * depth);
  const roofArea = parseFloat(variables.roofArea);
  const floorArea = parseFloat(variables.floorArea);
  const doorArea = exteriorSolidDoorArea;

  // Heating (Delta T C)
  const wallAboveGradeHeating = heatingDeltaT;
  const wallBelowGradeHeating = inputs.winterSetpoint - inputs.groundTemperature;
  const roofHeating = heatingDeltaT;
  const floorHeating = inputs.winterSetpoint - inputs.groundTemperature;
  const doorHeating = heatingDeltaT;
  // Q = UA Delta T
  // Transmission (W)
  const wallAboveGradeTransmission = wallAboveGradeU * wallAboveGradeArea * wallAboveGradeHeating;
  const wallBelowGradeTransmission = wallBelowGradeU * wallBelowGradeArea * wallBelowGradeHeating;
  const roofTransmission = roofU * roofArea * roofHeating;
  const floorTransmission = floorU * floorArea * floorHeating;
  const doorTransmission = doorU * doorArea * doorHeating;
  // Q = V Delta T c
  // Infiltration (W)
  const wallAboveGradeInfiltration = infiltrationHeatingLoadAirflowRate * heatingDeltaT * 0.33;
  // Ventilation (W)
  const wallAboveGradeVentilation = ventilationAirflowRate * heatingDeltaT * 0.33 * (1.0 - ventilationEfficiency);
  const totalHeatingQ = wallAboveGradeTransmission + wallBelowGradeTransmission + roofTransmission + floorTransmission + doorTransmission + wallAboveGradeInfiltration + wallAboveGradeVentilation;
  // Solar Gains
  // Window Shading Faator
  const windowShadingFactor = 0.75 * 0.95 * 0.85 * 0.75;

  // Cooling (Delta T C)
  const wallAboveGradeCoolingDeltaT = coolingDeltaT;
  const roofCoolingDeltaT = coolingDeltaT;
  const doorCoolingDeltaT = coolingDeltaT;
  const wallAboveGradeCoolingTransmission = wallAboveGradeU * wallAboveGradeArea * wallAboveGradeCoolingDeltaT;
  const roofCoolingTransmission = roofU * roofArea * roofCoolingDeltaT;
  const doorCoolingTransmission = doorU * doorArea * doorCoolingDeltaT;
  const coolingInfiltration = airDensity * infiltrationHeatingLoadAirflowRate * coolingDeltaH;
  const coolingVentilation = airDensity * ventilationAirflowRate * coolingDeltaT * (1.0 - ventilationEfficiency);
  const peopleWPer = 130;
  const lightingWm2 = 5;
  const equipmentWm2 = 5;
  const people = peopleWPer * variables.people;
  const lighting = lightingWm2 * variables.interiorFloorArea;
  const equipment = equipmentWm2 * variables.interiorFloorArea;
  const totalCoolingQ = "Todo after transparent assemblies";

  // Transparent Assemblies
  const northU = getOption('windows', 'u', variables, optionObjects);
  const eastU = getOption('windows', 'u', variables, optionObjects);
  const southU = getOption('windows', 'u', variables, optionObjects);
  const westU = getOption('windows', 'u', variables, optionObjects);
  const northSHGC = getOption('windows', 'shgc', variables, optionObjects);
  const eastSHGC = getOption('windows', 'shgc', variables, optionObjects);
  const southSHGC = getOption('windows', 'shgc', variables, optionObjects);
  const westSHGC = getOption('windows', 'shgc', variables, optionObjects);
  const northGlazingArea = north * 0.75;
  const eastGlazingArea = east * 0.75;
  const southGlazingArea = south * 0.75;
  const westGlazingArea = west * 0.75;
  const summerShadingFactor = 0.60;
  const northDirection = 360;
  const eastDirection = 90
  const southDirection = 180;
  const westDirection = 270;
  const northSolarGains = 93;
  const eastSolarGains = 285;
  const southSolarGains = 108;
  const westSolarGains = 285;
  const northHeatingLoad = northU * north * (inputs.winterSetpoint - inputs.winterDesignTemperature);
  const eastHeatingLoad = eastU * east * (inputs.winterSetpoint - inputs.winterDesignTemperature);
  const southHeatingLoad = southU * south * (inputs.winterSetpoint - inputs.winterDesignTemperature);
  const westHeatingLoad = westU * west * (inputs.winterSetpoint - inputs.winterDesignTemperature);
  const northCoolingLoadConduction = northU * north * (inputs.summerDesignDB - inputs.summerSetpoint);
  const eastCoolingLoadConduction = eastU * east * (inputs.summerDesignDB - inputs.summerSetpoint);
  const southCoolingLoadConduction = southU * south * (inputs.summerDesignDB - inputs.summerSetpoint);
  const westCoolingLoadConduction = westU * west * (inputs.summerDesignDB - inputs.summerSetpoint);



  return {
    totalHeatingQ,
    totalCoolingQ,
    northU
  };
};

const run = (variables, optionObjects) => {
  return {
    heatingAndCoolingA: heatingAndCooling(variables, optionObjects),
  };
};

const getOption = (key, subkey, variables, optionObjects) => {
  const option = optionObjects[key].values.find(el => { return !!el[variables[key]]; });
  return !!option ? option[variables[key]][subkey] : null;
};

module.exports = {
  run,
};

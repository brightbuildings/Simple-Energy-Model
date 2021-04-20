/* eslint-disable no-unused-vars */
const FinancialService = require("./FinancialService");
const _Big = require("big.js");
const Big = (v) => _Big(v || 0);

const inputs = {
  "winterSetpoint": 20.0,
  "summerSetpoint": 25.0,
  "groundTemperature": 5.0,
  "winterDesignTemperature": -40.0,
  "summerDesignDB": 30.0,
  "summerDesignWB": 21.0,
};

const getHeatingAndCooling = (variables, optionObjects, isAlternate = false) => {

  let tfa = variables.interiorFloorArea;
  try {
    if (tfa == null || Big(tfa).eq(0)) {
      tfa = 1;
    }
  } catch {
    tfa = 1;
  }

  // Inputs
  const heatingDeltaT = Big(inputs.winterSetpoint).minus(inputs.winterDesignTemperature);
  const coolingDeltaT = Big(inputs.summerDesignDB).minus(inputs.summerSetpoint);
  const summerSetpointEnthalpy = 50.0;
  const summerDesignEnthalpy = 61.0;
  const coolingDeltaHRaw = Big(summerDesignEnthalpy).minus(summerSetpointEnthalpy); // kJ/kg
  const coolingDeltaH = Big(coolingDeltaHRaw).div(3.6); // Wh/kg
  const airDensity = Big(1).div(0.87);
  const ventilationEfficiency = Big(getOption("ventilation", "efficiency", variables, optionObjects, isAlternate));
  const infiltrationAnnualEnergy = Big(getOption("airtightness", "annualEnergy", variables, optionObjects, isAlternate));
  const infiltrationHeatingLoad = Big(getOption("airtightness", "heatingLoad", variables, optionObjects, isAlternate));
  const ventilation = Big(0.3);
  const infiltrationAnnualEnergyAirflowRate = Big(variables.buildingVolume).times(infiltrationAnnualEnergy);
  const infiltrationHeatingLoadAirflowRate = Big(variables.buildingVolume).times(infiltrationHeatingLoad);
  const ventilationAirflowRate = Big(tfa).times(2.5).times(ventilation);

  // Calculations
  // Opaque Assemblies
  // U Value (W/m2K)
  const wallAboveGradeU = Big(getOption("wallAboveGrade", "u", variables, optionObjects, isAlternate));
  const wallBelowGradeU = Big(getOption("wallBelowGrade", "u", variables, optionObjects, isAlternate));
  const roofU = Big(getOption("roof", "u", variables, optionObjects, isAlternate));
  const floorU = Big(getOption("floor", "u", variables, optionObjects, isAlternate));
  const doorU = Big(getOption("solidDoor", "u", variables, optionObjects, isAlternate));
  // Area (m2)
  const height = Big(variables.height);
  const length = Big(variables.length);
  const width = Big(variables.width);
  const north = Big(variables.north);
  const east = Big(variables.east);
  const south = Big(variables.south);
  const west = Big(variables.west);
  const depth = Big(variables.depth);
  const exteriorSolidDoorArea = Big(variables.exteriorSolidDoorArea);
  const a = length.times(height).times(2);
  const b = width.times(height).times(2);
  const c = north.plus(east).plus(south).plus(west).plus(exteriorSolidDoorArea);
  const wallAboveGradeArea = a.plus(b).minus(c);
  const d = length.times(depth).times(2);
  const e = width.times(depth).times(2);
  const wallBelowGradeArea = d.plus(e);
  const roofArea = Big(variables.roofArea);
  const floorArea = Big(variables.floorArea);
  const doorArea = exteriorSolidDoorArea;
  const totalAreaLessDoor = wallAboveGradeArea.plus(wallBelowGradeArea).plus(roofArea).plus(floorArea);
  const totalWindowArea = c;

  // Heating (Delta T C)
  const wallAboveGradeHeating = heatingDeltaT;
  const wallBelowGradeHeating = Big(inputs.winterSetpoint).minus(inputs.groundTemperature);
  const roofHeating = heatingDeltaT;
  const floorHeating = Big(inputs.winterSetpoint).minus(inputs.groundTemperature);
  const doorHeating = heatingDeltaT;
  // Q = UA Delta T
  // Transmission (W)
  const wallAboveGradeTransmission = Big(wallAboveGradeU).times(wallAboveGradeArea).times(wallAboveGradeHeating);
  const wallBelowGradeTransmission = Big(wallBelowGradeU).times(wallBelowGradeArea).times(wallBelowGradeHeating);
  const roofTransmission = Big(roofU).times(roofArea).times(roofHeating);
  const floorTransmission = Big(floorU).times(floorArea).times(floorHeating);
  const doorTransmission = Big(doorU).times(doorArea).times(doorHeating);
  // Q = V Delta T c
  // Infiltration (W)
  const wallAboveGradeInfiltration = Big(infiltrationHeatingLoadAirflowRate).times(heatingDeltaT).times(0.33);
  // Ventilation (W)
  const wallAboveGradeVentilation = Big(ventilationAirflowRate).times(heatingDeltaT).times(0.33).times(Big(1.0).minus(ventilationEfficiency));
  // Solar Gains
  // Window Shading Faator
  const windowShadingFactor = 0.75 * 0.95 * 0.85 * 0.75;

  // Cooling (Delta T C)
  const wallAboveGradeCoolingDeltaT = Big(coolingDeltaT);
  const roofCoolingDeltaT = Big(coolingDeltaT);
  const doorCoolingDeltaT = Big(coolingDeltaT);
  const wallAboveGradeCoolingTransmission = Big(wallAboveGradeU).times(wallAboveGradeArea).times(wallAboveGradeCoolingDeltaT);
  const roofCoolingTransmission = Big(roofU).times(roofArea).times(roofCoolingDeltaT);
  const doorCoolingTransmission = Big(doorU).times(doorArea).times(doorCoolingDeltaT);
  const coolingInfiltration = Big(airDensity).times(infiltrationHeatingLoadAirflowRate).times(coolingDeltaH);
  const coolingVentilation = Big(airDensity).times(ventilationAirflowRate).times(coolingDeltaH).times(Big(1.0).minus(ventilationEfficiency));
  const peopleWPer = Big(130);
  const lightingWm2 = Big(5);
  const equipmentWm2 = Big(5);
  const people = Big(peopleWPer).times(variables.people);
  const lighting = Big(lightingWm2).times(tfa);
  const equipment = Big(equipmentWm2).times(tfa);

  // Transparent Assemblies
  const northU = getOption('windows', 'u', variables, optionObjects, isAlternate);
  const eastU = getOption('windows', 'u', variables, optionObjects, isAlternate);
  const southU = getOption('windows', 'u', variables, optionObjects, isAlternate);
  const westU = getOption('windows', 'u', variables, optionObjects, isAlternate);
  const northSHGC = getOption('windows', 'shgc', variables, optionObjects, isAlternate);
  const eastSHGC = getOption('windows', 'shgc', variables, optionObjects, isAlternate);
  const southSHGC = getOption('windows', 'shgc', variables, optionObjects, isAlternate);
  const westSHGC = getOption('windows', 'shgc', variables, optionObjects, isAlternate);
  const northGlazingArea = Big(north).times(0.75);
  const eastGlazingArea = Big(east).times(0.75);
  const southGlazingArea = Big(south).times(0.75);
  const westGlazingArea = Big(west).times(0.75);
  const summerShadingFactor = 0.60;
  const northDirection = 360;
  const eastDirection = 90
  const southDirection = 180;
  const westDirection = 270;
  const northSolarGains = 93;
  const eastSolarGains = 285;
  const southSolarGains = 208;
  const westSolarGains = 285;
  const northHeatingLoad = Big(northU).times(north).times(Big(inputs.winterSetpoint).minus(inputs.winterDesignTemperature));
  const eastHeatingLoad = Big(eastU).times(east).times(Big(inputs.winterSetpoint).minus(inputs.winterDesignTemperature));
  const southHeatingLoad = Big(southU).times(south).times(Big(inputs.winterSetpoint).minus(inputs.winterDesignTemperature));
  const westHeatingLoad = Big(westU).times(west).times(Big(inputs.winterSetpoint).minus(inputs.winterDesignTemperature));
  const northCoolingLoadConduction = Big(northU).times(north).times(Big(inputs.summerDesignDB).minus(inputs.summerSetpoint));
  const eastCoolingLoadConduction = Big(eastU).times(east).times(Big(inputs.summerDesignDB).minus(inputs.summerSetpoint));
  const southCoolingLoadConduction = Big(southU).times(south).times(Big(inputs.summerDesignDB).minus(inputs.summerSetpoint));
  const westCoolingLoadConduction = Big(westU).times(west).times(Big(inputs.summerDesignDB).minus(inputs.summerSetpoint));
  const northCoolingSolarGain = Big(northSHGC).times(northGlazingArea).times(summerShadingFactor).times(northSolarGains);
  const eastCoolingSolarGain = Big(eastSHGC).times(eastGlazingArea).times(summerShadingFactor).times(eastSolarGains);
  const southCoolingSolarGain = Big(southSHGC).times(southGlazingArea).times(summerShadingFactor).times(southSolarGains);
  const westCoolingSolarGain = Big(westSHGC).times(westGlazingArea).times(summerShadingFactor).times(westSolarGains);
  const northTotalCoolingLoad = Big(northCoolingLoadConduction).plus(northCoolingSolarGain);
  const eastTotalCoolingLoad = Big(eastCoolingLoadConduction).plus(eastCoolingSolarGain);
  const southTotalCoolingLoad = Big(southCoolingLoadConduction).plus(southCoolingSolarGain);
  const westTotalCoolingLoad = Big(westCoolingLoadConduction).plus(westCoolingSolarGain);

  const totalHeatingQ = Big(wallAboveGradeTransmission).plus(wallBelowGradeTransmission).plus(roofTransmission).plus(floorTransmission).plus(doorTransmission).plus(wallAboveGradeInfiltration).plus(wallAboveGradeVentilation).plus(northHeatingLoad).plus(eastHeatingLoad).plus(southHeatingLoad).plus(westHeatingLoad);
  const totalCoolingQ = Big(wallAboveGradeCoolingTransmission).plus(roofCoolingTransmission).plus(doorCoolingTransmission).plus(coolingInfiltration).plus(coolingVentilation).plus(people).plus(lighting).plus(equipment).plus(northTotalCoolingLoad).plus(eastTotalCoolingLoad).plus(southTotalCoolingLoad).plus(westTotalCoolingLoad);

  return {
    totalHeatingQ,
    totalCoolingQ,
    totalAreaLessDoor,
    totalWindowArea,
  };
};

const getAnnualSpaceHeating = (variables, optionObjects, isAlternate = false) => {
  let tfa = variables.interiorFloorArea;
  try {
    if (tfa == null || Big(tfa).eq(0)) {
      tfa = 1;
    }
  } catch {
    tfa = 1;
  }
  const groundReductionFactor = 0.5;
  // Transmission Losses
  const height = Big(variables.height);
  const length = Big(variables.length);
  const width = Big(variables.width);
  const north = Big(variables.north);
  const east = Big(variables.east);
  const south = Big(variables.south);
  const west = Big(variables.west);
  const depth = Big(variables.depth);
  const exteriorSolidDoorArea = Big(variables.exteriorSolidDoorArea);
  const northU = getOption('windows', 'u', variables, optionObjects, isAlternate);
  const eastU = getOption('windows', 'u', variables, optionObjects, isAlternate);
  const southU = getOption('windows', 'u', variables, optionObjects, isAlternate);
  const westU = getOption('windows', 'u', variables, optionObjects, isAlternate);
  const a = length.times(height).times(2);
  const b = width.times(height).times(2);
  const c = north.plus(east).plus(south).plus(west).plus(exteriorSolidDoorArea);
  const wallAboveGradeArea = a.plus(b).minus(c);
  const d = length.times(depth).times(2);
  const e = width.times(depth).times(2);
  const wallBelowGradeArea = d.plus(e);
  const roofArea = Big(variables.roofArea);
  const floorArea = Big(variables.floorArea);
  const doorArea = exteriorSolidDoorArea;
  const windowArea = Big(north).plus(east).plus(south).plus(west);
  const wallAboveGradeU = getOption("wallAboveGrade", "u", variables, optionObjects, isAlternate);
  const wallBelowGradeU = getOption("wallBelowGrade", "u", variables, optionObjects, isAlternate);
  const roofU = getOption("roof", "u", variables, optionObjects, isAlternate);
  const floorU = getOption("floor", "u", variables, optionObjects, isAlternate);
  const doorU = getOption("solidDoor", "u", variables, optionObjects, isAlternate);
  const windowsU = (Big(northU).plus(eastU).plus(southU).plus(westU)).div(4);
  const heatingDegreeHours = Big(variables.heatingDegreeHours);
  const wallAboveGradeG1 = heatingDegreeHours;
  const wallBelowGradeG1 = Big(groundReductionFactor).times(heatingDegreeHours);
  const roofG1 = Big(heatingDegreeHours);
  const floorG1 = Big(heatingDegreeHours).times(groundReductionFactor);
  const exteriorDoorsG1 = Big(heatingDegreeHours);
  const windowsG1 = Big(heatingDegreeHours);
  const wallAboveGradeG1kwha = Big(wallAboveGradeArea).times(wallAboveGradeU).times(wallAboveGradeG1);
  const wallBelowGradeG1kwha = Big(wallBelowGradeArea).times(wallBelowGradeU).times(wallBelowGradeG1);
  const roofG1kwha = Big(roofArea).times(roofU).times(roofG1);
  const floorG1kwha = Big(floorArea).times(floorU).times(floorG1);
  const exteriorDoorsG1kwha = Big(doorArea).times(doorU).times(exteriorDoorsG1);
  const windowsG1kwha = Big(windowArea).times(windowsU).times(windowsG1);
  const totalG1kwha = Big(wallAboveGradeG1kwha).plus(wallBelowGradeG1kwha).plus(roofG1kwha).plus(floorG1kwha).plus(exteriorDoorsG1kwha).plus(windowsG1kwha);

  // Ventilation + Infiltration Losses
  const ventilationRaw = 0.3;
  const ventilationEfficiency = getOption("ventilation", "efficiency", variables, optionObjects, isAlternate);
  const ventilationLoss = Big(ventilationRaw).times(Big(1).minus(ventilationEfficiency));
  const infiltrationLoss = getOption("airtightness", "annualEnergy", variables, optionObjects, isAlternate);
  const ventilationVolume = Big(tfa).times(2.5);
  const infiltrationVolume = Big(tfa).times(2.5);
  const ventilationCAir = 0.33;
  const infiltrationCAir = 0.33;
  const ventilationG1 = heatingDegreeHours;
  const infiltrationG1 = heatingDegreeHours;
  const ventilationkwha = Big(ventilationLoss).times(ventilationVolume).times(ventilationCAir).times(ventilationG1);
  const infiltrationkwha = Big(infiltrationLoss).times(infiltrationVolume).times(infiltrationCAir).times(infiltrationG1);
  const totalLoss = Big(ventilationkwha).plus(infiltrationkwha).plus(totalG1kwha);


  // Solar Gains
  const northWinterShadingFactor = Big(0.75).times(0.95).times(0.85).times(0.75);
  const eastWinterShadingFactor = northWinterShadingFactor;
  const southWinterShadingFactor = northWinterShadingFactor;
  const westWinterShadingFactor = northWinterShadingFactor;
  const northSHGC = getOption('windows', 'shgc', variables, optionObjects, isAlternate);
  const eastSHGC = getOption('windows', 'shgc', variables, optionObjects, isAlternate);
  const southSHGC = getOption('windows', 'shgc', variables, optionObjects, isAlternate);
  const westSHGC = getOption('windows', 'shgc', variables, optionObjects, isAlternate);
  const northRadiation = 133.0;
  const eastRadiation = 374.0;
  const southRadiation = 790.0;
  const westRadiation = 382.0;
  const northKwha = Big(northWinterShadingFactor).times(northSHGC).times(north).times(northRadiation);
  const eastKwha = Big(eastWinterShadingFactor).times(eastSHGC).times(east).times(eastRadiation);
  const southKwha = Big(southWinterShadingFactor).times(southSHGC).times(south).times(southRadiation);
  const westKwha = Big(westWinterShadingFactor).times(westSHGC).times(west).times(westRadiation);
  const totalSolarGainsKwha = Big(northKwha).plus(eastKwha).plus(southKwha).plus(westKwha);

  // Internal Heat Gains
  const lengthOfHeatingPeriod = 215.0;
  const specPower = 2.5;
  const totalInternalHeatGainsKwha = Big(lengthOfHeatingPeriod).times(specPower).times(tfa).times(0.024);
  const totalGains = Big(totalSolarGainsKwha).plus(totalInternalHeatGainsKwha);
  const utilizationFactor = 0.85;
  
  // Totals
  const annualHeatingDemand = Big(totalLoss).minus(Big(totalGains).times(utilizationFactor));
  let spaceHeatingDemand = null;
  try {
    spaceHeatingDemand = Big(annualHeatingDemand).div(tfa);
  } catch (e) {
    spaceHeatingDemand = 0;
  }

  return {
    wallAboveGradeG1kwha,
    wallBelowGradeG1kwha,
    roofG1kwha,
    floorG1kwha,
    exteriorDoorsG1kwha,
    windowsG1kwha,
    totalG1kwha,
    ventilationkwha,
    infiltrationkwha,
    totalLoss,
    annualHeatingDemand,
    spaceHeatingDemand,
    utilizationFactor,
    totalInternalHeatGainsKwha,
    totalSolarGainsKwha
  };
};

const getOutput = (variables, optionObjects, heatingAndCooling, annualSpaceHeating, isAlternate) => {
  const dhwDistributionLosses = 300.0;
  const heatingLoad = Big(heatingAndCooling.totalHeatingQ).div(1000).times(1.1);
  const coolingLoad = Big(heatingAndCooling.totalCoolingQ).div(1000);
  const spaceHeating = Big(annualSpaceHeating.annualHeatingDemand).div(getOption("heating", "efficiency", variables, optionObjects, isAlternate)).plus(850);
  const a = Big(25.0).times(getOption("hotWaterFixtures", "flow", variables, optionObjects, isAlternate)).plus(getOption("hotWaterHeaterStorage", "value", variables, optionObjects, isAlternate)).plus(dhwDistributionLosses).times(Big(1).minus(getOption("drainWaterHeatRecovery", "efficiency", variables, optionObjects, isAlternate))).times(variables.units);;
  const b = Big(getOption("hotWaterHeater", "efficiency",variables, optionObjects, isAlternate))
  const hotWater = a.div(b);
  const lightsAppliancesPlugs = (Big(getOption("lighting", "value", variables, optionObjects, isAlternate)).plus(getOption("appliances", "value", variables, optionObjects, isAlternate)).plus(getOption("plugLoads", "value", variables, optionObjects, isAlternate))).times(365).times(variables.units);
  const totalEnergyConsumption = Big(spaceHeating).plus(hotWater).plus(lightsAppliancesPlugs);
  const spaceHeatingDemand = Big(annualSpaceHeating.spaceHeatingDemand);

  const carbonPrice = Big(variables.carbonPrice);
  const spaceHeatingFuelTypePriceKey = getOption("spaceHeatingFuelType", "priceKey", variables, optionObjects, isAlternate)
  const hotWaterFuelTypePriceKey = getOption("hotWaterFuelType", "priceKey", variables, optionObjects, isAlternate);
  const lightsAppliancesPlugsFuelTypePriceKey = getOption("lightsAppliancesPlugsFuelType", "priceKey", variables, optionObjects, isAlternate);
  const spaceHeatingFuelTypeCarbonKey = getOption("spaceHeatingFuelType", "carbonKey", variables, optionObjects, isAlternate)
  const hotWaterFuelTypeCarbonKey = getOption("hotWaterFuelType", "carbonKey", variables, optionObjects, isAlternate);
  const lightsAppliancesPlugsFuelTypeCarbonKey = getOption("lightsAppliancesPlugsFuelType", "carbonKey", variables, optionObjects, isAlternate);
  const spaceHeatingPrice = variables[spaceHeatingFuelTypePriceKey];
  const hotWaterPrice = variables[hotWaterFuelTypePriceKey];
  const lightsAppliancesPlugsPrice = variables[lightsAppliancesPlugsFuelTypePriceKey];
  const spaceHeatingUnits = variables[spaceHeatingFuelTypeCarbonKey];
  const hotWaterUnits = variables[hotWaterFuelTypeCarbonKey];
  const lightsAppliancesPlugsUnits = variables[lightsAppliancesPlugsFuelTypeCarbonKey];
  const spaceHeatingCarbonCost = Big(spaceHeatingUnits).div(1000).times(carbonPrice);
  const hotWaterCarbonCost = Big(hotWaterUnits).div(1000).times(carbonPrice);
  const lightsAppliancesPlugsCarbonCost = Big(lightsAppliancesPlugsUnits).div(1000).times(carbonPrice);
  const spaceHeatingTotalPrice = Big(spaceHeatingPrice).plus(spaceHeatingCarbonCost);
  const hotWaterTotalPrice = Big(hotWaterPrice).plus(hotWaterCarbonCost);
  const lightsAppliancesPlugsTotalPrice = Big(lightsAppliancesPlugsPrice).plus(lightsAppliancesPlugsCarbonCost);
  let adjustmentAmount = 278.4;
  if (spaceHeatingFuelTypeCarbonKey === "electricityCarbon" || spaceHeatingFuelTypeCarbonKey === "cleanElectricityCarbon") {
    adjustmentAmount = 0;
  }
  const spaceHeatingAnnualCost = Big(spaceHeatingTotalPrice).times(spaceHeating).plus(adjustmentAmount);
  const hotWaterAnnualCost = Big(hotWaterTotalPrice).times(hotWater);
  const lightsAppliancesPlugsAnnualCost = Big(lightsAppliancesPlugsTotalPrice).times(lightsAppliancesPlugs);

  const totalEnergyCosts = Big(spaceHeatingAnnualCost).plus(hotWaterAnnualCost).plus(lightsAppliancesPlugsAnnualCost);

  return {
    heatingLoad,
    coolingLoad,
    spaceHeating,
    hotWater,
    lightsAppliancesPlugs,
    totalEnergyConsumption,
    spaceHeatingDemand,
    spaceHeatingAnnualCost,
    hotWaterAnnualCost,
    lightsAppliancesPlugsAnnualCost,
    totalEnergyCosts,
  };
};

const getEconomics = (variables, outputA) => {
  const designCost = parseFloat(variables.designCost);
  const designQuantity = parseFloat(variables.designQuantity);
  const airtightnessCost = parseFloat(variables.airtightnessCost)
  const airtightnessQuantity = parseFloat(variables.airtightnessQuantity);
  const windowsCost = parseFloat(variables.windowsCost);
  const windowsQuantity = parseFloat(variables.windowsQuantity);
  const insulationCost = parseFloat(variables.insulationCost);
  const insulationQuantity = parseFloat(variables.insulationQuantity);
  const ventilationCost = parseFloat(variables.ventilationCost);
  const ventilationQuantity = parseFloat(variables.ventilationQuantity);
  const heatPumpCost = parseFloat(variables.heatPumpCost);
  const heatPumpQuantity = parseFloat(variables.heatPumpQuantity);
  const waterHeaterCost = parseFloat(variables.waterHeaterCost);
  const waterHeaterQuantity = parseFloat(variables.waterHeaterQuantity);
  const solarCost = parseFloat(variables.solarCost);
  const solarQuantity = parseFloat(variables.solarQuantity);
  const batteryCost = parseFloat(variables.batteryCost);
  const batteryQuantity = parseFloat(variables.batteryQuantity);
  const energyMonitorCost = parseFloat(variables.energyMonitorCost);
  const energyMonitorQuantity = parseFloat(variables.energyMonitorQuantity);

  const design = designCost * designQuantity;
  const airtightness = airtightnessCost * airtightnessQuantity;
  const windows = windowsCost * windowsQuantity;
  const insulation = insulationCost * insulationQuantity;
  const ventilation = ventilationCost * ventilationQuantity;
  const heatPump = heatPumpCost * heatPumpQuantity;
  const waterHeater = waterHeaterCost * waterHeaterQuantity;
  const solar = solarCost * solarQuantity;
  const battery = batteryCost * batteryQuantity;
  const energyMonitor = energyMonitorCost * energyMonitorQuantity;
  const total = design + airtightness + windows + insulation + ventilation + heatPump + waterHeater + solar + battery + energyMonitor;

  // Business Case
  const investment = total;
  const annualSavings = outputA.totalEnergyCosts;
  const payback = total / annualSavings;
  const guess = 0.06;
  const years = [];
  const numberOfYears = 21;
  const startingYear = 1;
  const energyInflation = 0.02;
  let accumulation = null;
  let accumulationSum = 0;
  let netSavings = 0;
  for (let year = startingYear; year <= numberOfYears; year++) {
    accumulation = year === startingYear ? investment : accumulation - annualSavings;
    netSavings += year === startingYear ? -investment : annualSavings;
    accumulationSum += accumulation;
  }
  const irr = FinancialService.IRR(accumulationSum, 0.06);
  const paceLoanTerm = parseInt(variables.paceLoanTerm);
  const interest = parseFloat(variables.interest);
  const monthsInYear = 12;
  const monthlyPayments = -FinancialService.PMT(interest/monthsInYear, paceLoanTerm * monthsInYear, investment);
  const monthlySavings = annualSavings / monthsInYear;
  const monthlyNetSavings = monthlySavings - monthlyPayments;

  return {
    design,
    airtightness,
    windows,
    insulation,
    ventilation,
    heatPump,
    waterHeater,
    solar,
    battery,
    energyMonitor,
    annualSavings,
    accumulationSum,
    investment,
    irr,
    monthlyPayments,
    monthlySavings,
    monthlyNetSavings
  }
};

const getFinancing = (heatingAndCooling, output) => {
  const windowsQuantity = heatingAndCooling.totalWindowArea.toFixed(1);
  const airtightnessQuantity = heatingAndCooling.totalAreaLessDoor.toFixed(1);
  const insulationQuantity = heatingAndCooling.totalAreaLessDoor.toFixed(1);
  const solarQuantity = output.totalEnergyConsumption.div(1032).div(Big(0.35).div(1.7)).toFixed(1);

  return {
    windowsQuantity,
    airtightnessQuantity,
    insulationQuantity,
    solarQuantity,
  };
};

const getMaximumEnergy = (a, b) => {
  const aEnergy = Big(a.spaceHeating).plus(a.hotWater).plus(a.lightsAppliancesPlugs);
  const bEnergy = Big(b.spaceHeating).plus(b.hotWater).plus(b.lightsAppliancesPlugs);
  return Math.ceil(Math.max(aEnergy.toString(), bEnergy.toString())/10000)*10000;
};

const getOption = (key, subkey, variables, optionObjects, isAlternate) => {
  const optionKey = isAlternate ? key + "B" : key;
  const options = optionObjects[optionKey] || optionObjects[key];
  if (options == null) {
    return null;
  }
  const option = options.values.find(el => { 
    const elArray = Object.entries(el);
    return elArray[0][0] === variables[optionKey];
  });

  const variable = variables?.[optionKey];
  return option?.[variable]?.[subkey];
};

const run = (variables, optionObjects) => {
  const isAlternate = true;
  const heatingAndCoolingA = getHeatingAndCooling(variables, optionObjects);
  const heatingAndCoolingB = getHeatingAndCooling(variables, optionObjects, isAlternate);
  const annualSpaceHeatingA = getAnnualSpaceHeating(variables, optionObjects);
  const annualSpaceHeatingB = getAnnualSpaceHeating(variables, optionObjects, isAlternate);
  const outputA = getOutput(variables, optionObjects, heatingAndCoolingA, annualSpaceHeatingA);
  const outputB = getOutput(variables, optionObjects, heatingAndCoolingB, annualSpaceHeatingB, isAlternate);
  const economics = getEconomics(variables, outputA);
  const financing = getFinancing(heatingAndCoolingB, outputB);
  const maxEnergy = getMaximumEnergy(outputA, outputB);

  return {
    heatingAndCoolingA,
    annualSpaceHeatingA,
    heatingAndCoolingB,
    annualSpaceHeatingB,
    outputA,
    outputB,
    economics,
    financing,
    maxEnergy
  };
};

const CalculationService = {
  run,
  getOption,
  getOutput,
  getEconomics,
  getHeatingAndCooling,
  getAnnualSpaceHeating,
};

export default CalculationService;

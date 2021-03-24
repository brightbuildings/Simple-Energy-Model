import { run, getOption, getOutput, getHeatingAndCooling, getAnnualSpaceHeating } from "./CalculationService";

test("run executes with empty inputs", () => {
  const objectOptions = [];
  const variables = {};
  const getOption = jest.fn();
  const getHeatingAndCooling = jest.fn();
  const getAnnualSpaceHeating = jest.fn();
  const getOutput = jest.fn();
  const result = {"annualSpaceHeatingA": {"annualHeatingDemand": NaN, "infiltrationkwha": NaN, "spaceHeatingDemand": NaN, "totalG1kwha": NaN, "ventilationkwha": NaN}, "annualSpaceHeatingB": {"annualHeatingDemand": NaN, "infiltrationkwha": NaN, "spaceHeatingDemand": NaN, "totalG1kwha": NaN, "ventilationkwha": NaN}, "heatingAndCoolingA": {"totalCoolingQ": NaN, "totalHeatingQ": NaN}, "heatingAndCoolingB": {"totalCoolingQ": NaN, "totalHeatingQ": NaN}, "outputA": {"coolingLoad": NaN, "heatingLoad": NaN, "hotWater": NaN, "hotWaterCost": undefined, "lightsAppliancesPlugs": NaN, "lightsAppliancesPlugsCost": undefined, "spaceHeating": NaN, "spaceHeatingCost": undefined, "spaceHeatingDemand": NaN, "totalEnergyConsumption": NaN, "totalEnergyCosts": NaN}, "outputB": {"coolingLoad": NaN, "heatingLoad": NaN, "hotWater": NaN, "hotWaterCost": undefined, "lightsAppliancesPlugs": NaN, "lightsAppliancesPlugsCost": undefined, "spaceHeating": NaN, "spaceHeatingCost": undefined, "spaceHeatingDemand": NaN, "totalEnergyConsumption": NaN, "totalEnergyCosts": NaN}};
  
  expect(run(variables, objectOptions)).toEqual(result);
});

// Meatier tests can come later
test.todo("getEconomics");
test.todo("run executes with filled inputs");
test.todo("getOption");
test.todo("output");
test.todo("getHeatingAndCooling");
test.todo("getAnnualSpaceHeating");
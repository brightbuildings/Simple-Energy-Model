import { run, getOption, output, heatingAndCooling, annualSpaceHeating } from "./CalculationService";

test("run executes with empty inputs", () => {
  const objectOptions = [];
  const variables = {};
  const getOption = jest.fn();
  const heatingAndCooling = jest.fn();
  const annualSpaceHeating = jest.fn();
  const output = jest.fn();
  const result = {"annualSpaceHeatingA": {"annualHeatingDemand": NaN, "infiltrationkwha": NaN, "spaceHeatingDemand": NaN, "totalG1kwha": NaN, "ventilationkwha": NaN}, "annualSpaceHeatingB": {"annualHeatingDemand": NaN, "infiltrationkwha": NaN, "spaceHeatingDemand": NaN, "totalG1kwha": NaN, "ventilationkwha": NaN}, "heatingAndCoolingA": {"totalCoolingQ": NaN, "totalHeatingQ": NaN}, "heatingAndCoolingB": {"totalCoolingQ": NaN, "totalHeatingQ": NaN}, "outputA": {"coolingLoad": NaN, "heatingLoad": NaN, "hotWater": NaN, "hotWaterCost": undefined, "lightsAppliancesPlugs": NaN, "lightsAppliancesPlugsCost": undefined, "spaceHeating": NaN, "spaceHeatingCost": undefined, "spaceHeatingDemand": NaN, "totalEnergyConsumption": NaN, "totalEnergyCosts": NaN}, "outputB": {"coolingLoad": NaN, "heatingLoad": NaN, "hotWater": NaN, "hotWaterCost": undefined, "lightsAppliancesPlugs": NaN, "lightsAppliancesPlugsCost": undefined, "spaceHeating": NaN, "spaceHeatingCost": undefined, "spaceHeatingDemand": NaN, "totalEnergyConsumption": NaN, "totalEnergyCosts": NaN}};
  
  expect(run(variables, objectOptions)).toEqual(result);
});

// Meatier tests can come later
test.todo("run executes with filled inputs");
test.todo("getOption");
test.todo("output");
test.todo("heatingAndCooling");
test.todo("annualSpaceHeating");
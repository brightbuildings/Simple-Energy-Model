import { load, getAllOptionsObjects } from './DataService';

test("load() loads a file", () => {
  expect(load()).not.toBeFalsy();
});

test.todo("getAllOptionsObjects generates a result from a nested input")
// test("getAllOptionsObjects generates a result from a nested input", () => {
//   const data = {
//     "parametersA": {
//       "fields": {
//         "build": {
//           "fields": {
//             "airtightness": {
//               "type": "select",
//               "values": [
//                 { "0.6 (Passivhaus)": {
//                   "annualEnergy": 0.0522074784276127,
//                   "heatingLoad": 0.130518696069032
//                 } },
//                 { "0.8": {
//                   "annualEnergy": 0.0696099712368169,
//                   "heatingLoad": 0.174024928092042
//                 } }
//               ]
//             }
//           }
//         }
//       }
//     }
//   };

//   const load = jest.fn().mockReturnValue(data);
//   const result = getAllOptionsObjects();
//   expect(result).toBe();
// });
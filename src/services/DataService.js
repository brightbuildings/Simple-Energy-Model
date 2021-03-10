const data = require("../data/input.json");

function load() {
  return data;
}

function getAllOptionsObjects() {
  const data = load();
  const optionObjects = [];
  Object.entries(data).forEach(i => {
    if (i[1].fields) {
      Object.entries(i[1].fields).forEach(j => {
        if (j[1].fields) {
          Object.entries(j[1].fields).forEach(k => {
            const [key, value] = k;
            if (value.type === "select") {
              optionObjects[key] = value;
            }
          });
        }
      })
    }
  });
  return optionObjects;
}

module.exports = {
  load,
  getAllOptionsObjects,
};

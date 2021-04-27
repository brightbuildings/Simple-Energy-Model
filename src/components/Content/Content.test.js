import { Content, formatSections, formatNavigation, FormatQuestion, setDefaultVariables, getGlossarySection } from './Content';
import renderer from "react-test-renderer";

jest.mock('react-chartjs-2', () => ({
  Bar: () => null
}));

const json = {
  "introduction": {
    "label": "Test Label",
    "content": "Test Content",
    "fields": {}
  }
};

const variables = {};

const setVariables = jest.fn();

const questionFloat = [
  "questionFloat",
  {
    "required": true,
    "type": "float",
    "label": "Float",
  }
];

const questionInteger = [
  "question2Key",
  {
    "required": false,
    "type": "integer",
    "label": "Integer",
    "unit": "IBU"
  }
];

const questionText = [
  "question3Key",
  {
    "required": true,
    "type": "text",
    "label": "Text Label"
  }
];

const questionGap = [
  "question4Key",
  {
    "type": "gap"
  }
];

const questionSelect = [
  "question5Key",
  {
    "required": false,
    "type": "select",
    "label": "Select",
    "unit": "IBU",
    "values": [
      { "Electricity": {} },
      { "Clean Electricity": {} },
      { "Natural Gass (Fossil)": {} },
      { "Clean Gas": {} },
      { "Propane": {} },
      { "Wood Pellets": {} }
    ]
  }
]

test("runs formatSection with empty json", () => {
  expect(formatSections()).toBeUndefined();
});

test("runs formatSection with json", () => {
  const result = formatSections(json);
  expect(result).not.toBeUndefined();
});

test("runs formatNavigation with empty json", () => {
  expect(formatSections()).toBeUndefined();
});

test("runs formatNavigation with json", () => {
  const result = formatNavigation(json);
  expect(result).not.toBeUndefined();
});

test("runs FormatQuestion with empty question", () => {
  expect(FormatQuestion({})).toBeNull();
});

test("runs FormatQuestion with float question", () => {
  const result = FormatQuestion(questionFloat, variables, setVariables);
  expect(result).not.toBeUndefined();
});

test("runs FormatQuestion with integer question", () => {
  const result = FormatQuestion(questionInteger, variables, setVariables);
  expect(result).not.toBeUndefined();
});

test("runs FormatQuestion with text question", () => {
  const result = FormatQuestion(questionText, variables, setVariables);
  expect(result).not.toBeUndefined();
});

test("runs FormatQuestion with gap question", () => {
  const result = FormatQuestion(questionGap, variables, setVariables);
  expect(result).not.toBeUndefined();
});

test("renders FormatQuestion with float question", () => {
  const result = renderer.create(FormatQuestion(questionFloat, variables, setVariables));
  expect(result).toMatchSnapshot();
});

test("renders FormatQuestion with integer question", () => {
  const result = renderer.create(FormatQuestion(questionInteger, variables, setVariables));
  expect(result).toMatchSnapshot();
});

test("renders FormatQuestion with text question", () => {
  const result = renderer.create(FormatQuestion(questionText, variables, setVariables));
  expect(result).toMatchSnapshot();
});

test("renders FormatQuestion with gap question", () => {
  const result = renderer.create(FormatQuestion(questionGap, variables, setVariables));
  expect(result).toMatchSnapshot();
});

test("renders FormatQuestion with select question", () => {
  const result = renderer.create(FormatQuestion(questionSelect, variables, setVariables));
  expect(result).toMatchSnapshot();
});

test("renders getGlossarySection", () => {
  const result = renderer.create(getGlossarySection("glossary"));
  expect(result).toMatchSnapshot();
});

test.todo("renders getSidebar");

test("runs setDefaultVariables", () => {
    const data = {
    "parametersA": {
      "fields": {
        "build": {
          "fields": {
            "test": {
              "type": "float",
              "default": "test"
            }
          }
        }
      }
    }
  };
  const result = {"test": "test"};

  expect(setDefaultVariables(data)).toEqual(result);
});

test("renders Content", () => {
  const tree = renderer.create(<Content />).toJSON();
  expect(tree).toMatchSnapshot();
});

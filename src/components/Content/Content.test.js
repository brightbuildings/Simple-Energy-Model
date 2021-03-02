import { Content, formatSections, formatNavigation, formatQuestion } from './Content';
import renderer from "react-test-renderer";

const json = {
  "introduction": {
    "label": "Test Label",
    "content": "Test Content",
    "fields": {}
  }
};

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

test("runs formatQuestion with empty question", () => {
  expect(formatQuestion()).toBeUndefined();
});

test("runs formatQuestion with float question", () => {
  const result = formatQuestion(questionFloat);
  expect(result).not.toBeUndefined();
});

test("runs formatQuestion with integer question", () => {
  const result = formatQuestion(questionInteger);
  expect(result).not.toBeUndefined();
});

test("runs formatQuestion with text question", () => {
  const result = formatQuestion(questionText);
  expect(result).not.toBeUndefined();
});

test("runs formatQuestion with gap question", () => {
  const result = formatQuestion(questionGap);
  expect(result).not.toBeUndefined();
});

test("renders formatQuestion with float question", () => {
  const result = renderer.create(formatQuestion(questionFloat));
  expect(result).toMatchSnapshot();
});

test("renders formatQuestion with integer question", () => {
  const result = renderer.create(formatQuestion(questionInteger));
  expect(result).toMatchSnapshot();
});

test("renders formatQuestion with text question", () => {
  const result = renderer.create(formatQuestion(questionText));
  expect(result).toMatchSnapshot();
});

test("renders formatQuestion with gap question", () => {
  const result = renderer.create(formatQuestion(questionGap));
  expect(result).toMatchSnapshot();
});

test("renders Content", () => {
  const tree = renderer.create(<Content />).toJSON();
  expect(tree).toMatchSnapshot();
});

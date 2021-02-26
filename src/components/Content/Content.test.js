import { Content, formatSections, formatNavigation } from './Content';
import renderer from "react-test-renderer";

const json = {
  "introduction": {
    "label": "Test Label",
    "content": "Test Content"
  }
};

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

test("renders Content", () => {
  const tree = renderer.create(<Content />).toJSON();
  expect(tree).toMatchSnapshot();
});

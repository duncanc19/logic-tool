const toolRules = require('./toolRules');

test('string should return the same', () => {
  let formula = toolRules.buildTreeFromString('a∧b⇒c');
  let sameFormula = toolRules.convertTreeToString(formula);
  expect(sameFormula).toBe('a∧b⇒c');
});

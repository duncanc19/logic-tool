const toolRules = require('./toolRules');

// PARSING AND REPARSING INTO STRING TESTS
test('string should return the same', () => {
  let formula = toolRules.buildTreeFromString('a∧b⇒c');
  let sameFormula = toolRules.convertTreeToString(formula);
  expect(sameFormula).toBe('a∧b⇒c');
});

// IDEMPOTENCE TESTS
test('simple idempotence - should return a', () => {
  let formula = toolRules.buildTreeFromString('a∧a');
  let afterIdempotence = toolRules.applyRule(formula, 'idempotence');
  let asString = toolRules.convertTreeToString(afterIdempotence);
  expect(asString).toBe('a');
});

test('idempotence with brackets - should return a∧b', () => {
  let formula = toolRules.buildTreeFromString('(a∧b)∨(a∧b)');
  let afterIdempotence = toolRules.applyRule(formula, 'idempotence');
  let asString = toolRules.convertTreeToString(afterIdempotence);
  expect(asString).toBe('a∧b');
});

// COMMUTATIVITY TESTS
test('simple commutativity - applied to give b∧a', () => {
  let formula = toolRules.buildTreeFromString('a∧b');
  let afterCommutativity = toolRules.applyRule(formula, 'commutativity');
  let asString = toolRules.convertTreeToString(afterCommutativity);
  expect(asString).toBe('b∧a');
});

test('commutativity with brackets - applied to give (b∨c)∧(a∨b)', () => {
  let formula = toolRules.buildTreeFromString('(a∨b)∧(b∨c)');
  let afterCommutativity = toolRules.applyRule(formula, 'commutativity');
  let asString = toolRules.convertTreeToString(afterCommutativity);
  expect(asString).toBe('(b∨c)∧(a∨b)');
});

test('complex commutativity with brackets - applied to give (b∨(b∨c))∧(a∨(a∨b))', () => {
  let formula = toolRules.buildTreeFromString('(a∨(a∨b))∧(b∨(b∨c))');
  let afterCommutativity = toolRules.applyRule(formula, 'commutativity');
  let asString = toolRules.convertTreeToString(afterCommutativity);
  expect(asString).toBe('(b∨(b∨c))∧(a∨(a∨b))');
});

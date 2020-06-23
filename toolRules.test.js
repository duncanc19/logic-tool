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

// DOUBLE NEGATION TESTS
test('simple double negation(with brackets) - applied to give a', () => {
  let formula = toolRules.buildTreeFromString('¬(¬a)');
  let afterDoubleNegation = toolRules.applyRule(formula, 'doubleNegation');
  let asString = toolRules.convertTreeToString(afterDoubleNegation);
  expect(asString).toBe('a');
});

test('simple double negation(without brackets) - applied to give a', () => {
  let formula = toolRules.buildTreeFromString('¬¬a');
  let afterDoubleNegation = toolRules.applyRule(formula, 'doubleNegation');
  let asString = toolRules.convertTreeToString(afterDoubleNegation);
  expect(asString).toBe('a');
});

test('complex double negation - applied to give a∨b', () => {
  let formula = toolRules.buildTreeFromString('¬(¬(a∨b))');
  let afterDoubleNegation = toolRules.applyRule(formula, 'doubleNegation');
  let asString = toolRules.convertTreeToString(afterDoubleNegation);
  expect(asString).toBe('a∨b');
});

test('complex double negation - applied to give a∧(a∨b)', () => {
  let formula = toolRules.buildTreeFromString('¬(¬(a∧(a∨b)))');
  let afterDoubleNegation = toolRules.applyRule(formula, 'doubleNegation');
  let asString = toolRules.convertTreeToString(afterDoubleNegation);
  expect(asString).toBe('a∧(a∨b)');
});

// NEGATION TESTS
test('simple negation - applied to give false', () => {
  let formula = toolRules.buildTreeFromString('a∧(¬a)');
  let afterNegation = toolRules.applyRule(formula, 'negation');
  let asString = toolRules.convertTreeToString(afterNegation);
  expect(asString).toBe('false');
});

test('simple negation - applied to give true', () => {
  let formula = toolRules.buildTreeFromString('a∨(¬a)');
  let afterNegation = toolRules.applyRule(formula, 'negation');
  let asString = toolRules.convertTreeToString(afterNegation);
  expect(asString).toBe('true');
});

test('complex negation with brackets - applied to give false', () => {
  let formula = toolRules.buildTreeFromString('(a∧b)∧¬(a∧b)');
  let afterNegation = toolRules.applyRule(formula, 'negation');
  let asString = toolRules.convertTreeToString(afterNegation);
  expect(asString).toBe('false');
});

test('complex negation with brackets - applied to give true', () => {
  let formula = toolRules.buildTreeFromString('(a∧b)∨¬(a∧b)');
  let afterNegation = toolRules.applyRule(formula, 'negation');
  let asString = toolRules.convertTreeToString(afterNegation);
  expect(asString).toBe('true');
});

// IMPLICATION TESTS
test('simple implication - applied to give ¬a∨b', () => {
  let formula = toolRules.buildTreeFromString('a⇒b');
  let afterImplication = toolRules.applyRule(formula, 'implication');
  let asString = toolRules.convertTreeToString(afterImplication);
  expect(asString).toBe('¬a∨b');
});

test('simple reverse implication - applied to give ¬a∨b', () => {
  let formula = toolRules.buildTreeFromString('¬a∨b');
  let afterImplication = toolRules.applyRule(formula, 'implication');
  let asString = toolRules.convertTreeToString(afterImplication);
  expect(asString).toBe('a⇒b');
});

test('more complex implication - applied to give ¬(a∧b)∨b∧c', () => {
  let formula = toolRules.buildTreeFromString('(a∧b)⇒(b∧c)');
  let afterImplication = toolRules.applyRule(formula, 'implication');
  let asString = toolRules.convertTreeToString(afterImplication);
  expect(asString).toBe('¬(a∧b)∨b∧c'); // will remove brackets because of rules of precedence
});

test('more complex reverse implication - applied to give a∧b⇒b∧c', () => {
  let formula = toolRules.buildTreeFromString('¬(a∧b)∨b∧c');
  let afterImplication = toolRules.applyRule(formula, 'implication');
  let asString = toolRules.convertTreeToString(afterImplication);
  expect(asString).toBe('a∧b⇒b∧c'); // will remove brackets because of rules of precedence
});

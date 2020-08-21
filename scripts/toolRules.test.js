const toolRules = require('./toolRules');

// PARSING AND REPARSING INTO STRING TESTS
test('string should return the same', () => {
  let formula = toolRules.buildTreeFromString('a∧b⇒c');
  let sameFormula = toolRules.convertTreeToString(formula);
  expect(sameFormula).toBe('a∧b⇒c');
});

test('string should return the same', () => {
  let formula = toolRules.buildTreeFromString('p∧¬(q∧r)');
  let sameFormula = toolRules.convertTreeToString(formula);
  expect(sameFormula).toBe('p∧¬(q∧r)');
});

test('string should return the same with true', () => {
  let formula = toolRules.buildTreeFromString('true∧(a∨b)');
  let sameFormula = toolRules.convertTreeToString(formula);
  expect(sameFormula).toBe('true∧(a∨b)');
});

test('string should return the same with false', () => {
  let formula = toolRules.buildTreeFromString('false∨p');
  let sameFormula = toolRules.convertTreeToString(formula);
  expect(sameFormula).toBe('false∨p');
});

test('string should return the same with implication', () => {
  let formula = toolRules.buildTreeFromString('(p⇒q)⇒r');
  let sameFormula = toolRules.convertTreeToString(formula);
  expect(sameFormula).toBe('(p⇒q)⇒r');
});

test('string should return the same with bi-implication', () => {
  let formula = toolRules.buildTreeFromString('¬q⇔¬p');
  let sameFormula = toolRules.convertTreeToString(formula);
  expect(sameFormula).toBe('¬q⇔¬p');
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

test('idempotence applied wrongly - should return false', () => {
  let formula = toolRules.buildTreeFromString('p⇒q');
  let afterIdempotence = toolRules.applyRule(formula, 'idempotence');
  expect(afterIdempotence).toBe(false);
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

test('commutativity applied wrongly - should return false', () => {
  let formula = toolRules.buildTreeFromString('p⇒q');
  let afterRule = toolRules.applyRule(formula, 'idempotence');
  expect(afterRule).toBe(false);
});

// DOUBLE NEGATION TESTS
test('simple double negation(with brackets) - applied to give a', () => {
  let formula = toolRules.buildTreeFromString('¬(¬a)');
  let afterDoubleNegation = toolRules.applyRule(formula, 'double negation');
  let asString = toolRules.convertTreeToString(afterDoubleNegation);
  expect(asString).toBe('a');
});

test('simple double negation(without brackets) - applied to give a', () => {
  let formula = toolRules.buildTreeFromString('¬¬a');
  let afterDoubleNegation = toolRules.applyRule(formula, 'double negation');
  let asString = toolRules.convertTreeToString(afterDoubleNegation);
  expect(asString).toBe('a');
});

test('complex double negation - applied to give a∨b', () => {
  let formula = toolRules.buildTreeFromString('¬(¬(a∨b))');
  let afterDoubleNegation = toolRules.applyRule(formula, 'double negation');
  let asString = toolRules.convertTreeToString(afterDoubleNegation);
  expect(asString).toBe('a∨b');
});

test('complex double negation - applied to give a∧(a∨b)', () => {
  let formula = toolRules.buildTreeFromString('¬(¬(a∧(a∨b)))');
  let afterDoubleNegation = toolRules.applyRule(formula, 'double negation');
  let asString = toolRules.convertTreeToString(afterDoubleNegation);
  expect(asString).toBe('a∧(a∨b)');
});

test('reverse double negation - applied to give ¬¬(a∨b)', () => {
  let formula = toolRules.buildTreeFromString('a∨b');
  let afterDoubleNegation = toolRules.applyRule(formula, 'double negation');
  let asString = toolRules.convertTreeToString(afterDoubleNegation);
  expect(asString).toBe('¬¬(a∨b)');
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

test('wrongly applied negation - should give false', () => {
  let formula = toolRules.buildTreeFromString('a∨¬b');
  let afterNegation = toolRules.applyRule(formula, 'negation');
  expect(afterNegation).toBe(false);
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

test('wrongly applied implication - should give false', () => {
  let formula = toolRules.buildTreeFromString('a∧b');
  let afterImplication = toolRules.applyRule(formula, 'implication');
  expect(afterImplication).toBe(false);
});

// DE MORGAN TESTS
test('simple from and de Morgan - applied to give ¬a∨¬b', () => {
  let formula = toolRules.buildTreeFromString('¬(a∧b)');
  let afterDeMorgan = toolRules.applyRule(formula, 'de Morgan');
  let asString = toolRules.convertTreeToString(afterDeMorgan);
  expect(asString).toBe('¬a∨¬b');
});

test('simple from or de Morgan - applied to give ¬a∧¬b', () => {
  let formula = toolRules.buildTreeFromString('¬(a∨b)');
  let afterDeMorgan = toolRules.applyRule(formula, 'de Morgan');
  let asString = toolRules.convertTreeToString(afterDeMorgan);
  expect(asString).toBe('¬a∧¬b');
});

test('simple reverse from and de Morgan - applied to give ¬(a∧b)', () => {
  let formula = toolRules.buildTreeFromString('¬a∨¬b');
  let afterDeMorgan = toolRules.applyRule(formula, 'de Morgan');
  let asString = toolRules.convertTreeToString(afterDeMorgan);
  expect(asString).toBe('¬(a∧b)');
});

test('simple reverse from or de Morgan - applied to give ¬(a∨b)', () => {
  let formula = toolRules.buildTreeFromString('¬a∧¬b');
  let afterDeMorgan = toolRules.applyRule(formula, 'de Morgan');
  let asString = toolRules.convertTreeToString(afterDeMorgan);
  expect(asString).toBe('¬(a∨b)');
});

test('complex from and de Morgan - applied to give ¬(a∨b)∨¬(b∧c)', () => {
  let formula = toolRules.buildTreeFromString('¬((a∨b)∧(b∧c))');
  let afterDeMorgan = toolRules.applyRule(formula, 'de Morgan');
  let asString = toolRules.convertTreeToString(afterDeMorgan);
  expect(asString).toBe('¬(a∨b)∨¬(b∧c)');
});

test('complex reverse from or de Morgan - applied to give ¬((a∨b)∨(b∧c))', () => {
  let formula = toolRules.buildTreeFromString('¬(a∨b)∧¬(b∧c)');
  let afterDeMorgan = toolRules.applyRule(formula, 'de Morgan');
  let asString = toolRules.convertTreeToString(afterDeMorgan);
  expect(asString).toBe('¬((a∨b)∨b∧c)');
});

test('wrongly applied de Morgan - should give false', () => {
  let formula = toolRules.buildTreeFromString('a⇒b');
  let afterDeMorgan = toolRules.applyRule(formula, 'de Morgan');
  expect(afterDeMorgan).toBe(false);
});

// BI-IMPLICATION TESTS
test('simple bi-implication - applied to give (a⇒b)∧(b⇒a)', () => {
  let formula = toolRules.buildTreeFromString('a⇔b');
  let afterBiImplication = toolRules.applyRule(formula, 'bi-implication');
  let asString = toolRules.convertTreeToString(afterBiImplication);
  expect(asString).toBe('(a⇒b)∧(b⇒a)');
});

test('simple reverse bi-implication - applied to give a⇔b', () => {
  let formula = toolRules.buildTreeFromString('(a⇒b)∧(b⇒a)');
  let afterBiImplication = toolRules.applyRule(formula, 'bi-implication');
  let asString = toolRules.convertTreeToString(afterBiImplication);
  expect(asString).toBe('a⇔b');
});

test('complex bi-implication - applied to give (a∧c⇒b∧c)∧(b∧c⇒a∧c)', () => {
  let formula = toolRules.buildTreeFromString('(a∧c)⇔(b∧c)');
  let afterBiImplication = toolRules.applyRule(formula, 'bi-implication');
  let asString = toolRules.convertTreeToString(afterBiImplication);
  expect(asString).toBe('(a∧c⇒b∧c)∧(b∧c⇒a∧c)');
});

test('complex reverse bi-implication - applied to give (a∧c)⇔(b∧c)', () => {
  let formula = toolRules.buildTreeFromString('(a∧c⇒b∧c)∧(b∧c⇒a∧c)');
  let afterBiImplication = toolRules.applyRule(formula, 'bi-implication');
  let asString = toolRules.convertTreeToString(afterBiImplication);
  expect(asString).toBe('a∧c⇔b∧c');
});

test('wrongly applied bi-implication - should give false', () => {
  let formula = toolRules.buildTreeFromString('a∧b');
  let afterBiImplication = toolRules.applyRule(formula, 'bi-implication');
  expect(afterBiImplication).toBe(false);
});

// ABSORPTION TESTS
test('simple and absorption - applied to give a', () => {
  let formula = toolRules.buildTreeFromString('a∧(a∨b)');
  let afterAbsorption = toolRules.applyRule(formula, 'absorption');
  let asString = toolRules.convertTreeToString(afterAbsorption);
  expect(asString).toBe('a');
});

test('simple or absorption - applied to give a', () => {
  let formula = toolRules.buildTreeFromString('a∨(a∧b)');
  let afterAbsorption = toolRules.applyRule(formula, 'absorption');
  let asString = toolRules.convertTreeToString(afterAbsorption);
  expect(asString).toBe('a');
});

test('and absorption with brackets - applied to give a∧c', () => {
  let formula = toolRules.buildTreeFromString('(a∧c)∧((a∧c)∨b)');
  let afterAbsorption = toolRules.applyRule(formula, 'absorption');
  let asString = toolRules.convertTreeToString(afterAbsorption);
  expect(asString).toBe('a∧c');
});

test('or absorption with brackets - applied to give a∧c', () => {
  let formula = toolRules.buildTreeFromString('(a∧c)∨((a∧c)∧(b∨c))');
  let afterAbsorption = toolRules.applyRule(formula, 'absorption');
  let asString = toolRules.convertTreeToString(afterAbsorption);
  expect(asString).toBe('a∧c');
});

test('wrongly applied absorption - should give false', () => {
  let formula = toolRules.buildTreeFromString('a∧(b∨c)');
  let afterAbsorption = toolRules.applyRule(formula, 'absorption');
  expect(afterAbsorption).toBe(false);
});

// ASSOCIATIVITY TESTS
test('simple and associativity - applied to give (a∧b)∧c', () => {
  let formula = toolRules.buildTreeFromString('a∧(b∧c)');
  let afterAssociativity = toolRules.applyRule(formula, 'associativity');
  let asString = toolRules.convertTreeToString(afterAssociativity);
  expect(asString).toBe('(a∧b)∧c');
});

test('simple or associativity - applied to give (a∨b)∨c', () => {
  let formula = toolRules.buildTreeFromString('a∨(b∨c)');
  let afterAssociativity = toolRules.applyRule(formula, 'associativity');
  let asString = toolRules.convertTreeToString(afterAssociativity);
  expect(asString).toBe('(a∨b)∨c');
});

test('simple reverse and associativity - applied to give a∧(b∧c)', () => {
  let formula = toolRules.buildTreeFromString('(a∧b)∧c');
  let afterAssociativity = toolRules.applyRule(formula, 'associativity');
  let asString = toolRules.convertTreeToString(afterAssociativity);
  expect(asString).toBe('a∧(b∧c)');
});

test('simple reverse or associativity - applied to give a∨(b∨c)', () => {
  let formula = toolRules.buildTreeFromString('(a∨b)∨c');
  let afterAssociativity = toolRules.applyRule(formula, 'associativity');
  let asString = toolRules.convertTreeToString(afterAssociativity);
  expect(asString).toBe('a∨(b∨c)');
});

test('complex and associativity - applied to give ((a∨c)∧(b∨c))∧c', () => {
  let formula = toolRules.buildTreeFromString('(a∨c)∧((b∨c)∧c)');
  let afterAssociativity = toolRules.applyRule(formula, 'associativity');
  let asString = toolRules.convertTreeToString(afterAssociativity);
  expect(asString).toBe('((a∨c)∧(b∨c))∧c');
});

test('complex reverse or associativity - applied to give (a∧c)∨((b∧c)∨c)', () => {
  let formula = toolRules.buildTreeFromString('((a∧c)∨(b∧c))∨c');
  let afterAssociativity = toolRules.applyRule(formula, 'associativity');
  let asString = toolRules.convertTreeToString(afterAssociativity);
  expect(asString).toBe('a∧c∨(b∧c∨c)');
});

test('wrongly applied associativity - should give false', () => {
  let formula = toolRules.buildTreeFromString('a∧(b∨c)');
  let afterAssociativity = toolRules.applyRule(formula, 'associativity');
  expect(afterAssociativity).toBe(false);
});

// DISTRIBUTIVITY TESTS
test('simple and distributivity - applied to give a∧b∨a∧c', () => {
  let formula = toolRules.buildTreeFromString('a∧(b∨c)');
  let afterDistributivity = toolRules.applyRule(formula, 'distributivity');
  let asString = toolRules.convertTreeToString(afterDistributivity);
  expect(asString).toBe('a∧b∨a∧c');
});

test('simple or distributivity - applied to give (a∨b)∧(a∨c)', () => {
  let formula = toolRules.buildTreeFromString('a∨(b∧c)');
  let afterDistributivity = toolRules.applyRule(formula, 'distributivity');
  let asString = toolRules.convertTreeToString(afterDistributivity);
  expect(asString).toBe('(a∨b)∧(a∨c)');
});

test('simple reverse and distributivity - applied to give a∧(b∨c)', () => {
  let formula = toolRules.buildTreeFromString('a∧b∨a∧c');
  let afterDistributivity = toolRules.applyRule(formula, 'distributivity');
  let asString = toolRules.convertTreeToString(afterDistributivity);
  expect(asString).toBe('a∧(b∨c)');
});

test('simple reverse or distributivity - applied to give a∨b∧c', () => {
  let formula = toolRules.buildTreeFromString('(a∨b)∧(a∨c)');
  let afterDistributivity = toolRules.applyRule(formula, 'distributivity');
  let asString = toolRules.convertTreeToString(afterDistributivity);
  expect(asString).toBe('a∨b∧c');
});

test('wrongly applied distributivity - should give false', () => {
  let formula = toolRules.buildTreeFromString('a∧(b∧c)');
  let afterDistributivity = toolRules.applyRule(formula, 'distributivity');
  expect(afterDistributivity).toBe(false);
});

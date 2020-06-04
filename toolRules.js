/* RULES */
function idempotenceRule(original) {
  let node = buildTreeFromString(original);
  if (node.value === '∧' || node.value === '∨') {
    if (node.children[0].value === node.children[1].value) {
      node = node.children[0];
      return node;
    }
  }
}

function commutativityRule(original) {
  try {
    let node = buildTreeFromString(original);
    if (node.value === '∧' || node.value === '∨') {
      let newSecondChild = Object.assign({}, node.children[0]);
      node.children[0] = node.children[1];
      node.children[1] = newSecondChild;
      return node;
    }
  } catch {
    alert('The commutativity rule cannot be applied to the section you selected.');
  }
}

function doubleNegationRule(original) {
  let node = buildTreeFromString(original);
  if (node.value === '¬' && node.children[0].value === '¬') {
    node = node.children[0].children[0];
    return node;
  } else {
    let originalNode = Object.assign({}, node);
    node.value = '¬';
    node.children = [{value: '¬',children: [originalNode]}];
    return node;
  }
}

function negationRule(original) {
  let node = buildTreeFromString(original);
  if (node.value === '∧' && node.children[1].value === '¬') {
    if (node.children[0].value === node.children[1].children[0].value) {
      node.value = false;
      node.children = [];
    }
    return node;
  } else if (node.value === '∨' && node.children[1].value === '¬')  {
    if (node.children[0].value === node.children[1].children[0].value) {
      node.value = true;
      node.children = [];
    }
    return node;
  }
}

function implicationRule(original) {
  let node = buildTreeFromString(original);
  if (node.value === '⇒') {
    let originalFirstChild = Object.assign({}, node.children[0]);
    node.value = '∨';
    node.children[0].value = '¬';
    node.children[0].children = [originalFirstChild];
    return node;
  } else if (node.value === '∨' && node.children[0].value === '¬') {
    node.children[0] = node.children[0].children[0]; // removes ¬ node
    node.value = '⇒';
    return node;
  }
}

function deMorganRule(original) {
  let node = buildTreeFromString(original);
  if (node.value === '¬') {
    let firstChild = Object.assign({}, node.children[0].children[0]);
    let secondChild = Object.assign({}, node.children[0].children[1]);
    if (node.children[0].value === '∧') {
      node.value = '∨';
    } else if (node.children[0].value === '∨') {
      node.value = '∧';
    }
      node.children = [{value: '¬',children: [firstChild]}, {value: '¬',children: [secondChild]}];
      return node;
  }
}

function biImplicationRule(original) {
  let node = buildTreeFromString(original);
  if (node.value === '⇔') {
    let firstChild = Object.assign({}, node.children[0]);
    let secondChild = Object.assign({}, node.children[1]);
    node.value = '∧';
    node.children = [{value: '⇒',children: [firstChild, secondChild]}, {value: '⇒',children: [secondChild, firstChild]}];
    return node;
  }
}

function absorptionRule(original) {
  let node = buildTreeFromString(original);
  if (node.value === '∧' && node.children[1].value === '∨' && node.children[0].value === node.children[1].children[0].value) {
    node = node.children[0];
    return node;
  } else if (node.value === '∨' && node.children[1].value === '∧' && node.children[0].value === node.children[1].children[0].value) {
    node = node.children[0];
    return node;
  }
}

function associativityRule(original) {
  let node = buildTreeFromString(original);
  if (node.value === '∧' && node.children[1].value === '∧') {
    let switchedChild = Object.assign({}, node.children[1].children[0]);
    let addedToChild = Object.assign({}, node.children[0]);
    node.children[0] = {value: '∧', children: [addedToChild, switchedChild] };
    node.children[1] = node.children[1].children[1];
    return node;
  } else if (node.value === '∨' && node.children[1].value === '∨') {
    let switchedChild = Object.assign({}, node.children[1].children[0]);
    let addedToChild = Object.assign({}, node.children[0]);
    node.children[0] = {value: '∨', children: [addedToChild, switchedChild] };
    node.children[1] = node.children[1].children[1];
    return node;
  }
}

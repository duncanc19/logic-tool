/* RULES */
function idempotenceRule(original) {
  let node = buildTreeFromString(original);
  if (node.value === '∧' || node.value === '∨') {
    if (nodesEqual(node.children[0], node.children[1])) {
      node = node.children[0];
      return node;
    }
  }
}

function nodesEqual(firstNode, secondNode) {
  return (JSON.stringify(firstNode) === JSON.stringify(secondNode));
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
  } else if (node.value === '∨' && node.children[0].value === '¬' && node.children[1].value === '¬') {
    let firstChild = Object.assign({}, node.children[0].children[0]);
    let secondChild = Object.assign({}, node.children[1].children[0]);
    let newNode = {value: '∧',children: [firstChild, secondChild]};
    node.value = '¬';
    node.children = [newNode];
    return node;
  } else if (node.value === '∧' && node.children[0].value === '¬' && node.children[1].value === '¬') {
    let firstChild = Object.assign({}, node.children[0].children[0]);
    let secondChild = Object.assign({}, node.children[1].children[0]);
    let newNode = {value: '∨',children: [firstChild, secondChild]};
    node.value = '¬';
    node.children = [newNode];
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
  } else if (node.value === '∧' && node.children[0].value === '⇒' && node.children[1].value === '⇒') {
    if (nodesEqual(node.children[0].children[0], node.children[1].children[1]) &&
        nodesEqual(node.children[0].children[1], node.children[1].children[0])) {
      node.value = '⇔';
      node.children = [node.children[0].children[0], node.children[0].children[1]];
      return node;
    }
  }
}

function absorptionRule(original) {
  let node = buildTreeFromString(original);
  if (node.value === '∧' && node.children[1].value === '∨' && nodesEqual(node.children[0], node.children[1].children[0])) {
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
    node = associativityForwardRule(node, '∧');
    return node;
  } else if (node.value === '∨' && node.children[1].value === '∨') {
    node = associativityForwardRule(node, '∨');
    return node;
  } else if (node.value === '∧' && node.children[0].value === '∧') {
    node = associaticityReverseRule(node, '∧');
    return node;
  } else if (node.value === '∨' && node.children[0].value === '∨') {
    node = associaticityReverseRule(node, '∨');
    return node;
  }
}

function associativityForwardRule(node, symbol) {
  let switchedChild = Object.assign({}, node.children[1].children[0]);
  let addedToChild = Object.assign({}, node.children[0]);
  node.children[0] = {value: symbol, children: [addedToChild, switchedChild] };
  node.children[1] = node.children[1].children[1];
  return node;
}

function associaticityReverseRule(node, symbol) {
  let switchedChild = Object.assign({}, node.children[0].children[1]);
  let addedToChild = Object.assign({}, node.children[1]);
  node.children[1] = {value: symbol, children: [switchedChild, addedToChild] };
  node.children[0] = node.children[0].children[0];
  return node;
}

function distributivityRule(original) {
  let node = buildTreeFromString(original);
  if (node.value === '∧' && node.children[1].value === '∨') {
    node = distributivityForwardRule(node, '∧', '∨');
    return node;
  } else if (node.value === '∨' && node.children[1].value === '∧') {
    node = distributivityForwardRule(node, '∨', '∧');
    return node;
  } else if (node.value === '∨' && node.children[0].value === '∧' && node.children[1].value === '∧') {
    node = distributivityReverseRule(node, '∨', '∧');
    return node;
  } else if (node.value === '∧' && node.children[0].value === '∨' && node.children[1].value === '∨') {
    node = distributivityReverseRule(node, '∧', '∨');
    return node;
  }
}

function distributivityForwardRule(node, symbol1, symbol2) {
  let firstPart = Object.assign({}, node.children[0]);
  let addedToFirstChild = Object.assign({}, node.children[1].children[0]);
  let secondChildSecondPart = Object.assign({}, node.children[1].children[1]);
  node.value = symbol2;
  node.children[0] = { value: symbol1, children: [firstPart, addedToFirstChild] };
  node.children[1] = { value: symbol1, children: [firstPart, secondChildSecondPart] };
  return node;
}

function distributivityReverseRule(node, symbol1, symbol2) {
  if (node.children[0].children[0].value === node.children[1].children[0].value) {
    newChildNode = { value: symbol1, children: [node.children[0].children[1], node.children[1].children[1]] };
    node.value = symbol2;
    node.children = [node.children[0].children[0], newChildNode];
    return node;
  }
}

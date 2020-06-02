/* RULES */
function idempotenceRule(original) {
  let originalSection = buildTreeFromString(original);
  if (originalSection.value === '∧' || originalSection.value === '∨') {
    return true;
  }
  return false;
}
  buildTreeFromString(changed);
  if
  );
} else if (findSymbol(node.value, ''
}

function idempotenceCheckChildren(rootNode) {
  if (rootNode.children[0].value === rootNode.children[1].value) {
    rootNode.children[0].forEach()
    rootNode.children[0].children.forEach(child => )
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

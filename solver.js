const fs = require("fs");

// To use:
// Create an input.txt file in the same directory
// with inequalities separated by new lines:
// ["a", "<", "b"]
// ["b", "<", "c"]
// ["c", "<", "a"]
// run `node solver.js` which will create
// a file in the same directory called inequality-solver.txt
// Lastly, with Z3 installed `brew install z3`,
// run `z3 inequality-solver.txt`.
// If the first line of the output says `sat`, then
// there is a solution. `unsat` indicates a conflict in
// the inequalities provided.

// Another example (no conflict)
// ["a", "<", "b"]
// ["b", "<", "c"]
// ["c", "<", "d"]

const toAssert = (left, compare, right) => {
  return `(assert (${compare} ${left} ${right}))`;
}

const toDeclare = (x) => {
  return `(declare-const ${x} Int)`
}

let variables = new Set();

let data = fs.readFileSync('input.txt', 'utf-8')
  .split('\n')
  .map((str) => str.slice(1, str.length - 1)
    .replaceAll('"', '')
    .split(', '))
  .map(([left, compare, right]) => {
    variables.add(left);
    variables.add(right);
    return toAssert(left, compare, right);
  });

let text = `
(check-sat)
(get-model)
`;

data.forEach((eq) => {
  text = eq + '\n' + text;
})

variables.forEach((x) => {
  text = toDeclare(x) + '\n' + text
})

fs.writeFile(
  'inequality-solver.txt',
  text,
  err => console.log(err)
)
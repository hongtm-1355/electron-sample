const path = require("path")
require("@babel/register")(
  {plugins: [
    path.join(__dirname, './node_modules/babel-plugin-transform-react-jsx/lib/index.js'),
    path.join(__dirname, './node_modules/@babel/plugin-proposal-class-properties/lib/index.js')
  ]}
);

const React = require("react");
const ReactDOM = require("react-dom")

const Manager = require("./manager.jsx")
console.log()
ReactDOM.render(React.createElement(Manager), document.getElementById('root'));

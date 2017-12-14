"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var apollo_link_1 = require("apollo-link");
var deepUpdate = require("deep-update");
function extractKey(operation) {
    var serializationKey = operation.getContext().serializationKey;
    if (serializationKey) {
        return { operation: operation, key: serializationKey };
    }
    var _a = extractDirective(operation), directive = _a.directive, path = _a.path;
    if (!directive) {
        return { operation: operation };
    }
    var argument = directive.arguments.find(function (d) { return d.name.value === 'key'; });
    if (!argument) {
        throw new Error("The @serialize directive requires a 'key' argument");
    }
    var key = valueForArgument(argument, operation.variables);
    key = key.replace(/\{\{([^\}]+)\}\}/g, function (_substring, name) {
        return getVariableOrDie(operation.variables, name);
    });
    var finalIndex = path.pop();
    var newOperation = apollo_link_1.createOperation(operation.getContext(), __assign({}, operation, { query: deepUpdate(operation.query, path, { $splice: [[finalIndex, 1]] }) }));
    return { operation: newOperation, key: key };
}
exports.extractKey = extractKey;
function extractDirective(_a) {
    var query = _a.query, operationName = _a.operationName;
    var path = [];
    var operationNode;
    for (var i = 0; i < query.definitions.length; i++) {
        var node = query.definitions[i];
        if (node.kind !== 'OperationDefinition') {
            continue;
        }
        if (!operationName || node.name.value == operationName) {
            operationNode = node;
            path.push('definitions', "" + i);
            break;
        }
    }
    for (var i = 0; i < operationNode.directives.length; i++) {
        var node = operationNode.directives[i];
        if (node.name.value === 'serialize') {
            path.push('directives', "" + i);
            return { directive: node, path: path };
        }
    }
    return {};
}
function valueForArgument(_a, variables) {
    var value = _a.value;
    if (value.kind === 'Variable') {
        return getVariableOrDie(variables, value.name.value);
    }
    if (value.kind !== 'StringValue') {
        throw new Error("values for @serialize(key:) must be strings or variables");
    }
    return value.value;
}
exports.valueForArgument = valueForArgument;
function getVariableOrDie(variables, name) {
    if (!variables || !(name in variables)) {
        throw new Error("Expected $" + name + " to exist for @serialize");
    }
    return variables[name];
}
exports.getVariableOrDie = getVariableOrDie;
//# sourceMappingURL=extractKey.js.map
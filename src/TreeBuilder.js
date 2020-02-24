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
var TreeNode_1 = require("./TreeNode");
var TreeBuilder = /** @class */ (function () {
    function TreeBuilder() {
    }
    TreeBuilder.buildSymbolsTree = function (text) {
        if (!text.length) {
            throw new Error("Cannot create tree. Text is empty");
        }
        var splittedText = text.split("");
        var symbolsWeightObject = splittedText.reduce(function (acc, symbol) {
            acc[symbol] = acc[symbol] ? acc[symbol] + 1 : 1;
            return acc;
        }, {});
        // @ts-ignore
        var symbolsSortedByWeight = Object.entries(symbolsWeightObject).map(function (_a) {
            var value = _a[0], weight = _a[1];
            return ({ value: value, weight: weight });
        });
        var build = function (queue) {
            var sortedByWeight = queue.sort(function (_a, _b) {
                var w1 = _a.weight;
                var w2 = _b.weight;
                return w1 - w2;
            });
            var first = sortedByWeight[0], next = sortedByWeight[1], restItems = sortedByWeight.slice(2);
            if (!next) {
                return first;
            }
            var node = new TreeNode_1.TreeNode();
            node.insert(first).insert(next);
            return build([node].concat(restItems));
        };
        return build(symbolsSortedByWeight);
    };
    TreeBuilder.stringifyTree = function (tree) {
        var serializedTree = tree.serialize();
        // @ts-ignore
        return Object.entries(serializedTree)
            .reduce(function (acc, _a) {
            var key = _a[0], value = _a[1];
            return acc.concat(["" + key + value]);
        }, [])
            .join(TreeBuilder.dataDivider);
    };
    TreeBuilder.createTreeFromString = function (treeDataString) {
        if (!treeDataString.length) {
            throw new Error("Cannot create tree. String is empty");
        }
        var entries = treeDataString.split(TreeBuilder.dataDivider);
        var serializedTree = entries.reduce(function (acc, peace) {
            var _a = peace.split(""), symbol = _a[0], code = _a.slice(1);
            return __assign({}, acc, (_b = {}, _b[symbol] = code.join(""), _b));
            var _b;
        }, {});
        return TreeNode_1.TreeNode.hydrate(serializedTree);
    };
    TreeBuilder.dataDivider = "%@";
    return TreeBuilder;
}());
exports.TreeBuilder = TreeBuilder;

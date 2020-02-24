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
var Sides;
(function (Sides) {
    Sides["left"] = "0";
    Sides["right"] = "1";
})(Sides = exports.Sides || (exports.Sides = {}));
var TreeNode = /** @class */ (function () {
    function TreeNode(value, weight) {
        if (value === void 0) { value = ""; }
        if (weight === void 0) { weight = 0; }
        this._value = value;
        this._weight = weight;
    }
    Object.defineProperty(TreeNode.prototype, "weight", {
        get: function () {
            if (this._weight) {
                return this._weight;
            }
            return (+(this._left && this._left.weight) + +(this._right && this._right.weight));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "left", {
        get: function () {
            return this._left;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "right", {
        get: function () {
            return this._right;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "isLeaf", {
        get: function () {
            return !this._left && !this._right;
        },
        enumerable: true,
        configurable: true
    });
    TreeNode.prototype.insert = function (node) {
        this._weight = 0;
        var unusedSide = this._left ? "_right" : "_left";
        this[unusedSide] = this._getInstance(node);
        return this;
    };
    TreeNode.prototype._getInstance = function (node) {
        return node instanceof TreeNode
            ? node
            : new TreeNode(node.value, node.weight);
    };
    TreeNode.getSideName = function (side) {
        return side === Sides.left ? "left" : "right";
    };
    TreeNode.prototype.serialize = function (path) {
        if (path === void 0) { path = ""; }
        // Serialize tree into the one level object
        if (this.isLeaf) {
            return _a = {}, _a[this.value] = path, _a;
        }
        return __assign({}, (this._left && this._left.serialize(path + Sides.left)), (this._right && this._right.serialize(path + Sides.right)));
        var _a;
    };
    // Create treee instance from Serialization result object
    TreeNode.hydrate = function (structure) {
        var tree = new TreeNode();
        // @ts-ignore
        var sorted = Object.entries(structure).sort(function (_a, _b) {
            var code1 = _a[1];
            var code2 = _b[1];
            return code1.length - code2.length;
        });
        sorted.forEach(function (_a) {
            var symbol = _a[0], path = _a[1];
            var pathArray = path.split("");
            var currentNode = tree;
            pathArray.forEach(function (side, index) {
                var sideName = "_" + TreeNode.getSideName(side);
                var isLast = pathArray.length - 1 === index;
                if (!currentNode[sideName] && isLast) {
                    currentNode[sideName] = new TreeNode(symbol);
                }
                if (!currentNode[sideName]) {
                    currentNode[sideName] = new TreeNode();
                }
                currentNode = currentNode[sideName];
            });
        });
        return tree;
    };
    return TreeNode;
}());
exports.TreeNode = TreeNode;

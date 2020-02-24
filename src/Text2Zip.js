"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var TreeBuilder_1 = require("./TreeBuilder");
var TreeNode_1 = require("./TreeNode");
var Text2Zip = /** @class */ (function () {
    function Text2Zip(text) {
        this._text = text;
    }
    Object.defineProperty(Text2Zip.prototype, "tree", {
        get: function () {
            return this._tree;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text2Zip.prototype, "text", {
        get: function () {
            return this._text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text2Zip.prototype, "encodedString", {
        get: function () {
            return this._encodedString;
        },
        enumerable: true,
        configurable: true
    });
    Text2Zip.prototype.buildTree = function () {
        this._tree = TreeBuilder_1.TreeBuilder.buildSymbolsTree(this._text);
        return this;
    };
    Text2Zip.prototype.buildEncodedString = function () {
        var serializedTree = this._tree.serialize();
        this._encodedString = this._text
            .split("")
            .map(function (symbol) { return serializedTree[symbol]; })
            .join("");
        return this;
    };
    Text2Zip.prototype.getBlob = function () {
        var result = this._encodedString.match(/.{1,8}/g) || [];
        var encoder = new TextEncoder();
        // @ts-ignore
        var buffer = new Uint8Array(Array.from(encoder.encode(TreeBuilder_1.TreeBuilder.stringifyTree(this._tree))).concat([
            Text2Zip.binaryDataDivider
        ], result.map(function (bytes) { return parseInt(bytes, 2); })));
        return new Blob([buffer]);
    };
    Text2Zip.decodeBlob = function (blob) {
        return __awaiter(this, void 0, void 0, function () {
            var arrayByffer, dataArr, index, treeData, textData, decoder, decodedTree, treeInstance, encodedString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Get bytes array from blob
                        if (!blob) {
                            throw new Error("Blob was not presented");
                        }
                        return [4 /*yield*/, blob.arrayBuffer()];
                    case 1:
                        arrayByffer = _a.sent();
                        dataArr = Array.from(new Uint8Array(arrayByffer));
                        index = dataArr.indexOf(Text2Zip.binaryDataDivider);
                        treeData = dataArr.slice(0, index);
                        textData = dataArr.slice(index - 1, dataArr.length);
                        decoder = new TextDecoder();
                        decodedTree = decoder.decode(new Uint8Array(treeData));
                        treeInstance = TreeBuilder_1.TreeBuilder.createTreeFromString(decodedTree);
                        encodedString = textData.map(function (int, encodedIndex) {
                            var result = int.toString(2);
                            if (encodedIndex === textData.length - 1) {
                                return result;
                            }
                            return "" + "0".repeat(8 - result.length) + result;
                        });
                        return [2 /*return*/, Text2Zip._encodedStringToText(encodedString.join(""), treeInstance)];
                }
            });
        });
    };
    Text2Zip.binaryDataDivider = 255;
    Text2Zip._encodedStringToText = function (encodedString, tree) {
        var currentNode = tree;
        var arrayToProcess = encodedString.split("");
        var result = "";
        while (arrayToProcess.length) {
            var side = arrayToProcess.shift() || "";
            var node = currentNode[TreeNode_1.TreeNode.getSideName(side)];
            if (node && node.isLeaf) {
                result += node.value;
                currentNode = tree;
                continue;
            }
            currentNode = node;
        }
        return result;
    };
    return Text2Zip;
}());
exports.Text2Zip = Text2Zip;

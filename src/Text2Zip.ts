import { TreeBuilder } from "./TreeBuilder";
import { TreeNode } from "./TreeNode";

// @ts-ignore
declare var TextEncoder: any;
// @ts-ignore
declare var TextDecoder: any;

export class Text2Zip {
  static readonly binaryDataDivider = 255;
  private readonly _text: string;
  private _tree: TreeNode;
  private _buffer: Buffer;
  private _encodedString: string;

  constructor(text: string) {
    this._text = text;
  }

  get tree(): TreeNode {
    return this._tree;
  }
  get text(): string {
    return this._text;
  }

  get buffer() {
    return this._buffer;
  }

  get encodedString() {
    return this._encodedString;
  }

  get blob(): Blob {
    return new Blob([this._buffer]);
  }

  public buildTree(): Text2Zip {
    this._tree = TreeBuilder.buildSymbolsTree(this._text);

    return this;
  }

  public buildEncodedString(): Text2Zip {
    const serializedTree = this._tree.serialize();

    this._encodedString = this._text
      .split("")
      .map(symbol => serializedTree[symbol])
      .join("");

    return this;
  }

  public encode(): Text2Zip {
    this.buildTree();
    this.buildEncodedString();

    const result = this._encodedString.match(/.{1,8}/g) || [];

    const encoder = new TextEncoder();

    // @ts-ignore
    this._buffer = new Uint8Array([
      ...Array.from(
        encoder.encode(TreeBuilder.stringifyTree(this._tree))
      ),
      Text2Zip.binaryDataDivider,
      ...result.map(bytes => parseInt(bytes, 2))
    ]);

    return this;
  }

  static decodeBuffer(arrayBuffer: ArrayBuffer): string {
    // Get bytes array from blob
    if (!arrayBuffer) {
      throw new Error("Blob was not presented");
    }

    // @ts-ignore
    const dataArr = Array.from(new Uint8Array(arrayBuffer));

    // Get index of data divider of tree data and encoded data
    const index = dataArr.indexOf(Text2Zip.binaryDataDivider);

    const treeData = dataArr.slice(0, index);

    const textData = dataArr.slice(index + 1, dataArr.length);

    const decoder = new TextDecoder();

    // Get tree represented as string
    const decodedTree = decoder.decode(new Uint8Array(treeData));

    const treeInstance = TreeBuilder.createTreeFromString(decodedTree);

    const encodedString = textData.map((int, encodedIndex) => {
      const result = int.toString(2);

      if (encodedIndex === textData.length - 1) {
        return result;
      }

      return `${"0".repeat(8 - result.length)}${result}`;
    });

    return Text2Zip._encodedStringToText(encodedString.join(""), treeInstance);
  }

  static async decodeBlob(blob: Blob): Promise<string> {
    // Get bytes array from blob
    if (!blob) {
      throw new Error("Blob was not presented");
    }

    // @ts-ignore
    const arrayBuffer = await blob.arrayBuffer();

    return Text2Zip.decodeBuffer(arrayBuffer);
  }

  private static _encodedStringToText(
    encodedString: string,
    tree: TreeNode
  ): string {
    let currentNode = tree;
    let arrayToProcess = encodedString.split("");
    let result = "";

    while (arrayToProcess.length) {
      const side = arrayToProcess.shift() || "";

      const node = currentNode[TreeNode.getSideName(side)];

      if (node && node.isLeaf) {
        result += node.value;

        currentNode = tree;
        continue;
      }

      currentNode = node;
    }

    return result;
  }
}

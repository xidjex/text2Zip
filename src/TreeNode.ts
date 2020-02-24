export interface INode {
  value: string;
  weight: number;
}

export interface SerializationResult {
  [key: string]: string;
}

export enum Sides {
  left = "1",
  right = "0"
}

export class TreeNode implements INode {
  private _left: TreeNode;
  private _right: TreeNode;

  private _value: string;
  private _weight: number;

  constructor(value: string = "", weight: number = 0) {
    this._value = value;
    this._weight = weight;
  }

  get weight(): number {
    if (this._weight) {
      return this._weight;
    }

    return (
      +(this._left && this._left.weight) + +(this._right && this._right.weight)
    );
  }

  get left(): TreeNode {
    return this._left;
  }

  get right(): TreeNode {
    return this._right;
  }

  get value(): string {
    return this._value;
  }

  get isLeaf(): boolean {
    return !this._left && !this._right;
  }

  insert(node: INode): TreeNode {
    this._weight = 0;

    let unusedSide = this._left ? "_right" : "_left";

    this[unusedSide] = this._getInstance(node);

    return this;
  }

  private _getInstance(node: INode): TreeNode {
    return node instanceof TreeNode
      ? node
      : new TreeNode(node.value, node.weight);
  }

  static getSideName(side: string): string {
    return side === Sides.left ? "left" : "right";
  }

  serialize(path: string = ""): SerializationResult {
    // Serialize tree into the one level object
    if (this.isLeaf) {
      return { [this.value]: path };
    }

    return {
      ...(this._left && this._left.serialize(path + Sides.left)),
      ...(this._right && this._right.serialize(path + Sides.right))
    };
  }

  // Create treee instance from Serialization result object
  static hydrate(structure: SerializationResult): TreeNode {
    let tree = new TreeNode();

    // @ts-ignore
    const sorted = Object.entries(structure).sort(
      ([, code1]: [any, string], [, code2]: [any, string]) => code1.length - code2.length
    );

    sorted.forEach(([symbol, path]: [string, string]) => {
      const pathArray = path.split("");
      let currentNode = tree;

      pathArray.forEach((side, index) => {
        const sideName = `_${TreeNode.getSideName(side)}`;
        const isLast = pathArray.length - 1 === index;

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
  }
}

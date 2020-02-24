import { TreeNode, INode, SerializationResult } from "./TreeNode";

export interface SymbolsWeightObject {
  [key: string]: number;
}

export class TreeBuilder {
  static dataDivider = "%@";

  static buildSymbolsTree(text: string): TreeNode {
    if (!text.length) {
      throw new Error("Cannot create tree. Text is empty");
    }

    const splittedText = text.split("");

    const symbolsWeightObject: SymbolsWeightObject = splittedText.reduce(
      (acc, symbol) => {
        acc[symbol] = acc[symbol] ? acc[symbol] + 1 : 1;

        return acc;
      },
      {}
    );

    // @ts-ignore
    const symbolsSortedByWeight = Object.entries(symbolsWeightObject).map(
      ([value, weight]: [string, number]): INode => ({ value, weight })
    ) as INode[];

    const build = (queue: INode[]): TreeNode => {
      const sortedByWeight = queue.sort(
        ({ weight: w1 }: INode, { weight: w2 }: INode): number => w1 - w2
      );

      const [first, next, ...restItems] = sortedByWeight;

      if (!next) {
        return first as TreeNode;
      }

      const node = new TreeNode();

      node.insert(first).insert(next);

      return build([node, ...restItems]);
    };

    return build(symbolsSortedByWeight);
  }

  static stringifyTree(tree: TreeNode): string {
    const serializedTree = tree.serialize();

    // @ts-ignore
    return Object.entries(serializedTree)
      .reduce((acc: string[], [key, value]: [string, string]) => {
        return [...acc, `${key}${value}`];
      }, [])
      .join(TreeBuilder.dataDivider);
  }

  static createTreeFromString(treeDataString: string): TreeNode {
    if (!treeDataString.length) {
      throw new Error("Cannot create tree. String is empty");
    }

    const entries = treeDataString.split(TreeBuilder.dataDivider);

    const serializedTree = entries.reduce((acc, peace) => {
      const [symbol, ...code] = peace.split("");

      return {
        ...acc,
        [symbol]: code.join("")
      };
    }, {}) as SerializationResult;

    return TreeNode.hydrate(serializedTree);
  }
}

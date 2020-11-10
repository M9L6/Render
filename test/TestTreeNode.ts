import { IEnumerator } from "../game/dataStruct/IEnumerator";
import { NodeEnumeratorFactory } from "../game/dataStruct/NodeEnumeratorFactory";
import { TreeNode } from "../game/dataStruct/TreeNode";

class NumberNode extends TreeNode<number> {}

export class TestTreeNode {
    public static createTree(): NumberNode {
        let root: NumberNode = new NumberNode(0, undefined, "root");
        let node1: NumberNode = new NumberNode(1, root, "node1");
        let node2: NumberNode = new NumberNode(2, root, "node2");
        let node3: NumberNode = new NumberNode(3, root, "node3");
        let node4: NumberNode = new NumberNode(4, node1, "node4");
        let node5: NumberNode = new NumberNode(5, node1, "node5");
        let node6: NumberNode = new NumberNode(6, node2, "node6");
        let node7: NumberNode = new NumberNode(7, node2, "node7");
        let node8: NumberNode = new NumberNode(8, node3, "node8");
        let node9: NumberNode = new NumberNode(9, node4, "node9");
        let node10: NumberNode = new NumberNode(10, node6, "node10");
        let node11: NumberNode = new NumberNode(11, node7, "node11");
        let node12: NumberNode = new NumberNode(12, node11, "node12");
        return root;
    }
}

let root = TestTreeNode.createTree();
let iter: IEnumerator<TreeNode<number>>;
let current: TreeNode<number> | undefined = undefined;
console.log("depth-first   left-right  top-bottom");
iter = NodeEnumeratorFactory.create_df_l2r_t2b_iter<number>(
    root as TreeNode<number>
);
while (iter.moveNext()) {
    current = iter.current;
    if (current !== undefined) {
        console.log(
            current.repeatString(" ", current.depth * 4) + current.name
        );
    }
}

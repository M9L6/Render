import { IndexerL2R, IndexerR2L } from "./IAdapter";
import { IEnumerator } from "./IEnumerator";
import { NodeB2TEnumerator } from "./NodeB2TEnumerator";
import { NodeT2BEnumerator } from "./NodeT2BEnumerator";
import { Queue } from "./Queue";
import { Stack } from "./Stack";
import { TreeNode } from "./TreeNode";

export class NodeEnumeratorFactory {
    public static create_df_l2r_t2b_iter<T>(
        node: TreeNode<T> | undefined
    ): IEnumerator<TreeNode<T>> {
        return new NodeT2BEnumerator(node, IndexerL2R, Stack);
    }

    public static create_df_r2l_t2b_iter<T>(
        node: TreeNode<T> | undefined
    ): IEnumerator<TreeNode<T>> {
        return new NodeT2BEnumerator(node, IndexerR2L, Stack);
    }

    public static create_bf_l2r_t2b_iter<T>(
        node: TreeNode<T> | undefined
    ): IEnumerator<TreeNode<T>> {
        return new NodeT2BEnumerator(node, IndexerL2R, Queue);
    }

    public static create_bf_r2l_t2b_iter<T>(
        node: TreeNode<T> | undefined
    ): IEnumerator<TreeNode<T>> {
        return new NodeT2BEnumerator(node, IndexerR2L, Queue);
    }

    public static create_df_l2r_b2t_iter<T>(
        node: TreeNode<T> | undefined
    ): IEnumerator<TreeNode<T>> {
        return new NodeB2TEnumerator(
            NodeEnumeratorFactory.create_df_r2l_t2b_iter(node)
        );
    }

    public static create_df_r2l_b2t_iter<T>(
        node: TreeNode<T> | undefined
    ): IEnumerator<TreeNode<T>> {
        return new NodeB2TEnumerator(
            NodeEnumeratorFactory.create_df_l2r_t2b_iter(node)
        );
    }

    public static create_bf_l2r_b2t_iter<T>(
        node: TreeNode<T> | undefined
    ): IEnumerator<TreeNode<T>> {
        return new NodeB2TEnumerator(
            NodeEnumeratorFactory.create_bf_r2l_t2b_iter(node)
        );
    }

    public static create_bf_r2l_b2t_iter<T>(
        node: TreeNode<T> | undefined
    ): IEnumerator<TreeNode<T>> {
        return new NodeB2TEnumerator(
            NodeEnumeratorFactory.create_bf_l2r_t2b_iter(node)
        );
    }
}

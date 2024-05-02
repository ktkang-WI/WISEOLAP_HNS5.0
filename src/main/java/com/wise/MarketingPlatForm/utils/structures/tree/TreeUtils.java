package com.wise.MarketingPlatForm.utils.structures.tree;

import java.math.BigDecimal;
import java.util.List;

import org.apache.poi.ss.formula.functions.T;

@SuppressWarnings("hiding")
public class TreeUtils<T> {
  public enum OrderType {
    DESC,
    ASC
  }
  private enum TopType {
    CURRENT,
    INCLUDECHILDREN
  }

  private void orderBy(List<TreeNode<BigDecimal>> root, OrderType type) {
    if (OrderType.ASC.equals(type)) {
      root.sort((o1, o2)->o1.getValue().compareTo(o2.getValue()));
    } else if (OrderType.DESC.equals(type)) {
      root.sort((o1, o2) -> o2.getValue().compareTo(o1.getValue()));
    }
    
    for(TreeNode<BigDecimal> node : root) {
      orderBy(node.getChildren(), type);
    }
  }

  public void orderBy(Tree<BigDecimal> tree, OrderType type) {
    TreeNode<BigDecimal> root = tree.get("");
    orderBy(root.getChildren(), type);
  }  

  public void orderBy(Tree<BigDecimal> tree, String path, OrderType type) {
    TreeNode<BigDecimal> root = tree.get(path);
    orderBy(root.getChildren(), type);
  }  

  public List<TreeNode<BigDecimal>> getTopNode(Tree<BigDecimal> tree, String path, int topN) {
    orderBy(tree, OrderType.DESC);
    List<TreeNode<BigDecimal>> children = tree.get(path).getChildren();
    return children.subList(0, Math.min(topN, children.size()));
  }

  public void top(Tree<BigDecimal> tree, int topN) {
    orderBy(tree, OrderType.DESC);
    TreeNode<BigDecimal> baseNode = tree.get("");
    top(baseNode, topN, TopType.INCLUDECHILDREN);
  }

  public void top(Tree<BigDecimal> tree, String path, int topN) {
    orderBy(tree, OrderType.DESC);
    TreeNode<BigDecimal> baseNode = tree.get(path);
    top(baseNode, topN, TopType.INCLUDECHILDREN);
  }

  public void top(Tree<BigDecimal> tree, String path, int topN, TopType topType) {
    orderBy(tree, OrderType.DESC);
    TreeNode<BigDecimal> baseNode = tree.get(path);
    if(TopType.INCLUDECHILDREN.equals(topType)) {
      top(baseNode, topN, TopType.INCLUDECHILDREN);
    } else if (TopType.CURRENT.equals(topType)) {
      top(baseNode, topN, TopType.CURRENT);
    }
  }

  private void top(TreeNode<BigDecimal> root, int topN, TopType topType) {
    List<TreeNode<BigDecimal>> temp =
      root.getChildren().subList(0, Math.min(topN, root.getChildren().size()));
    root.setChildren(temp);
    if(TopType.INCLUDECHILDREN.equals(topType)) {
      for(TreeNode<BigDecimal> node : root.getChildren()) top(node, topN, TopType.INCLUDECHILDREN);
    }
  }

  public TreeNode<T> searchingNode(TreeNode<T> baseNode, String name) {
    TreeNode<T> returnNode = baseNode;

    for (TreeNode<T> node : baseNode.children) {
      if (node.getName().equals(name)) {
        returnNode = node;
      }
    }
    return returnNode;
  }

  public TreeNode<T> findNode(TreeNode<T> baseNode, String name) {
    TreeNode<T> result = null;
    for (TreeNode<T> child : baseNode.children) {
      if (child.name.equals(name)) {
        result = child;
      }
    }
    if (result == null) {
      result = new TreeNode<T>();
      baseNode.children.add(result);
    }
    return result;
  };
}

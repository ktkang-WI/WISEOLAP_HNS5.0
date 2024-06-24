package com.wise.MarketingPlatForm.utils.structures.tree;

import java.util.List;
import java.util.Map;

import org.apache.poi.ss.formula.functions.T;

import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;

@SuppressWarnings("hiding")
public class TreeUtils<T> {
  public enum OrderType {
    DESC,
    ASC
  }
  public String generateKey(Map<String, Object> data, List<Dimension> dimensions) {
    StringBuilder keyBuilder = new StringBuilder();
    for (Dimension dim : dimensions) {
        if (keyBuilder.length() > 0) {
            keyBuilder.append(".");
        }
        keyBuilder.append(data.get(dim.getName()));
    }
    return keyBuilder.toString();
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

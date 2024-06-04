package com.wise.MarketingPlatForm.utils.structures.tree;

import java.math.BigDecimal;

import org.apache.poi.ss.formula.functions.T;

@SuppressWarnings("hiding")
public class TreeList<T> extends Tree<T>{
  private TreeUtils<T> treeUtils = new TreeUtils<T>();

  @Override
  public void push(String path, T data) {
    final String delimiter = super.getDelimiter();
    final String[] paths = path.split(delimiter);
    final int pathLen = paths.length;
    TreeNode<T> prevNode = super.getRootNode();
    TreeNode<T> currentNode = null;
    
    for (int index = 0; index < pathLen; index ++) {
      currentNode = treeUtils.findNode(prevNode, paths[index]);
      currentNode.setName(paths[index]);
      currentNode.setDepth(index);
      currentNode.setParent(prevNode);
      currentNode.setPath(super.getPakageName(currentNode));
      currentNode.setValue(data);
      prevNode = currentNode;
    }
  }

  @Override
  public void push(String path) {
    final String delimiter = super.getDelimiter();
    final String[] paths = path.split(delimiter);
    final int pathLen = paths.length;
    TreeNode<T> prevNode = super.getRootNode();
    TreeNode<T> currentNode = null;

    for (int index = 0; index < pathLen; index ++) {
      currentNode = treeUtils.findNode(prevNode, paths[index]);
      currentNode.setName(paths[index]);
      currentNode.setDepth(index);
      currentNode.setParent(prevNode);
      currentNode.setPath(super.getPakageName(currentNode));
      prevNode = currentNode;
    }
  }

  @SuppressWarnings("unchecked")
  @Override
  public void setNodeValue(String path, BigDecimal data, Type type) {
    TreeNode<BigDecimal> currentNode = (TreeNode<BigDecimal>) super.get(path);
    
    if (type.equals(Type.CURRENT_NODE_ONLY)) {
      currentNode.setValue(data);
    } else if (type.equals(Type.INCLUDE_PARENT_NODE)) {
      currentNode.setValue(data);
      
      TreeNode<BigDecimal> parentNode = currentNode._getParent();
      while (parentNode != null) {
        BigDecimal tempData = parentNode.getValue() != null ? parentNode.getValue() : BigDecimal.ZERO;
        BigDecimal addedData = data.add(tempData);
        parentNode.setValue(addedData);
        parentNode = parentNode._getParent();
      }
      
    }
  }

}

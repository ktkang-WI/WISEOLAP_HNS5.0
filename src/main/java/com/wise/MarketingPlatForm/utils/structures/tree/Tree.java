package com.wise.MarketingPlatForm.utils.structures.tree;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public abstract class Tree<T> {
  private TreeUtils<T> treeUtils = new TreeUtils<T>();
  private String delimiter = "."; // default delimiter
  private final TreeNode<T> root = new TreeNode<T>();
  public enum Type {
    CURRENT_NODE_ONLY,
    INCLUDE_PARENT_NODE
  }

  public TreeNode<T> getRootNode() {
    return this.root;
  }
  public Tree() {}

  public Tree(String delimiter) {
    this.delimiter = delimiter;
  }

  public String toString() {
    ObjectMapper mapper = new ObjectMapper();
    String json = null;
    try {
        json = mapper.writeValueAsString(root);
    } catch (JsonProcessingException e) {
        e.printStackTrace();
    }
    return json;
  }

  public List<Map<String, Object>> toListMap(List<String> dimensions) {
    TreeNode<T> root = getRootNode();
    toListMap(dimensions, root.getChildren());

    return null;
  }

  private List<Map<String, Object>> toListMap(List<String> dimensions, List<TreeNode<T>> children) {


    return null;
  }

  public String getDelimiter() {
    if (this.delimiter.equals(".")) return "\\" + this.delimiter;

    return this.delimiter;
  }

  public String getPakageName(TreeNode<T> cur) {
    if (cur.parent == null) return "";
    final List<String> parentNames = new ArrayList<>();
    String fullName = "";
    do {
      cur = cur._getParent();
      parentNames.add(cur.getName());
    } while (!(cur.parent == null));

    for (int i = parentNames.size() - 1; i >= 0; i--) {
      if (parentNames.get(i).equals("")) continue;
      if (fullName.equals("")) {
        fullName = parentNames.get(i);
        continue;
      }
      fullName = fullName+"."+parentNames.get(i);
    }
    return fullName;
  }

  public TreeNode<T> get(String path) {
    final String[] paths = path.split(getDelimiter());
    final int pathLen = paths.length;

    TreeNode<T> tempNode = root;

    for (int index = 0; index < pathLen; index++) {
      tempNode = treeUtils.searchingNode(tempNode, paths[index]);
      if (tempNode == null) return null;
    }

    if (tempNode != null) {
      return tempNode;
    }

    return null;
  }

  public abstract void push(String path, T data);
  public abstract void push(String path);
  public abstract void setNodeValue(String path, BigDecimal data, Type type);

}

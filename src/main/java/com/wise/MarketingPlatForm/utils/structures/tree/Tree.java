package com.wise.MarketingPlatForm.utils.structures.tree;

import java.math.BigDecimal;

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

  public String getDelimiter() {
    if (this.delimiter.equals(".")) return "\\" + this.delimiter;

    return this.delimiter;
  }

  public String getPakageName(TreeNode<T> cur) {
    if (cur.parent == null) return "";
    final StringBuilder fullName = new StringBuilder();
    cur = cur._getParent();
    
    while (cur.parent != null) {
      if (!cur.getName().isEmpty()) {
          if (fullName.length() > 0) {
              fullName.insert(0, ".");
          }
          fullName.insert(0, cur.getName());
      }
      cur = cur._getParent();
    }
    
    if (!cur.getName().isEmpty()) {
        if (fullName.length() > 0) {
            fullName.insert(0, ".");
        }
        fullName.insert(0, cur.getName());
    }
    
    return fullName.toString();
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

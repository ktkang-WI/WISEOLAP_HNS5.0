package com.wise.MarketingPlatForm.utils.structures.tree;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class TreeNode<T> {
  String path;
  String name;
  T value;
  int depth;
  TreeNode<T> parent;
  List<TreeNode<T>> children;

  public TreeNode() {
    this.name = "";
    this.path = "";
    this.children = new ArrayList<TreeNode<T>>();
  }
  
  public void setParent(TreeNode<T> parent) {
    this.parent = parent;
  }

  public void setDepth(int depth) {
    this.depth = depth;
  }

  public int _getDepth() {
    return this.depth;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getName() {
    return this.name;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public void setChildren(List<TreeNode<T>> children) {
    this.children = children;
  }

  public List<TreeNode<T>> getChildren() {
    return this.children;
  }

  public TreeNode<T> _getParent() {
    return this.parent;
  }
  
  public String _getPath() {
    return this.path;
  }

  public void setValue(T value) {
    this.value = value;
  }

  public T getValue() {
    return this.value;
  }

}

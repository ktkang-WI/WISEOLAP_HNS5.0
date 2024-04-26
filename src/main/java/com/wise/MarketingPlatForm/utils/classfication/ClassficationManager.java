package com.wise.MarketingPlatForm.utils.classfication;

public class ClassficationManager {
  
  String delimiter = "-"; // default delimiter
  private final ClassficationNode root = new ClassficationNode();

  public ClassficationManager() {

  }
  public ClassficationManager(String delimiter) {
    this.delimiter = delimiter;
  }

  public String toString() {
    return "{name: '', " + root.childrens.toString() + "}";
  }

  public void push(String name, Object data){
    String[] names = name.split(delimiter);
    ClassficationNode prevNode = root;
    ClassficationNode currentNode = null;
    final int nameLen = names.length;
    
    for (int index = 0; index < nameLen; index ++) {
      currentNode = findNode(prevNode, names[index]);
      currentNode.setKey(names[index]);
      prevNode = currentNode;
    }
  }

  public String toJson() {

    return null;
  }

  // to find base node.
  private ClassficationNode findNode(ClassficationNode baseNode, String name) {
    ClassficationNode result = null;
    for (ClassficationNode child : baseNode.childrens) {
      if (child.name.equals(name)) {
        result = child;
      }
    }
    if (result == null) {
      result = new ClassficationNode();
      baseNode.childrens.add(result);
    }
    return result;
  };

}

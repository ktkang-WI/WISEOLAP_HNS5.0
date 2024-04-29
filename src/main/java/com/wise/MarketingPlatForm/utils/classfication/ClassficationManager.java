package com.wise.MarketingPlatForm.utils.classfication;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ClassficationManager {
  
  String delimiter = "-"; // default delimiter
  private final ClassficationNode root = new ClassficationNode();

  public ClassficationManager() {

  }
  public ClassficationManager(String delimiter) {
    this.delimiter = delimiter;
  }

  public String toJson() {
    ObjectMapper mapper = new ObjectMapper();
    String json = null;
    try {
        json = mapper.writeValueAsString(root);
    } catch (JsonProcessingException e) {
        e.printStackTrace();
    }
    return json;
  }

  public void push(String name, Object data){
    String[] names = name.split(delimiter);
    ClassficationNode prevNode = root;
    ClassficationNode currentNode = null;
    final int nameLen = names.length;
    
    for (int index = 0; index < nameLen; index ++) {
      currentNode = findNode(prevNode, names[index]);
      currentNode.setKey(names[index]);
      if (index == (nameLen - 1)) currentNode.setValue(data);
      prevNode = currentNode;
    }
  }

  // to find base node.
  private ClassficationNode findNode(ClassficationNode baseNode, String name) {
    ClassficationNode result = null;
    for (ClassficationNode child : baseNode.children) {
      if (child.name.equals(name)) {
        result = child;
      }
    }
    if (result == null) {
      result = new ClassficationNode();
      baseNode.children.add(result);
    }
    return result;
  };

}

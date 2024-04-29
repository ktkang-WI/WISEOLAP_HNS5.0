package com.wise.MarketingPlatForm.utils.classfication;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ClassficationNode {
  String name;
  BigDecimal value;
  List<ClassficationNode> children;

  public ClassficationNode() {
    this.name = "";
    this.value = new BigDecimal(0);
    this.children = new ArrayList<ClassficationNode>();
  }

  public void setKey(String name) {
    this.name = name;
  }
  public void setValue(Object value) {
    if (value == null) value = 0;
    this.value = new BigDecimal(value.toString());
  }
}

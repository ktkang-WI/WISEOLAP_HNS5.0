package com.wise.MarketingPlatForm.utils.classfication;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ClassficationNode {
  String name;
  BigDecimal value;
  List<ClassficationNode> childrens;

  public ClassficationNode() {
    this.name = "";
    this.value = new BigDecimal(0);
    this.childrens = new ArrayList<ClassficationNode>();
  }

  public void setKey(String name) {
    this.name = name;
  }

}

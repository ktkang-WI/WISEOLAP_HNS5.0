package com.wise.MarketingPlatForm.utils;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class ListDataUtility<T> {
  
  public List<T> mergeList(List<T> first, List<T> second) {
    List<T> mergeMeasures = new ArrayList<>();
    first
        .stream()
        .forEach(fm -> mergeMeasures.add(fm));
    second
        .stream()
        .forEach(fm -> mergeMeasures.add(fm));

    return mergeMeasures;
  }

  public List<T> mergeList(List<T> first, List<T> second, Function<T> func) {
    List<T> mergeMeasures = new ArrayList<>();
    first
        .stream()
        .forEach(fm -> mergeMeasures.add(fm));
    second
        .stream()
        .filter(m -> first.stream().anyMatch(mm -> func.execute(m, mm)))
        .forEach(fm -> mergeMeasures.add(fm));

    return mergeMeasures;
  }
}

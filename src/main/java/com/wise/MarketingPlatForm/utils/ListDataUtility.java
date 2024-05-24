package com.wise.MarketingPlatForm.utils;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class ListDataUtility<T> {
  
  public List<T> mergeList(List<T> first, List<T> second) {
    List<T> mergedMeasures = new ArrayList<>();
    first
        .stream()
        .forEach(fm -> mergedMeasures.add(fm));
    second
        .stream()
        .forEach(fm -> mergedMeasures.add(fm));

    return mergedMeasures;
  }

  public List<T> mergeList(List<T> first, List<T> second, Function<T> func) {
    List<T> mergedMeasures = new ArrayList<>();
    first
        .stream()
        .forEach(fm -> mergedMeasures.add(fm));
    second
        .stream()
        .filter(m -> first.stream().anyMatch(mm -> func.execute(m, mm)))
        .forEach(fm -> mergedMeasures.add(fm));

    return mergedMeasures;
  }
}

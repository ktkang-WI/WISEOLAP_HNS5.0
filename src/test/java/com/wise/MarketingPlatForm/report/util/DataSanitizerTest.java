package com.wise.MarketingPlatForm.report.util;

import static org.junit.Assert.assertEquals;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;

import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.PagingOption;
import com.wise.MarketingPlatForm.report.type.SummaryType;

public class DataSanitizerTest {
  private static List<Map<String, Object>> data;
  private static List<Dimension> dimensions;
  private static List<Measure> measures;
  private static PagingOption pagingOption;

  @BeforeAll
  static void beforeAll() {
    dimensions = new ArrayList<>();
    measures = new ArrayList<>();
    pagingOption = new PagingOption(0, 20, true);

    dimensions.add(new Dimension("category", "category", "category", "dataItem1", "dimension"));
    dimensions.add(new Dimension("bigCategory", "bigCategory", "bigCategory", "dataItem2", "dimension"));
    measures.add(new Measure("price", "price", "price", SummaryType.SUM, "dataItem3"));
  }

  @BeforeEach
  void before() {
    data = new ArrayList<Map<String, Object>> ();

    for (int i = 0; i < 10000; i++) {
      Map<String, Object> map = new HashMap<String, Object>();

      map.put("id", String.valueOf(i));
      map.put("price", i * 100);
      map.put("category", String.valueOf(i % 5));
      map.put("bigCategory", String.valueOf(i % 3));
      data.add(map);
    }
  }


  @Test
  public void groupByTest() {
    DataSanitizer sanitizer = new DataSanitizer(data);
    List<Map<String, Object>> result = sanitizer.groupBy(measures, dimensions).getData();

    assertEquals(result.size(), 15);
    assertEquals(result.get(0).get("price"), new BigDecimal(333299900));
  }

  @Test
  public void orderByTset() {
    DataSanitizer sanitizer = new DataSanitizer(data);
    List<Map<String, Object>> result = sanitizer.orderBy(dimensions).getData();

    assertEquals(result.size(), 10000);
    assertEquals(result.get(0).get("category"), "0");
    assertEquals(result.get(0).get("bigCategory"), "0");
  }

  @Test
  public void columnFilteringTest() {
    DataSanitizer sanitizer = new DataSanitizer(data);
    List<Map<String, Object>> result = sanitizer.columnFiltering(measures, dimensions).getData();
    assertEquals(result.get(0).containsKey("id"), false);
  }

  @Test
  public void pagingTest() {
    DataSanitizer sanitizer = new DataSanitizer(data);
    List<Map<String, Object>> result = sanitizer.paging(pagingOption).getData();
    assertEquals(result.size(), 20);
  }
}

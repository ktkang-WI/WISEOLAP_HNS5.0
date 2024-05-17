package com.wise.MarketingPlatForm.utils;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class ListUtility {
  private static final Logger logger = LoggerFactory.getLogger(ListUtility.class);
  private static ListUtility _instance;

  public ListUtility() {

  }

  public static ListUtility getInstance() {
    if (_instance == null) {
      _instance = new ListUtility();
    } 

    return _instance;
  }

  public <T> boolean removeNullInParameterList(List<T> list) {
    boolean isOk = false;
    if (list.remove(null)) {
        isOk = true;
        logger.debug("매개변수에 Null 요소가 포함된 배열이 입력되어 해당 요소가 삭제되었습니다.");
    }
    return isOk;
}
}

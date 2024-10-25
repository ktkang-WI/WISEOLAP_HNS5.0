package com.wise.MarketingPlatForm.utils;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class ExceptionUtil{
  private static final Logger logger = LoggerFactory.getLogger(ExceptionUtil.class);

  public ExceptionUtil () {
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Object> handleAllException(Exception ex, WebRequest request) {
    logger.error("An error occurred: {}", ex.getMessage(), ex);

    Map<String, String> uriMap = new HashMap<>();
    uriMap.put("uri=/dataset/param-list-items", "paramList");
    
    String requestUri = request.getDescription(false);
    
    String exceptionType = "";
    String msg = "";

    if (ex.getCause() != null) {
      String[] exceptionStr = ex.getCause().toString().split(":");
      msg = ex.getCause().toString();

      for (String exception: exceptionStr) {
        if (exception.contains("Exception")) {
          exceptionType = exception;
          break;
        }
      }
    } else {
      msg = ex.getMessage();
    }

    Map<String, String> test = new HashMap<>();

    test.put("code", exceptionType);
    test.put("serverMsg", msg);
    test.put("whereIs", uriMap.get(requestUri));
    
    return ResponseEntity.badRequest().body(test);
  }
}

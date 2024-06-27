package com.wise.MarketingPlatForm.account.vo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RestAPIVO {
  Object data;
  String info;

  private static ResponseEntity<RestAPIVO> badRequestFormat(Object data, String txt) {
    RestAPIVO restAPIVO = RestAPIVO.builder()
    .info(txt)
    .data(data)
    .build();
    return new ResponseEntity<>(restAPIVO, HttpStatus.BAD_REQUEST);
  }

  private static ResponseEntity<RestAPIVO> okResponseFormat(Object data, String txt) {
    RestAPIVO restAPIVO = RestAPIVO.builder()
    .info(txt)
    .data(data)
    .build();
    return new ResponseEntity<>(restAPIVO, HttpStatus.OK);
  }

  private static ResponseEntity<RestAPIVO> conflictResponseFormat(Object data, String txt) {
    RestAPIVO restAPIVO = RestAPIVO.builder()
    .info(txt)
    .data(data)
    .build();
    return new ResponseEntity<>(restAPIVO, HttpStatus.CONFLICT);
  }

  private static ResponseEntity<RestAPIVO> unauthorizedResponseFormat(Object data, String txt) {
    RestAPIVO restAPIVO = RestAPIVO.builder()
    .info(txt)
    .data(data)
    .build();
    return new ResponseEntity<>(restAPIVO, HttpStatus.UNAUTHORIZED);
  }

  public static ResponseEntity<RestAPIVO> badRequest(Object data){
    return badRequestFormat(data ,"Invalid request parameters.");
  }

  public static ResponseEntity<RestAPIVO> badRequest(Object data, String txt){
    return badRequestFormat(data, txt);
  }

  public static ResponseEntity<RestAPIVO> okResponse(Object data){
    return okResponseFormat(data, "200");
  }

  public static ResponseEntity<RestAPIVO> okResponse(Object data, String txt){
    return okResponseFormat(data, txt);
  }

  public static ResponseEntity<RestAPIVO> conflictResponse(Object data){
    return conflictResponseFormat(data, "500");
  }

  public static ResponseEntity<RestAPIVO> conflictResponse(Object data, String txt){
    return conflictResponseFormat(data, txt);
  }

  public static ResponseEntity<RestAPIVO> unauthorizedResponse(Object data){
    return unauthorizedResponse(data, "401");
  }

  public static ResponseEntity<RestAPIVO> unauthorizedResponse(Object data, String txt){
    return unauthorizedResponse(data, txt);
  }

}

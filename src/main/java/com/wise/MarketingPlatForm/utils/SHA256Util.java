package com.wise.MarketingPlatForm.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.stereotype.Component;

@Component
public class SHA256Util {
  public String encrypt(String pw) throws NoSuchAlgorithmException {
    MessageDigest md = MessageDigest.getInstance("SHA-256");
    md.update(pw.getBytes());
    
    return bytesToHex(md.digest());
  }

  private String bytesToHex(byte[] pwBytes) {
    StringBuilder builder = new StringBuilder();
    
    for (byte b : pwBytes) {
     	// 바이트 값을 16진수 문자열로 변환하여 StringBuilder에 추가
      builder.append(String.format("%02x", b)); 
    }

    return builder.toString(); 
  }
}

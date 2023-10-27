package com.wise.MarketingPlatForm.secure.util;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import com.wise.MarketingPlatForm.global.util.PropertyUtils;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.security.InvalidAlgorithmParameterException;


public class Aes256Cipher {
    private static volatile Aes256Cipher INSTANCE;

    private String secretKey = PropertyUtils.getProperty("aes256.secure.key"); // 32bit
    private String IV = ""; // 16bit

    public static Aes256Cipher getInstance() {
        if (INSTANCE == null) {
            synchronized (Aes256Cipher.class) {
                if (INSTANCE == null)
                    INSTANCE = new Aes256Cipher();
            }
        }
        return INSTANCE;
    }

    private Aes256Cipher() {
        IV = secretKey.substring(0, 16);
    }

    // 암호화
    public String AES_Encode(String str)
            throws java.io.UnsupportedEncodingException, NoSuchAlgorithmException, NoSuchPaddingException,
            InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException {
        byte[] keyData = secretKey.getBytes();

        SecretKey secureKey = new SecretKeySpec(keyData, "AES");

        Cipher c = Cipher.getInstance("AES/CBC/PKCS5Padding");
        c.init(Cipher.ENCRYPT_MODE, secureKey, new IvParameterSpec(IV.getBytes()));

        byte[] encrypted = c.doFinal(str.getBytes("UTF-8"));
        String enStr = new String(Base64.getEncoder().encode(encrypted));

        return enStr;
    }

    // 복호화
    public String AES_Decode(String str)
            throws java.io.UnsupportedEncodingException, NoSuchAlgorithmException, NoSuchPaddingException,
            InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException {
        byte[] keyData = secretKey.getBytes("UTF-8");
        SecretKey secureKey = new SecretKeySpec(keyData, "AES");
        Cipher c = Cipher.getInstance("AES/CBC/PKCS5Padding");
        c.init(Cipher.DECRYPT_MODE, secureKey, new IvParameterSpec(IV.getBytes("UTF-8")));

        byte[] byteStr = Base64.getDecoder().decode(str.getBytes());

        return new String(c.doFinal(byteStr), "UTF-8");
    }
    
    // 쿼리 암호화 Aes256Cipher -> base64 만약 encodeUse가 false인 경우 base64로만 encode
    // public String AES_query_Encode(String str) {
    //     boolean encodeUse = Configurator.getInstance().getConfigBooleanValue("wise.ds.encodeUse", false);
    //     try {
    //         if(!("".equals(str) || str == null)) {
    //             String enStr = "";
    //             if(encodeUse) {
    //                 byte[] keyData = secretKey.getBytes("UTF-8");
            
    //                 SecretKey secureKey = new SecretKeySpec(keyData, "AES");
            
    //                 Cipher c;
    //                     c = Cipher.getInstance("AES/CBC/PKCS5Padding");
    //                 c.init(Cipher.ENCRYPT_MODE, secureKey, new IvParameterSpec(IV.getBytes()));
            
    //                 byte[] encrypted = c.doFinal(str.getBytes("UTF-8"));
    //                 enStr = Base64.encodeBase64String(encrypted);
            
    //                 return enStr;
    //             } else {
    //                 enStr = new String(Base64.encodeBase64(str.getBytes()));
    //                 return enStr;
    //             }
    //         } else {
    //             return str;
    //         }
    //     } catch (Exception e) {
    //         return "쿼리 암호화 오류";
    //     }
    // }
    
    // // 쿼리 복호화 base64 -> Aes256Cipher 만약 encodeUse가 false인 경우 base64로만 decode
    // public String AES_query_Decode(String str)
    //         throws java.io.UnsupportedEncodingException, NoSuchAlgorithmException, NoSuchPaddingException,
    //         InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException {
    //     boolean encodeUse = Configurator.getInstance().getConfigBooleanValue("wise.ds.encodeUse", false);
    //     String enStr = "";
    //     if(!("".equals(str) || str == null)) {
    //         if(encodeUse) {
    //             byte[] keyData = secretKey.getBytes("UTF-8");
    //             SecretKey secureKey = new SecretKeySpec(keyData, "AES");
    //             Cipher c = Cipher.getInstance("AES/CBC/PKCS5Padding");
    //             c.init(Cipher.DECRYPT_MODE, secureKey, new IvParameterSpec(IV.getBytes("UTF-8")));
        
    //             byte[] byteStr = Base64.decodeBase64(str);
    //             enStr = new String(c.doFinal(byteStr), "UTF-8");
    //             return enStr;
    //         } else {
    //             enStr = new String(Base64.decodeBase64(str), "UTF-8");
    //             return enStr;
    //         }
    //     } else {
    //         return str;
    //     }
    // }
}
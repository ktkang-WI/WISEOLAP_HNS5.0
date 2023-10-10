package com.wise.MarketingPlatForm.auth;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

import com.wise.MarketingPlatForm.auth.dao.AuthDAO;;

@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class AuthTest {

  @Autowired
  private AuthDAO authDAO;

  @Test
  public void getUserByIdTest() {
    assertEquals(authDAO, null);
    // UserEntity entity = authDAO.selectUserById("admin");
    // assertEquals(entity.getUserNm(), "관리자");
  }
}

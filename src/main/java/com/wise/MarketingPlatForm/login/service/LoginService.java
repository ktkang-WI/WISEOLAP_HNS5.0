package com.wise.MarketingPlatForm.login.service;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;
import com.wise.MarketingPlatForm.auth.service.AuthService;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.utils.CalcDate;
import com.wise.MarketingPlatForm.utils.SHA256Util;

@Service
public class LoginService {
    private static final Logger logger = LoggerFactory.getLogger(LoginService.class);
    @Autowired
    AuthService authService;
    
    @Autowired
    CalcDate calcDate;

    @Autowired
    SHA256Util sha256Util;

    private int getIsChangePw(UserDTO userDTO, String id, String inputPw) {
        if ("1111-11-11 00:00:00".equals(userDTO.getPwChangeDt())) {
            return 4;
        }
        if (userDTO != null && userDTO.getPwChangeDt() == null && id.equals(inputPw)) {
            // 1: 사번, pw 같고, 처음 로그인 하는 경우.
            return 1;
        }
        if (id.equals(inputPw)) {
            return 1;
        }
        try {
            String[] splitDate = userDTO.getPwChangeDt().split(" ");
            String[] yyyyMMdd = splitDate[0].split("-");
            int result = calcDate.dDayCalculator(yyyyMMdd[0], yyyyMMdd[1], yyyyMMdd[2]);
            
            if (result >=0) {
                // 3: 변경일 만료
                return 3;
            } else if (result < 0 && result >= -5) {
                // TODO: 변경 예정일 5일전 (알림용, 추후 필요시 개발예정)
                return 2;
            }
        } catch (Exception e) {
            logger.error("pw_change_dt", e);
            return 1;
        }

        return 0;
    };

    private boolean getMatchPw(String inputPw, String getPw) {
        boolean result = false;

        if ("".equals(inputPw)) {
            return result;
        }
        // db에 암호화로 저장되기 전 pw
        if (inputPw.equals(getPw)) {
            result = true;
        }

        try {
            String encodedPw = sha256Util.encrypt(inputPw);
            if (encodedPw.equals(getPw)) {
                result = true;
            }
        } catch (Exception e) {
            logger.error("chack_inputPw_getPw", e);
            return false;
            
        }
        return result;
    }

    public UserDTO getLoginUser(String id, String password) {
        UserDTO userDTO = authService.getUserById(id);
        boolean isMatchPw = getMatchPw(password, userDTO.getPassword());

        if (userDTO != null && isMatchPw) {
            GroupMstrEntity grpEntity = authService.getUserGroupById(userDTO.getGrpId());
            if (grpEntity != null) {
                userDTO.setGrpRunMode(grpEntity.getGrpRunMode());
            }

            // 비밀번호 변경 여부 검사
            int changePwType = getIsChangePw(userDTO, id, password);

            if (changePwType > 0) {
                userDTO.setIsChangePw(changePwType);
                return userDTO;
            };
           
            return userDTO;
        } else {
            return null;
        }
    }
}

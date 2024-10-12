package com.wise.MarketingPlatForm.login.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;
import com.wise.MarketingPlatForm.auth.service.AuthService;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.utils.CalcDate;

@Service
public class LoginService {
    @Autowired
    AuthService authService;
    
    @Autowired
    CalcDate calcDate;

    private int getIsChangePw(UserDTO userDTO, String id, String inputPw) {
        if (userDTO != null && userDTO.getPwChangeDt() == null && id.equals(inputPw)) {
            // 1: 사번, pw 같고, 처음 로그인 하는 경우.
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
            System.out.println(e);
        }

        return 0;
    };

    // 추후 암호화 관련 메서드
    private boolean getMatchPw(String inputPw, String getPw) {
        // db에서 암호화되어 저장된 pw 가져와서 풀기
        // front에서 입력한 pw 암호화 된 것 풀기
        // 풀고 둘이 비교. password.equals(userDTO.getPassword())
        return inputPw.equals(getPw);
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

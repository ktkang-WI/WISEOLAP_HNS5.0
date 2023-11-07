package com.wise.MarketingPlatForm.auth.vo;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
@Setter
public class AuthDataDTO {
    int grpId;
    int userNo;
    String dataXmlBase64;
    String dataXml;
    List<AuthCubeVO> authCube;
    List<AuthDimVO> authDim;

    public boolean hasAuthCube(int dsViewId, int cubeId) {
        for (AuthCubeVO cubeVo : authCube) {
            if (cubeVo.getDsViewId() == dsViewId &&
                    cubeVo.getCubeId() == cubeId) {
                return true;
            }
        }

        return false;
    }

    public boolean hasAuthDim(int dsViewId, String dimUniNm) {
        for (AuthDimVO dimVo : authDim) {
            if (dimVo.getDsViewId() == dsViewId &&
                    dimVo.getDimUniNm().equals(dimUniNm)) {
                return true;
            }
        }

        return false;
    }
}

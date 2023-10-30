package com.wise.MarketingPlatForm.auth.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthDataEntity {
    int grpId;
    int usrId;
    int userNo;
    String dataXmlBase64;
}
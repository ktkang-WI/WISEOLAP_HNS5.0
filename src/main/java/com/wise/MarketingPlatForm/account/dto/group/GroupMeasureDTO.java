package com.wise.MarketingPlatForm.account.dto.group;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupMeasureDTO {
    int grpId;
    String dataXml;
}

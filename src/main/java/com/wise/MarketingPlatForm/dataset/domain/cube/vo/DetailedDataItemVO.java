package com.wise.MarketingPlatForm.dataset.domain.cube.vo;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DetailedDataItemVO {
    int cubeId;
    int actId;
    String actNm;
    String uniNm;
    String rtnItemUniNm;
    String type;
    int ordinal;
}

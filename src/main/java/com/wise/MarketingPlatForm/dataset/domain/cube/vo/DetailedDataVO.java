package com.wise.MarketingPlatForm.dataset.domain.cube.vo;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DetailedDataVO {
    int cubeId;
    int actId;
    String actNm;
    String uniNm;
    String rtnItemUniNm;
    int ordinal;
    String dimCaption;
    String meaCaption;
    String dimYn;
    String meaYn;

    String targetTable;
}

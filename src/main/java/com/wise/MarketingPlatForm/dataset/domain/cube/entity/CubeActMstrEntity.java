package com.wise.MarketingPlatForm.dataset.domain.cube.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CubeActMstrEntity {
    int cubeId;
    int actId;
    String actNm;
    int maxRows;
    String meaGrpUniNm;
    String actDesc;
}

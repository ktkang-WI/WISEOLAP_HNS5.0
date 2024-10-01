package com.wise.MarketingPlatForm.portal.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CardDataDTO {
    String date;
    int amount;
    String prev;
    String plan;
}

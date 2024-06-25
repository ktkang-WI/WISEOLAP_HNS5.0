package com.wise.MarketingPlatForm.report.domain.data.data;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TopBottom {
    String target;
    String applyField;
    int count;
    String type;
    boolean percentage;
    boolean others;
    int depth = 0;
    String depthNames;
}

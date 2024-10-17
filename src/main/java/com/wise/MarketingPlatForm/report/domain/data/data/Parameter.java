package com.wise.MarketingPlatForm.report.domain.data.data;

import java.util.List;

import com.wise.MarketingPlatForm.dataset.type.DsType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Parameter {
    int dsId;
    String name;
    String dataType;
    String operation;
    DsType dsType;
    String exceptionValue;
    List<String> values;
    String uniqueName;
    String caption;
    String paramType;
    String itemCaption;
    String itemKey;
    String format;
}

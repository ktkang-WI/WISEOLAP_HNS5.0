package com.wise.MarketingPlatForm.report.domain.data.data;

import com.wise.MarketingPlatForm.dataset.type.DataFieldType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Dimension implements RootData {
    String caption;
    String name;
    String uniqueName;
    String fieldId;
    String category;
    DataFieldType type;
}

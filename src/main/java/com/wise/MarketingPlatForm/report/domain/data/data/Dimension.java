package com.wise.MarketingPlatForm.report.domain.data.data;

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
    String sortBy;
    String sortOrder;
}

package com.wise.MarketingPlatForm.report.domain.data.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PagingOption {
    int start;
    int size;
    boolean pagingEnabled;
}

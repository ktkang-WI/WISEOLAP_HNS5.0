package com.wise.MarketingPlatForm.report.vo;
import java.util.Date;
import java.util.List;

import com.wise.MarketingPlatForm.report.entity.DwReportChkEntity;
import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;

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
public class DwReportChkDTO {
    private String[] chkGb;
    private String[] errDesc;
    private String reportId;

    public DwReportChkDTO fromEntityList(List<DwReportChkEntity> entityList) {
        this.chkGb = new String[entityList.size()];
        this.errDesc = new String[entityList.size()];
        this.reportId = "";

        if (entityList.size() == 0) {
            return this;
        }

        this.reportId = entityList.get(0).getReportId();
        for (int i = 0; i < entityList.size(); i++) {
            this.chkGb[i] = entityList.get(i).getChkGb();
            this.errDesc[i] = entityList.get(i).getErrDesc();
        }

        return this;
    }
}

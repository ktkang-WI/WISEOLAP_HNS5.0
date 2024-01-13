package com.wise.MarketingPlatForm.querygen.model;

import java.util.ArrayList;
import java.util.List;

import com.wise.MarketingPlatForm.auth.vo.AuthMemVO;
import com.wise.MarketingPlatForm.dataset.vo.CubeTableColumn;
import com.wise.MarketingPlatForm.querygen.dto.Relation;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CubeParamSet {
    private DataAggregation dataAggreagtion;
    private List<String> columnList;
    private List<String> measureList;
    private List<String> dataAuthUniqueNmList;

    private List<Relation> cubeRelation;
    private List<Relation> dsViewRelation;

    private List<AuthMemVO> authMembers;

    private List<CubeTableColumn> columnInfoList;

    public CubeParamSet(DataAggregation dataAggreagtion){
        this.dataAggreagtion = dataAggreagtion ;
        this.columnList = new ArrayList<String>();
        this.measureList = new ArrayList<String>();
        this.dataAuthUniqueNmList = new ArrayList<String>();
    }
}

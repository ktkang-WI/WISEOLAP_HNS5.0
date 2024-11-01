package com.wise.MarketingPlatForm.querygen.model;

import java.util.ArrayList;

import com.wise.MarketingPlatForm.querygen.dto.Hierarchy;
import com.wise.MarketingPlatForm.querygen.dto.SelectCube;
import com.wise.MarketingPlatForm.querygen.dto.SelectCubeEtc;
import com.wise.MarketingPlatForm.querygen.dto.SelectCubeMeasure;
import com.wise.MarketingPlatForm.querygen.dto.SelectCubeOrder;
import com.wise.MarketingPlatForm.querygen.dto.SelectCubeWhere;
import com.wise.MarketingPlatForm.report.domain.data.data.HavingClauseInfo;
import com.wise.MarketingPlatForm.querygen.dto.Relation;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QueryGenAggregation {
    ArrayList<SelectCube> cubeSelectAll = new ArrayList<SelectCube>();
	ArrayList<Hierarchy> cubeHie = new ArrayList<Hierarchy>();
	ArrayList<Hierarchy> cubeHieJoin = new ArrayList<Hierarchy>();
	ArrayList<SelectCubeMeasure> cubeSelectMeasures = new ArrayList<SelectCubeMeasure>();
	ArrayList<Relation> cubeRelations = new ArrayList<Relation>();
	ArrayList<Relation> dsViewRelations = new ArrayList<Relation>();
	ArrayList<SelectCubeWhere> cubeWhere = new ArrayList<SelectCubeWhere>();
	ArrayList<SelectCubeOrder> cubeOrder = new ArrayList<SelectCubeOrder>();
    ArrayList<SelectCubeEtc> cubeEtc = new ArrayList<SelectCubeEtc>();
    ArrayList<HavingClauseInfo> havingClauseInfo = new ArrayList<HavingClauseInfo>();

    public void addSelectCube(SelectCube selectCube) {
        this.cubeSelectAll.add(selectCube);
    }

    public void addCubeHie(Hierarchy cubeHie) {
        this.cubeHie.add(cubeHie);
    }

    public void addCubeOrder(SelectCubeOrder cubeOrder) {
        this.cubeOrder.add(cubeOrder);
    }

    public void addSelectCubeMeasure(SelectCubeMeasure selectCubeMeasure) {
        this.cubeSelectMeasures.add(selectCubeMeasure);
    }

    public void addCubeRelation(Relation cubeRelation) {
         this.cubeRelations.add(cubeRelation);
    }

    public void addDsViewRelation(Relation dsViewRelation) {
         this.dsViewRelations.add(dsViewRelation);
    }

    public void addCubeWhere(SelectCubeWhere cubeWhere) {
        this.cubeWhere.add(cubeWhere);
    }
    
    public void addHavingClauseInfo(HavingClauseInfo havingClauseInfo) {
        this.havingClauseInfo.add(havingClauseInfo);
    }
}

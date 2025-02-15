package com.wise.MarketingPlatForm.querygen.aggregator;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.dataset.vo.CubeTableColumn;
import com.wise.MarketingPlatForm.querygen.dto.Hierarchy;
import com.wise.MarketingPlatForm.querygen.dto.Relation;
import com.wise.MarketingPlatForm.querygen.dto.SelectCube;
import com.wise.MarketingPlatForm.querygen.dto.SelectCubeMeasure;
import com.wise.MarketingPlatForm.querygen.dto.SelectCubeOrder;
import com.wise.MarketingPlatForm.querygen.dto.SelectCubeWhere;
import com.wise.MarketingPlatForm.querygen.model.CubeParamSet;
import com.wise.MarketingPlatForm.querygen.model.QueryGenAggregation;
import com.wise.MarketingPlatForm.querygen.util.QueryGenAggregationUtil;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.HavingClauseInfo;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.Parameter;
import com.wise.MarketingPlatForm.report.type.ItemType;

@Service
public class QueryGenAggregator {

    private String itemType;

    public QueryGenAggregation createQueryGenAggregation(CubeParamSet cubeParamSet){
        QueryGenAggregation queryGenAggregation = new QueryGenAggregation();
        DataAggregation dataAggregation= cubeParamSet.getDataAggregation();

        this.itemType = dataAggregation.getItemType().toString();

        List<Dimension> dimensions = dataAggregation.getDimensions();
        List<Measure> measures = new ArrayList<>();
        measures.addAll(dataAggregation.getMeasures());
        measures.addAll(dataAggregation.getSortByItems());
        List<Parameter> params = dataAggregation.getParameters();

        List<CubeTableColumn> columnInfoList = cubeParamSet.getColumnInfoList();
        List<HavingClauseInfo> havingClauseInfo = dataAggregation.getHavingClauseInfo();
        
        try {
            //Relation Update (주제영역관계, 원본뷰 관계)
            updateCubeRelation(queryGenAggregation,cubeParamSet);

            for(CubeTableColumn columnInfo : columnInfoList){

                //차원에 포함되어있는지 확인
                if(isIncludeByDimensions(columnInfo,dimensions)){
                    updateCubeSelectAll(queryGenAggregation, cubeParamSet, columnInfo, "dimension");
                    updateCubeHie(queryGenAggregation, cubeParamSet, columnInfo);
                    //updateCubeOrder(queryGenAggregation, cubeParamSet, columnInfo, "dimension");
                }

                //측정값에 포함되어있는지 확인
                if(isIncludeByMeasures(columnInfo,measures)){
                    if ("measure".equalsIgnoreCase(columnInfo.getColumnType())) {
                        // 구성비 관련 커스터마이징 추후제거
                        if("SUBQ".equalsIgnoreCase(columnInfo.getAggregationType())
                            && columnInfo.getExpression() != null){
                            setSubqPartitionBy(columnInfo,dimensions);   
                        }
                        updateCubeSelectAll(queryGenAggregation,cubeParamSet, columnInfo, "measure");
                        updateCubeSelectMeasure(queryGenAggregation,cubeParamSet, columnInfo, measures);
                    } else if ("dimension".equalsIgnoreCase(columnInfo.getColumnType())) {
                        updateCubeSelectAll(queryGenAggregation, cubeParamSet, columnInfo, "dimension");
                        updateCubeHie(queryGenAggregation, cubeParamSet, columnInfo);
                    }
                }
                
                //필터에 포함되어있는지 확인
                Parameter inCludeParam = isIncludeByParams(columnInfo,params);
                if(inCludeParam != null){
                    updateCubeWhere(queryGenAggregation, cubeParamSet, columnInfo, inCludeParam);
                }

            }
            
        } catch (Exception e) {

        }
        
        if (havingClauseInfo != null) {
            queryGenAggregation.setHavingClauseInfo(new ArrayList<>(havingClauseInfo));
        }

        return queryGenAggregation;
    }
    
    private void updateCubeWhere(QueryGenAggregation queryGenAggregation, CubeParamSet cubeParamSet,
            CubeTableColumn columnInfo, Parameter inCludeParam) {

            SelectCubeWhere cubeWhere = QueryGenAggregationUtil.makeCubeWhere(columnInfo,inCludeParam);

            if(cubeWhere != null){
                queryGenAggregation.addCubeWhere(cubeWhere);
            }
    }

    private void updateCubeRelation(QueryGenAggregation queryGenAggregation, CubeParamSet cubeParamSet) {

        List<Relation> cubeRelations = cubeParamSet.getCubeRelation();
        List<Relation> dsViewRelations = cubeParamSet.getDsViewRelation();

        for(Relation cubeRelation: cubeRelations){
            queryGenAggregation.addCubeRelation(cubeRelation);
        }
        
        for(Relation dsViewRelation: dsViewRelations){
            if(dsViewRelation.getJOIN_TYPE() == null) {
				dsViewRelation.setJOIN_TYPE("INNER JOIN");
			}
			queryGenAggregation.addDsViewRelation(dsViewRelation);
        }
    }

    private void updateCubeHie(QueryGenAggregation queryGenAggregation, CubeParamSet cubeParamSet,
                 CubeTableColumn columnInfo) {
                    
        Hierarchy cubeHie = QueryGenAggregationUtil.makeCubeHie(columnInfo);
        if(cubeHie != null){
            queryGenAggregation.addCubeHie(cubeHie);
        }

        Hierarchy cubeHieOrderBy = QueryGenAggregationUtil.makeCubeHieFromOrderBy(cubeParamSet,columnInfo);
        if(cubeHieOrderBy != null){
            queryGenAggregation.addCubeHie(cubeHieOrderBy);
        }
        
    }

    private void updateCubeSelectAll(QueryGenAggregation queryGenAggregation, CubeParamSet cubeParamSet, 
                    CubeTableColumn columnInfo, String dataTpye) {

        SelectCube selectCube= QueryGenAggregationUtil.makeCubeSelectAll(columnInfo,dataTpye);

        if(selectCube != null){
            queryGenAggregation.addSelectCube(selectCube);
        }

        if("dimension".equals(dataTpye)){
            selectCube = QueryGenAggregationUtil.makeCubeSelectAllFromOrderBy(cubeParamSet,columnInfo);
            if(selectCube != null){
                queryGenAggregation.addSelectCube(selectCube);
            }
        }
    }

    private void updateCubeSelectMeasure(QueryGenAggregation queryGenAggregation, CubeParamSet cubeParamSet,
            CubeTableColumn columnInfo, List<Measure> measures) {

        String summaryType = "Sum";
        for(Measure measure : measures){
            if (measure.getUniqueName().contains(columnInfo.getLogicalColumnName())) {
                summaryType = measure.getSummaryType().toString();
            }
        }
        
        SelectCubeMeasure selectCubeMeasure = QueryGenAggregationUtil.makeCubeSelectMeasures(summaryType, columnInfo, this.itemType);
        
        if(selectCubeMeasure != null){
            queryGenAggregation.addSelectCubeMeasure(selectCubeMeasure);
        }
    }

    private boolean isIncludeByDimensions(CubeTableColumn columnInfo, List<Dimension> dimensions) {
        boolean isIncludeByDimensions = false;

        if(columnInfo.getLogicalColumnName() != null){
            
            for(Dimension dimension : dimensions){

                if(dimension.getUniqueName() == null) continue;

                if(!dimension.getUniqueName().contains(columnInfo.getLogicalColumnName())) continue;
                
                if("dimension".equalsIgnoreCase(columnInfo.getColumnType())){
                    isIncludeByDimensions = true;
                    break;
                }else if("measure".equalsIgnoreCase(columnInfo.getColumnType())){
                    if(columnInfo.getAggregationType() == null
                        || 
                        columnInfo.getAggregationType().replaceAll(" ", "").equals("") 
                        || 
                        ItemType.DATA_GRID.toString().equals(itemType)
                    ){
                        isIncludeByDimensions = true;
                        break;
                    }else{
                        continue;
                    }
                }else{
                    continue;
                }
            }
        }

        return isIncludeByDimensions;
    }

    private boolean isIncludeByMeasures(CubeTableColumn columnInfo, List<Measure> measures) {
        boolean isIncludeByMeasures = false;

        if(columnInfo.getLogicalColumnName() != null){
            for(Measure measure : measures){
                if(measure.getUniqueName() == null) continue;
                if(!measure.getUniqueName().contains(columnInfo.getLogicalColumnName())) continue;
                // if(!columnInfo.getColumnType().equalsIgnoreCase("measure"))continue;

                isIncludeByMeasures = true;
            }
        }

        return isIncludeByMeasures;
    }

    private Parameter isIncludeByParams(CubeTableColumn columnInfo, List<Parameter> params) {

        Parameter inCludeParam = null;

        //key 값과 같은가? 설정된 Key/Name이 다른경우
        if(columnInfo.getLogicalColumnName() != null){
            for(Parameter param : params){
                if(param.getUniqueName() == null) continue;
                if(!param.getUniqueName().contains(columnInfo.getLogicalColumnName())) continue;
                inCludeParam = param;
            }
        }

        return inCludeParam;
    }

    // 추후 정렬 기능이 필요할 경우 ?
    private void updateCubeOrder(QueryGenAggregation queryGenAggregation, CubeParamSet cubeParamSet,
                 CubeTableColumn columnInfo, String dataTpye) {
        SelectCubeOrder cubeOrder = QueryGenAggregationUtil.makeCubeOrder(cubeParamSet,columnInfo);

        if (cubeOrder != null) {
            queryGenAggregation.addCubeOrder(cubeOrder);
        }
    }
    
    // 구성비 관련 커스터마이징 추후제거
    private void setSubqPartitionBy(CubeTableColumn columnInfo, List<Dimension> dimensions) {
        if(dimensions.size() > 0) {
            String tmpQ = "OVER(";
            boolean firstDim = true;
            for(Dimension dimension : dimensions){
                if("column".equalsIgnoreCase(dimension.getCategory())){
                    if(firstDim) {
                        firstDim = false;
                        tmpQ = tmpQ+"PARTITION BY " + " \""+ dimension.getCaption()+"\"";
                    } else {
                        tmpQ = tmpQ + " ,\""+ dimension.getCaption()+"\"";
                    }
                }
            }
            tmpQ = tmpQ + ")";
            String expressionQuery = columnInfo.getExpression().toUpperCase();

            expressionQuery = expressionQuery.replaceAll("OVER\\(\\)", tmpQ);

            columnInfo.setExpression(expressionQuery);

        }
    }
}

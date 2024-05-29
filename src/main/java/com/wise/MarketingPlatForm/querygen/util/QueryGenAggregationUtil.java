package com.wise.MarketingPlatForm.querygen.util;

import java.util.List;

import com.wise.MarketingPlatForm.dataset.vo.CubeTableColumn;
import com.wise.MarketingPlatForm.querygen.dto.Hierarchy;
import com.wise.MarketingPlatForm.querygen.dto.SelectCube;
import com.wise.MarketingPlatForm.querygen.dto.SelectCubeMeasure;
import com.wise.MarketingPlatForm.querygen.dto.SelectCubeOrder;
import com.wise.MarketingPlatForm.querygen.dto.SelectCubeWhere;
import com.wise.MarketingPlatForm.querygen.model.CubeParamSet;
import com.wise.MarketingPlatForm.report.domain.data.data.Parameter;

public class QueryGenAggregationUtil {

    public static SelectCube makeCubeSelectAll(CubeTableColumn columnInfo, String dataTpye) {

        SelectCube selCube = new SelectCube();

        switch (dataTpye) {
            case "dimension" :
                selCube.setUNI_NM(columnInfo.getLogicalColumnName());
                selCube.setCAPTION(columnInfo.getColumnCaption());
                selCube.setDATA_TYPE(columnInfo.getDataType());
                //selCube.setORDER(Integer.toString(index));
                selCube.setTYPE("DIM");
                break;
             case "measure" :
                selCube.setUNI_NM(columnInfo.getLogicalColumnName());
                selCube.setCAPTION(columnInfo.getColumnCaption());
                selCube.setDATA_TYPE(columnInfo.getDataType());
                //selCube.setORDER(Integer.toString(index));
                selCube.setTYPE("MEA");
                break;
            default:
                selCube = null;
                break;
        }

        return selCube;
    }

    public static SelectCube makeCubeSelectAllFromOrderBy(CubeParamSet cubeParamSet, CubeTableColumn columnInfo) {

        List<CubeTableColumn> columnInfoList = cubeParamSet.getColumnInfoList();
        SelectCube selCube = new SelectCube();

        if(!columnInfo.getOrderBy().trim().equalsIgnoreCase("Name Column")
                    && !columnInfo.getOrderBy().trim().equalsIgnoreCase("")){

            for(CubeTableColumn orderColumn : columnInfoList) {
                if(columnInfo.getOrderBy().trim().equals(orderColumn.getPhysicalColumnName().trim())
                    && columnInfo.getLogicalTableName().equalsIgnoreCase(orderColumn.getLogicalTableName()))
                {
                    selCube.setUNI_NM(orderColumn.getLogicalColumnName());
                    // selCube.setCAPTION(orderColumn.getPhysicalTableName()+"_"+orderColumn.getPhysicalColumnKey());
                    selCube.setCAPTION(orderColumn.getColumnCaption());
                    selCube.setDATA_TYPE(orderColumn.getDataType());
                    selCube.setTYPE("DIM");
                    break;
                }  else {
                    selCube = null;
                }
            }

        }

        return selCube;
    }

    public static SelectCubeMeasure makeCubeSelectMeasures(String summaryType, CubeTableColumn columnInfo, String itemType) {

        SelectCubeMeasure selectCubeMeasure = new SelectCubeMeasure();

        selectCubeMeasure.setMEA_GRP_UNI_NM(columnInfo.getLogicalTableName());
        selectCubeMeasure.setMEA_UNI_NM(columnInfo.getLogicalColumnName());
        selectCubeMeasure.setMEA_CAPTION(columnInfo.getColumnCaption());
        selectCubeMeasure.setMEA_TBL_NM(columnInfo.getPhysicalTableName());
        selectCubeMeasure.setMEA_COL_NM(columnInfo.getPhysicalColumnKey());
        if("HISTOGRAM_CHART".equals(itemType) || "BOX_PLOT".equals(itemType)) {
            selectCubeMeasure.setMEA_AGG("Round");
        }else {
            if (!"".equalsIgnoreCase(summaryType)) {
                switch (summaryType) {
                    case "COUNTDISTINCT":
                        selectCubeMeasure.setMEA_AGG("Distinct Count");
                        break;
                    default:
                        selectCubeMeasure.setMEA_AGG(summaryType);
                        break;
                }
                
            } else {
                if(columnInfo.getAggregationType() == null) {
                    selectCubeMeasure.setMEA_AGG("");
                }else {
                    selectCubeMeasure.setMEA_AGG(columnInfo.getAggregationType());
                }
            }
        }

        selectCubeMeasure.setCOL_EXPRESS(columnInfo.getExpression());

        return selectCubeMeasure;
    }

    public static Hierarchy makeCubeHie(CubeTableColumn columnInfo) {

        Hierarchy selHie = new Hierarchy();

        selHie.setDIM_UNI_NM(columnInfo.getLogicalTableName());
        selHie.setHIE_UNI_NM(columnInfo.getLogicalColumnName());
        selHie.setHIE_CAPTION(columnInfo.getColumnCaption());
        selHie.setTBL_NM(columnInfo.getPhysicalTableName().trim());
        selHie.setCOL_NM(columnInfo.getPhysicalColumnName().trim());
        selHie.setCOL_EXPRESS(columnInfo.getExpression());

        if(selHie.getCOL_NM().equals(""))
            selHie.setCOL_NM(columnInfo.getPhysicalColumnKey());

        return selHie;
    }

    private static Hierarchy getCubeHieFromColumList(CubeParamSet cubeParamSet, CubeTableColumn columnInfo) {

        List<CubeTableColumn> columnInfoList = cubeParamSet.getColumnInfoList();
        Hierarchy selHie = new Hierarchy();

        for(CubeTableColumn orderColumn : columnInfoList) {
            if(columnInfo.getOrderBy().trim().equals(orderColumn.getPhysicalColumnName().trim())
                && columnInfo.getLogicalTableName().equalsIgnoreCase(orderColumn.getLogicalTableName()))
            {
                selHie = new Hierarchy();
                selHie.setDIM_UNI_NM(orderColumn.getLogicalTableName());
                selHie.setHIE_UNI_NM(orderColumn.getLogicalColumnName());
                selHie.setHIE_CAPTION(orderColumn.getColumnCaption());
                selHie.setTBL_NM(orderColumn.getPhysicalTableName());
                selHie.setCOL_NM(orderColumn.getPhysicalColumnKey());
                selHie.setCOL_EXPRESS(orderColumn.getExpression());
                break;
            } else {
                selHie = null;
            }
        }

        return selHie;
    }

    public static Hierarchy makeCubeHieFromOrderBy(CubeParamSet cubeParamSet, CubeTableColumn columnInfo) {

        Hierarchy selHie = new Hierarchy();

        if(columnInfo.getOrderBy().trim().equalsIgnoreCase("Key Column")){

            if(!columnInfo.getPhysicalColumnName().contains(columnInfo.getPhysicalColumnKey()))
            {
                selHie.setDIM_UNI_NM(columnInfo.getLogicalTableName());
                selHie.setHIE_UNI_NM(columnInfo.getLogicalColumnName());
                selHie.setHIE_CAPTION(columnInfo.getColumnCaption());
                selHie.setTBL_NM(columnInfo.getPhysicalTableName());
                selHie.setCOL_NM(columnInfo.getPhysicalColumnKey());
                selHie.setCOL_EXPRESS(columnInfo.getExpression());
            } else {
                selHie = null;
            }
            
        }else if(!columnInfo.getOrderBy().trim().equalsIgnoreCase("Name Column")
                    && !columnInfo.getOrderBy().trim().equalsIgnoreCase("")){

            selHie = getCubeHieFromColumList(cubeParamSet,columnInfo);

        }else{
            selHie = null;
        }

        return selHie;
    }

    public static SelectCubeWhere makeCubeWhere(CubeTableColumn columnInfo, Parameter inCludeParam) {

        SelectCubeWhere whereCube = new SelectCubeWhere();

        whereCube.setPARENT_UNI_NM(columnInfo.getLogicalTableName());

        whereCube.setUNI_NM(inCludeParam.getUniqueName());

        whereCube.setCAPTION(inCludeParam.getCaption());
        whereCube.setOPER(inCludeParam.getParamType());
        whereCube.setOPERATION(inCludeParam.getOperation());

        String paramValueString = "";
        for (String filterValue: inCludeParam.getValues()) {

            String[] valueList = filterValue.split(",");
            for (String value : valueList) {
                if("".equals(paramValueString)){
                    paramValueString = value;
                }else{
                    paramValueString += ","+value.trim();
                }
            }

        }
        if("".equals(paramValueString)){
            paramValueString = "[All]";
        }

        whereCube.setVALUES(paramValueString);
        whereCube.setVALUES_CAPTION("");
        whereCube.setAGG("");
        whereCube.setDATA_TYPE(columnInfo.getDataType());
        whereCube.setPARAM_YN("False");
        whereCube.setPARAM_NM("");
        whereCube.setTYPE(columnInfo.getColumnType().equalsIgnoreCase("dimension") ? "DIM":"MEA");
        whereCube.setORDER("0");
        whereCube.setTBL_NM(columnInfo.getPhysicalTableName());

        if (inCludeParam.getItemKey() != null && !"".equals(inCludeParam.getItemKey())) {
            whereCube.setCOL_NM(inCludeParam.getItemKey());
        } else {
            whereCube.setCOL_NM(columnInfo.getPhysicalColumnKey());
        }

        whereCube.setLOGIC("");
        whereCube.setCOL_EXPRESS("");
        if(columnInfo.getExpression() != null){
            whereCube.setCOL_EXPRESS(columnInfo.getExpression());
        }
        whereCube.setWHERE_CLAUSE(inCludeParam.getExceptionValue());
        whereCube.setCOND_ID("");

        return whereCube;
    }

    public static SelectCubeOrder makeCubeOrder(CubeParamSet cubeParamSet, CubeTableColumn columnInfo) {

        SelectCubeOrder selectCubeOrder = new SelectCubeOrder();

        return selectCubeOrder;
    }

}

package com.wise.MarketingPlatForm.querygen.util;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.wise.MarketingPlatForm.auth.vo.AuthMemVO;
import com.wise.MarketingPlatForm.querygen.dto.Relation;
import com.wise.MarketingPlatForm.querygen.model.CubeParamSet;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.Parameter;

public class CubeParamSetUtil {

    
    public CubeParamSetUtil(){
        
    }

    public static void makeParamFromAuthData(CubeParamSet cubeParamSet, ArrayList<String> meaGrp) {

        List<Relation> cubeRelations = cubeParamSet.getCubeRelation();
        List<String> nonRelationList = new ArrayList<String>();
        
        List<String> columnList = cubeParamSet.getColumnList();
        List<String> measureList = cubeParamSet.getMeasureList();
        List<String> dataAuthUniqueNmList = cubeParamSet.getDataAuthUniqueNmList();
        List<AuthMemVO> authMembers = cubeParamSet.getAuthMembers();

        Iterator<AuthMemVO> authMemberIt = authMembers.iterator();

        while (authMemberIt.hasNext()) {
            AuthMemVO authMember = authMemberIt.next();
            String memString = authMember.getDimUniNm();
            if(!nonRelationList.contains(memString)) {
                int relCheck = 0;
                for(Relation cubeRelation : cubeRelations) {
                    if(meaGrp.contains(cubeRelation.getMEA_GRP_UNI_NM())) {
                        if(cubeRelation.getDIM_UNI_NM().equals(memString)) {
                            relCheck++;
                        }
                    }
                }
                if(relCheck != meaGrp.size()) {
                    authMemberIt.remove();
                    continue;
                }
                if(!columnList.contains(memString)) {
                    columnList.add(memString);
                }
                String memStringReple = memString.replaceAll("\\[", "").replaceAll("\\]", ""); //.replaceAll("[0-9]", "");
                
                if(!measureList.contains(memStringReple)) {
                    measureList.add(memStringReple);
                }
                String uid = authMember.getHieUniNm();
                if(!dataAuthUniqueNmList.contains(uid)) {
                    dataAuthUniqueNmList.add(uid);
                }
            }else {
                authMemberIt.remove();
            }

        }

        cubeParamSet.setAuthMembers(authMembers);
        cubeParamSet.setDataAuthUniqueNmList(dataAuthUniqueNmList);
        cubeParamSet.setColumnList(columnList);
        cubeParamSet.setMeasureList(columnList);

    }

    public static void makeCubeDataFieldList(CubeParamSet cubeParamSet) {
        DataAggregation dataAggregation= cubeParamSet.getDataAggreagtion();

        List<Dimension> dimensions = dataAggregation.getDimensions();
        List<Measure> measures = new ArrayList<> ();
        List<Parameter> params = dataAggregation.getParameters();
        measures.addAll(dataAggregation.getMeasures());
        measures.addAll(dataAggregation.getSortByItems());

        List<String> columnList = cubeParamSet.getColumnList();
        List<String> measureList = cubeParamSet.getMeasureList();

        for (Dimension dimension: dimensions) {
        	if(dimension.getUniqueName() != null) {
        		String dimString = dimension.getUniqueName();
        		dimString = dimString.split("\\.")[0];
        		String dimStringReple = dimString.replaceAll("\\[", "").replaceAll("\\]", "");
                //.replaceAll("[0-9]", "");
        		if(!measureList.contains(dimStringReple)) {
        			measureList.add(dimStringReple);
        		}

        		if(!columnList.contains(dimString)) {
        			columnList.add(dimString);
        		}
        	}
        }

        for (Measure measure : measures) {
        	if(measure.getUniqueName() != null) {
        		String meaString = measure.getUniqueName();
        		meaString = meaString.split("\\.")[0];
        		String meaStringReple = meaString.replaceAll("\\[", "").replaceAll("\\]", "");
                //.replaceAll("[0-9]", "");
        		if(!measureList.contains(meaStringReple)) {
        			measureList.add(meaStringReple);
        		}

        		if(!columnList.contains(meaString)) {
        			columnList.add(meaString);
        		}
        	}
        }

        for (Parameter param : params) {
        	String paramString = null;
        	String paramStringReple = null;
        	if(param.getUniqueName() != null) {
        		paramString = param.getUniqueName();
        		paramString = paramString.split("\\.")[0];
        		paramStringReple = paramString.replaceAll("\\[", "").replaceAll("\\]", "");
                //.replaceAll("[0-9]", "");
            	if(!measureList.contains(paramStringReple)) {
            		measureList.add(paramStringReple);
            	}

            	if(!columnList.contains(paramString)) {
            		columnList.add(paramString);
            	}
        	}
        }

        cubeParamSet.setColumnList(columnList);
        cubeParamSet.setMeasureList(measureList);
    }


}

package com.wise.MarketingPlatForm.querygen.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wise.MarketingPlatForm.auth.service.AuthService;
import com.wise.MarketingPlatForm.auth.vo.AuthDataDTO;
import com.wise.MarketingPlatForm.auth.vo.AuthMemVO;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.dataset.service.CubeService;
import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.vo.CubeTableColumn;
import com.wise.MarketingPlatForm.global.context.BeanContext;
import com.wise.MarketingPlatForm.querygen.aggregator.QueryGenAggregator;
import com.wise.MarketingPlatForm.querygen.dao.QuerygenDAO;
import com.wise.MarketingPlatForm.querygen.dto.Relation;
import com.wise.MarketingPlatForm.querygen.model.CubeParamSet;
import com.wise.MarketingPlatForm.querygen.model.QueryGenAggregation;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Parameter;
import com.wise.MarketingPlatForm.report.domain.item.pivot.util.ParamUtils;
import com.wise.MarketingPlatForm.querygen.util.CubeParamSetUtil;

import lombok.extern.slf4j.Slf4j;

@Service("queryGenService")
public class QueryGenService {
    
    private final QuerygenDAO querygenDAO;
    private final DatasetService datasetService;
    private final CubeService cubeService;
    private final AuthService authService;

    private final QueryGenAggregator queryGenAggregator;

    QueryGenService(QuerygenDAO querygenDAO, DatasetService datasetService, CubeService cubeService, AuthService authService,
                    QueryGenAggregator queryGenAggregator) {
        this.querygenDAO = querygenDAO;
        this.datasetService = datasetService;
        this.cubeService = cubeService;
        this.authService = authService;
        this.queryGenAggregator = queryGenAggregator;
    }

    @Transactional
    public String createCubeQuery(DataAggregation dataAggreagtion) {

        QuerySettingEx sqlQenQuery = new QuerySettingEx();
        String cubeQueryString = null;
        try{
            CubeParamSet cubeParamSet = new CubeParamSet(dataAggreagtion);

            updateCubeRelation(cubeParamSet);

            updateAuthData(cubeParamSet);

            CubeParamSetUtil.makeCubeDataFieldList(cubeParamSet);

            updateColumnInfoList(cubeParamSet);

            updateDsViewRelation(cubeParamSet);

            QueryGenAggregation queygenAggregation; 

            queygenAggregation =  queryGenAggregator.createQueryGenAggregation(cubeParamSet);

            
            cubeQueryString = sqlQenQuery.CubeQuerySetting(queygenAggregation);

        }catch(Exception E){
            System.out.println(E);
        }
        System.out.println("##################################");
        System.out.println("주제영역 쿼리 : " + cubeQueryString);
        System.out.println("##################################");

        return cubeQueryString;
    }

    @Transactional
    private void updateDsViewRelation(CubeParamSet cubeParamSet) {
        DataAggregation dataAggregation= cubeParamSet.getDataAggreagtion();
        List<String> measureList = cubeParamSet.getMeasureList();

        Map<String, Object> viewRelParam = new HashMap<String, Object>();
        viewRelParam.put("cubeId", dataAggregation.getDataset().getCubeId());
        viewRelParam.put("measures", measureList);

        List<Relation> dsViewRelation = querygenDAO.selectDsViewRelation(viewRelParam);

        cubeParamSet.setDsViewRelation(dsViewRelation);
    }

    @Transactional
    private void updateColumnInfoList(CubeParamSet cubeParamSet) {
        DataAggregation dataAggregation= cubeParamSet.getDataAggreagtion();

        List<String> columnList = cubeParamSet.getColumnList();
   
        Map<String, Object> colInfoParam = new HashMap<String, Object>();
        colInfoParam.put("cubeId", dataAggregation.getDataset().getCubeId());
        colInfoParam.put("columns", columnList);
   
        List<CubeTableColumn> columnInfoList = querygenDAO.selectColumnInfomationList(colInfoParam);

        cubeParamSet.setColumnInfoList(columnInfoList);
    }

    @Transactional
    private void updateCubeRelation(CubeParamSet cubeParamSet) {
        int cubeId = cubeParamSet.getDataAggreagtion().getDataset().getCubeId();

        List<Relation> cubeRelation = querygenDAO.selectCubeRelation(cubeId);

        cubeParamSet.setCubeRelation(cubeRelation);
    }

    @Transactional
    private void updateAuthData(CubeParamSet cubeParamSet) {
        
        AuthDataDTO authData = authService.getAuthData(cubeParamSet.getDataAggreagtion().getUserId());

        List<AuthMemVO> authMembers = authData.getAuthMem();
        
        cubeParamSet.setAuthMembers(authMembers);

        List<Measure>  measures =  cubeParamSet.getDataAggreagtion().getMeasures();
        ArrayList<String> meaGrp = new ArrayList<String>();
        //현재 사용중인 측정값 그룹
        for(Measure measure: measures){
            String meaGrpNm = measure.getUniqueName().split("\\.")[0];
        	if(!meaGrp.contains(meaGrpNm))
        		meaGrp.add(meaGrpNm);
        }

        CubeParamSetUtil.makeParamFromAuthData(cubeParamSet,meaGrp);

    } 
}

package com.wise.MarketingPlatForm.querygen.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wise.MarketingPlatForm.auth.service.AuthService;
import com.wise.MarketingPlatForm.auth.vo.AuthDataDTO;
import com.wise.MarketingPlatForm.auth.vo.AuthMemVO;
import com.wise.MarketingPlatForm.dataset.service.CubeService;
import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.vo.CubeTableColumn;
import com.wise.MarketingPlatForm.querygen.aggregator.QueryGenAggregator;
import com.wise.MarketingPlatForm.querygen.dao.QuerygenDAO;
import com.wise.MarketingPlatForm.querygen.dto.Relation;
import com.wise.MarketingPlatForm.querygen.model.CubeParamSet;
import com.wise.MarketingPlatForm.querygen.model.QueryGenAggregation;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;

import lombok.extern.slf4j.Slf4j;

import com.wise.MarketingPlatForm.querygen.util.CubeParamSetUtil;


@Service("queryGenService")
@Slf4j
public class QueryGenService {
    
    private final QuerygenDAO querygenDAO;
    private final AuthService authService;
    private final QueryGenAggregator queryGenAggregator;

    QueryGenService(QuerygenDAO querygenDAO, AuthService authService, QueryGenAggregator queryGenAggregator) {
        this.querygenDAO = querygenDAO;
        this.authService = authService;
        this.queryGenAggregator = queryGenAggregator;
    }

    @Transactional
    public String createCubeParamSet(DataAggregation dataAggreagtion) {
        // 주제 영역 쿼리 생성을 위한 Param 사전 준비 작업
        QuerySettingEx sqlQenQuery = new QuerySettingEx();
        String cubeQueryString = null;
        try{
            //
            CubeParamSet cubeParamSet = new CubeParamSet(dataAggreagtion);

            //주제영역 관계 조회
            updateCubeRelation(cubeParamSet);

            //유저 차원 설정 조회
            updateAuthData(cubeParamSet);

            //주제영역 컬럼을 가져오기 위한 작업
            CubeParamSetUtil.makeCubeDataFieldList(cubeParamSet);

            //주제영역 컬럼 조회
            updateColumnInfoList(cubeParamSet);

            //데이터 원본뷰 관계 조회
            updateDsViewRelation(cubeParamSet);

            //QueryGen 에서 필요한 변수 집합 및 집합 생성 부분
            QueryGenAggregation queygenAggregation; 
            queygenAggregation =  queryGenAggregator.createQueryGenAggregation(cubeParamSet);

            
            cubeQueryString = sqlQenQuery.CubeQuerySetting(queygenAggregation);

        }catch(Exception E){
            System.out.println(E);
        }

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

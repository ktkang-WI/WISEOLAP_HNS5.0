package com.wise.MarketingPlatForm.querygen.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.auth.service.AuthService;
import com.wise.MarketingPlatForm.auth.vo.AuthDataDTO;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.dataset.service.CubeService;
import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.vo.CubeTableColumn;
import com.wise.MarketingPlatForm.querygen.dao.QuerygenDAO;
import com.wise.MarketingPlatForm.querygen.dto.Relation;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Parameter;

import lombok.extern.slf4j.Slf4j;

@Service("queryGenService")
public class QueryGenService {
    
    private final QuerygenDAO querygenDAO;
    private final DatasetService datasetService;
    private final CubeService cubeService;
    private final AuthService authService;

    @Autowired
    QueryGenService(QuerygenDAO querygenDAO, DatasetService datasetService, CubeService cubeService, AuthService authService) {
        this.querygenDAO = querygenDAO;
        this.datasetService = datasetService;
        this.cubeService = cubeService;
        this.authService = authService;
    }

    public String createCubeQuery(DataAggregation dataAggreagtion) {

        List<Dimension> dimensions = dataAggreagtion.getDimensions();
		
        List<Measure> measures = dataAggreagtion.getMeasures();
		
        List<Parameter> parameters = dataAggreagtion.getParameters();

        int cubeId = dataAggreagtion.getDataset().getCubeId();

        List<Relation> cubeRelation = querygenDAO.selectCubeRelation(cubeId);

        //List<DataAuthentication> userGroupDataAuthentications;

        UserDTO user = authService.getUserByIdForAuth(dataAggreagtion.getUserId());
        
        AuthDataDTO authData = authService.getAuthData(dataAggreagtion.getUserId());

		List<CubeTableColumn> columnInfoList = getColumnInfoList(dataAggreagtion);
		//List<Object> cubeRelation = 
		//List<Object> dsViewRelation = 


        return null;
    }

    private List<CubeTableColumn> getColumnInfoList(DataAggregation dataAggreagtion) {

        Map<String, Object> colInfoParam = new HashMap<String, Object>();
        List<String> colList = new ArrayList<String>();
        int cubeId = dataAggreagtion.getDataset().getCubeId();


        colInfoParam.put("cubeId", cubeId);

        colInfoParam.put("columns", colList);

        return null;
    }

    
    
}

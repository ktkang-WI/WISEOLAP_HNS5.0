package com.wise.MarketingPlatForm.dataset.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.auth.service.AuthService;
import com.wise.MarketingPlatForm.auth.vo.AuthDataDTO;
import com.wise.MarketingPlatForm.dataset.dao.CubeDAO;
import com.wise.MarketingPlatForm.dataset.domain.cube.entity.CubeDimColEntity;
import com.wise.MarketingPlatForm.dataset.domain.cube.entity.CubeMeaColEntity;
import com.wise.MarketingPlatForm.dataset.domain.cube.entity.CubeTblEntity;
import com.wise.MarketingPlatForm.dataset.domain.cube.entity.CubeActMstrEntity;
import com.wise.MarketingPlatForm.dataset.domain.cube.entity.CubeMstrEntity;
import com.wise.MarketingPlatForm.dataset.domain.cube.vo.CubeInfoDTO;
import com.wise.MarketingPlatForm.dataset.domain.cube.vo.CubeMstrDTO;
import com.wise.MarketingPlatForm.dataset.domain.cube.vo.DetailedDataVO;
import com.wise.MarketingPlatForm.dataset.type.DataFieldType;
import com.wise.MarketingPlatForm.dataset.vo.CubeFieldVO;
import com.wise.MarketingPlatForm.dataset.vo.RootFieldVO;
import com.wise.MarketingPlatForm.dataset.vo.CubeTableColumn;

@Service
public class CubeService {
    private final CubeDAO cubeDAO;
    private final AuthService authService;

    CubeService(CubeDAO cubeDAO, AuthService authService) {
        this.cubeDAO = cubeDAO;
        this.authService = authService;
    }

    public List<CubeMstrEntity> getCubes() {

        List<CubeMstrEntity> cubeMstrEntity = cubeDAO.selectDatasetDsCube();

        if (cubeMstrEntity == null)
            return null;

        return cubeMstrEntity;
    };

    public List<CubeMstrDTO> getCubes(String dsViewId, String userId) {
        List<CubeMstrEntity> entities;

        if (!dsViewId.equals("")) {
            entities = cubeDAO.selectCubeListByDsViewId(dsViewId);
        } else {
            entities = cubeDAO.selectCubeList();
        }

        AuthDataDTO auth = authService.getAuthData(userId);

        List<CubeMstrDTO> result = new ArrayList<>();

        for (CubeMstrEntity entity : entities) {
            if (auth.hasAuthCube(entity.getDsViewId(), entity.getCubeId())) {
                result.add(CubeMstrDTO.builder()
                        .cubeId(entity.getCubeId())
                        .cubeNm(entity.getCubeNm())
                        .cubeDesc(entity.getCubeDesc())
                        .dsViewId(entity.getDsViewId())
                        .ordinal(entity.getOrdinal())
                        .build());
            }
        }

        return result;
    }

    private boolean isMakedFolder(List<CubeFieldVO> tempFolder, CubeMeaColEntity entity) {
        if (tempFolder.size() == 0 && entity.getFolder() != null) return false;
        boolean result = true;
        // 같은 테이블 내에 같은 표시폴더가 있으면 생성하지 않게 함.(true: 폴더 생성x)
        for (CubeFieldVO folder : tempFolder) {
            if (folder.getFolder().equals(entity.getFolder()) && folder.getParentId().equals(entity.getTableName())) {
                result = true;
                break;
            } else {
                result = false;
            }
        }
        return result;
    }

    public CubeInfoDTO getCube(String cubeId, String userId) {
        AuthDataDTO auth = authService.getAuthData(userId);
        List<RootFieldVO> fields = new ArrayList<RootFieldVO>();
        List<CubeFieldVO> tempFolder = new ArrayList<CubeFieldVO>();
        List<DetailedDataVO> detailedData = new ArrayList<>();
        CubeInfoDTO cubeInfo = new CubeInfoDTO();

        // 측정값 그룹 불러오기
        List<CubeTblEntity> cubeMeaTblEntities = cubeDAO.selectCubeMeaTables(cubeId);
        for (CubeTblEntity entity : cubeMeaTblEntities) {
            if (!entity.isVisible()) continue;
            fields.add(CubeFieldVO.builder()
                    .type(DataFieldType.MEAGRP)
                    .order(entity.getOrder())
                    .visible(entity.isVisible())
                    .uniqueName(entity.getUniqueName())
                    .logicalName(entity.getLogicalName())
                    .physicalName(entity.getPhysicalName())
                    .name(entity.getLogicalName())
                    .build());
        }

        // 측정값 컬럼 불러오기
        List<CubeMeaColEntity> cubeMeaColEntities = cubeDAO.selectCubeMeaColumns(cubeId);
        
        for (CubeMeaColEntity entity : cubeMeaColEntities) {
            if (!entity.isVisible()) continue;
            // 권한 있는 차원의 컬럼만 추가
            fields.add(CubeFieldVO.builder()
                    .type(DataFieldType.MEA)
                    .visible(entity.isVisible())
                    .order(entity.getMeaOrder())
                    .name(entity.getCaptionName())
                    .parentId(entity.getFolder() != null ? entity.getTableName() + ".[" + entity.getFolder() + "]" : entity.getTableName())
                    .dataType(entity.getDataType())
                    .uniqueName(entity.getUniqueName())
                    .description(entity.getDescription())
                    .summaryType(entity.getSummaryType())
                    .folder(entity.getFolder())
                    .build());

            // 표시 폴더 존재 여부 및 폴더가 중복 추가 되지 않게 방지.
            if (entity.getFolder() == null || isMakedFolder(tempFolder, entity)) continue;
            // 표시 폴더가 있는 객체를 기반으로 폴더 정보 추가.
            tempFolder.add(CubeFieldVO.builder()
                .type(DataFieldType.MEAFLD)
                .visible(entity.isVisible())
                .name(entity.getFolder())
                .parentId(entity.getTableName())
                .uniqueName(entity.getTableName() + ".[" + entity.getFolder() + "]")
                .folder(entity.getFolder())
                .build());
        }
        if (tempFolder.size() != 0) {
            for (CubeFieldVO folder : tempFolder) {
                fields.add(0, folder);
            }
        }

        // 차원 컬럼 불러오기 - 권한 적용
        List<CubeDimColEntity> cubeDimColEntities = cubeDAO.selectCubeDimColumns(cubeId);
        List<CubeTblEntity> cubeDimTblEntities = cubeDAO.selectCubeDimTables(cubeId);
        Set<String> authDimNames = new HashSet<>();

        for (CubeDimColEntity entity : cubeDimColEntities) {
            if (!entity.isVisible()) continue;
            // 권한 있는 차원의 컬럼만 추가
            // if (auth.hasAuthDim(cubeDimTblEntities.get(0).getDsViewId(), entity.getUniqueName())) {
            if (auth.hasAuthDim(cubeDimTblEntities.get(0).getDsViewId(), entity.getTableName())) {
                authDimNames.add(entity.getTableName());
                fields.add(CubeFieldVO.builder()
                        .type(DataFieldType.DIM)
                        .order(entity.getOrder())
                        .name(entity.getCaptionName())
                        .parentId(entity.getTableName())
                        .dataType(entity.getDataType())
                        .orderBy(entity.getOrderBy())
                        .visible(entity.isVisible())
                        .uniqueName(entity.getUniqueName())
                        .description(entity.getDescription())
                        .build());
            } else {
                fields.add(CubeFieldVO.builder()
                        .type(DataFieldType.DIM)
                        .order(entity.getOrder())
                        .name(entity.getCaptionName())
                        .parentId(entity.getTableName())
                        .dataType(entity.getDataType())
                        .orderBy(entity.getOrderBy())
                        .visible(false)
                        .uniqueName(entity.getUniqueName())
                        .description(entity.getDescription())
                        .build());
            }
        }

        for (CubeTblEntity entity : cubeDimTblEntities) {
            if (!entity.isVisible()) continue;
            if (authDimNames.contains(entity.getPhysicalName())) {
                fields.add(CubeFieldVO.builder()
                .type(DataFieldType.DIMGRP)
                .order(entity.getOrder())
                .visible(entity.isVisible())
                .uniqueName(entity.getUniqueName())
                .logicalName(entity.getLogicalName())
                .physicalName(entity.getPhysicalName())
                .name(entity.getLogicalName())
                .build());
            } else {
                fields.add(CubeFieldVO.builder()
                .type(DataFieldType.DIMGRP)
                .order(entity.getOrder())
                .visible(false)
                .uniqueName(entity.getUniqueName())
                .logicalName(entity.getLogicalName())
                .physicalName(entity.getPhysicalName())
                .name(entity.getLogicalName())
                .build());
            }
        }

        // 상세데이터 불러오기
        List<CubeActMstrEntity> detailedDataEntities = cubeDAO.selectDetailedData(cubeId);

        for (CubeActMstrEntity entity : detailedDataEntities) {
            detailedData.add(DetailedDataVO.builder()
                    .actId(entity.getActId())
                    .actNm(entity.getActNm())
                    .cubeId(entity.getCubeId())
                    .targetTable(entity.getMeaGrpUniNm())
                    .build());
        }

        cubeInfo.setFields(fields);
        cubeInfo.setDetailedData(detailedData);

        return cubeInfo;
    }

    public List<RootFieldVO> getCubeFields() {
        return null;
    }

    public CubeTableColumn getCubeColumInformation(String cubeId, String userId, String uniqueName) {

        Map<String, String> param = new HashMap<String, String>();

        param.put("cubeId", cubeId);
        param.put("uniqueName", uniqueName);

        CubeTableColumn cubeTableColumn = cubeDAO.selectCubeColumnInfomationList(param);
        return cubeTableColumn;
    }
}

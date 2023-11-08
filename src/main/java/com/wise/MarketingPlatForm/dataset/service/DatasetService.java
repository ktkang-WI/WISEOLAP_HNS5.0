package com.wise.MarketingPlatForm.dataset.service;

import java.util.ArrayList;
import java.util.List;
import java.sql.SQLException;
import java.sql.Types;
import org.springframework.stereotype.Service;
import com.wise.MarketingPlatForm.dataset.dao.DatasetDAO;
import com.wise.MarketingPlatForm.dataset.entity.DsMstrEntity;
import com.wise.MarketingPlatForm.dataset.entity.DsViewEntity;
import com.wise.MarketingPlatForm.dataset.type.DataFieldType;
import com.wise.MarketingPlatForm.dataset.type.DbmsType;
import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.dataset.vo.DbColumnVO;
import com.wise.MarketingPlatForm.dataset.vo.DbTableVO;
import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.dataset.vo.DsViewDTO;
import com.wise.MarketingPlatForm.global.config.MartConfig;
import com.wise.MarketingPlatForm.mart.dao.MartDAO;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;
import com.wise.MarketingPlatForm.mart.vo.MetaDTO;
import com.wise.MarketingPlatForm.dataset.vo.DatasetFieldVO;

@Service
public class DatasetService {

  private final DatasetDAO datasetDAO;
  private final MartConfig martConfig;
  private final MartDAO martDAO;

  DatasetService(DatasetDAO datasetDAO, MartConfig martConfig, MartDAO martDAO) {
    this.datasetDAO = datasetDAO;
    this.martConfig = martConfig;
    this.martDAO = martDAO;
  }

  public List<DsMstrDTO> getDataSources(String userId) {
    List<DsMstrEntity> entities = datasetDAO.selectUserAuthDsList(userId);

    if (entities.isEmpty()) {
      entities = datasetDAO.selectGrpAuthDsList(userId);
    }

    List<DsMstrDTO> result = new ArrayList<>();

    for (DsMstrEntity entity : entities) {
      result.add(DsMstrDTO.builder()
        .dsId(entity.getDsId())
        .dsNm(entity.getDsNm())
        .ip(entity.getIp())
        .port(entity.getPort())
        .dbNm(entity.getDbNm())
        .ownerNm(entity.getOwnerNm())
        .userId(entity.getUserId())
        .userAreaYn(entity.getUserAreaYn())
        .dsDesc(entity.getDsDesc())
        .dbmsType(DbmsType.fromString(entity.getDbmsType()).get())
        .build());
    }

    return result;
  }

  public DsMstrDTO getDataSource(int dsId) {
    DsMstrEntity entity = datasetDAO.selectDataSource(dsId);

    return DsMstrDTO.builder()
        .dsId(entity.getDsId())
        .dsNm(entity.getDsNm())
        .ip(entity.getIp())
        .port(entity.getPort())
        .dbNm(entity.getDbNm())
        .password(entity.getPassword())
        .ownerNm(entity.getOwnerNm())
        .userId(entity.getUserId())
        .userAreaYn(entity.getUserAreaYn())
        .dsDesc(entity.getDsDesc())
        .connector(entity.getConnector())
        .connectorType(entity.getConnectorType())
        .dbmsType(DbmsType.fromString(entity.getDbmsType()).get())
        .build();
  }

  public List<DbTableVO> getDBTables(String dsId, String search) {
    return null;
  }

  public List<DbColumnVO> getDBColumns(String dsId, String table, String search) {
    return null;
  }

  // TODO: 추후 필터 정보도 받아와야 함.
  public List<DatasetFieldVO> getDatasetFields(String dsId, DsType dsType, String query) {
    return null;
  }

  public List<DsViewDTO> getDsViews(String userId) {
    List<DsViewEntity> entities = datasetDAO.selectUserAuthDsViewList(userId);

    if (entities.isEmpty()) {
      entities = datasetDAO.selectGrpAuthDsViewList(userId);
    }

    List<DsViewDTO> result = new ArrayList<DsViewDTO> ();

    for (DsViewEntity entity : entities) {
      result.add(DsViewDTO.builder()
        .dsId(entity.getDsId())
        .ip(entity.getIp())
        .dbNm(entity.getDbNm())
        .dsViewDesc(entity.getDsViewDesc())
        .dsViewId(entity.getDsViewId())
        .dsViewNm(entity.getDsViewNm())
        .dbmsType(DbmsType.fromString(entity.getDbmsType()).get())
        .build());
    }

    return result;
  }

  public MartResultDTO martSelectList() {  
	  DsMstrDTO dsMstrDTO = DsMstrDTO.builder()
	  		.dsId(2564)
	  	  .dsNm("[Oracle] WISEMART")
	  	  .ip("52.79.199.37")
	  	  .port("1539")
	  	  .dbNm("wise")
	  	  .ownerNm("WISEMART")
	  	  .password("wisemart")
	  	  .userId("wisemart")
	  	  .connector("SID")
	  	  .dsDesc("")
	  	  .dbmsType(DbmsType.ORACLE)
	  	  .build();
	  
	  martConfig.setMartDataSource(dsMstrDTO);
	  String query = "SELECT * FROM BMT_F_버블차트";
	  return martDAO.select(query);
  }
  
  public List<DatasetFieldVO> queryTableSql(int dsId, String query, boolean join) {
	  List<DatasetFieldVO> fields = new ArrayList<DatasetFieldVO>();
      try {
          /* DOGFOOT ktkang 데이터 집합 기본값 USE_SQL 로 되어있을 때 오류 수정  20200701 */
//    	  추후 param이 추가된 이루에 추가.
//      	if(sqlType != null && sqlType.equals("dataset")) {
//      		sql = this.sqlMapper.mapParameter(sql, params, sqlType,null);
//      	} else {
//      		sql = this.sqlMapper.mapParameter(sql, params);
//      	}
    	  DsMstrDTO dsMstrDTO = getDataSource(dsId);
    	  martConfig.setMartDataSource(dsMstrDTO);
          if(join) {
        	  query = query.replaceAll("RIGHT OUTER", "INNER");
          }
          
          MartResultDTO result = martDAO.select(query);
          
          for(int metaIndex = 0; metaIndex < result.getMetaData().size(); metaIndex++) {
        	  MetaDTO meta = result.getMetaData().get(metaIndex);
        	  if(meta.getColumnName().equals("")) throw new SQLException();
        	  DataFieldType type;
        	  switch (Integer.parseInt(meta.getColumnType())) {
	        	  case Types.BIGINT:
	        	  case Types.DECIMAL:
	        	  case Types.DOUBLE:
	        	  case Types.FLOAT:
	        	  case Types.INTEGER:
	        	  case Types.TINYINT:
	        	  case Types.SMALLINT:
	        	  case Types.NUMERIC:
	        	  case Types.REAL:
	        		  type = DataFieldType.MEASURE;
	        		  break;
	        	  default:
	        		  type = DataFieldType.DIMENSION;
        	  }
        	  DatasetFieldVO field = DatasetFieldVO.builder()
        			  .parentId("0")
        			  .uniqueName(meta.getColumnName())
        			  .type(type)
        			  .dataType(meta.getColumnTypeName())
        			  .name(meta.getColumnLabel())
        			  .build();
        	  
        	  fields.add(field);
          }
      } catch (Exception e) {
    	  
      }

      return fields;
	}
}

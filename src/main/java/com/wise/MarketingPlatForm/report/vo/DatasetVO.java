package com.wise.MarketingPlatForm.report.vo;

import java.util.List;
import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.dataset.vo.DatasetFieldVO;
import lombok.Builder;
import lombok.Getter;

@Getter
public class DatasetVO {
	// dataset 공통 필드
	int datasetId;
	String datasetNm;
	DsType datsetType;
	List<DatasetFieldVO> fields;
	// 쿼리직접입력 필드
	int datasrcId; 
	String datasetQuery;
	// 주제영역 필드
	String cubeDesc;
	int cubeId;
	String cubeNm;
	int dsViewId;
	int ordinal;
	
	@Builder(builderMethodName = "topBuilder", builderClassName = "topBuilder")
	private DatasetVO(int datasetId, String datasetNm, DsType datsetType, List<DatasetFieldVO> fields, // 공용
			 int datasrcId, String datasetQuery, String cubeDesc, int cubeId, String cubeNm, int dsViewId, int ordinal) {
		this.datasetId = datasetId;
	    this.datasetNm = datasetNm;
	    this.datsetType = datsetType;
	    this.fields = fields;
	    this.datasrcId = datasrcId;
	    this.datasetQuery = datasetQuery;
	    this.cubeDesc = cubeDesc;
	    this.cubeId = cubeId;
	    this.cubeNm = cubeNm;
	    this.dsViewId = dsViewId;
	    this.ordinal = ordinal;
	}
	// 쿼리직접입력 빌더
	@Builder(builderClassName = "queryDatasetBuilder", builderMethodName = "queryDatasetBuilder")
	public static DatasetVO asQuery(int datasetId, String datasetNm, DsType datsetType, List<DatasetFieldVO> fields, // 공용
			 int datasrcId, String datasetQuery) {
	    return DatasetVO.topBuilder().datasetId(datasetId).datasetNm(datasetNm).datsetType(datsetType)
	 		   .fields(fields).datasrcId(datasrcId).datasetQuery(datasetQuery).build();
	}
	// 주제영역 빌더
	@Builder(builderClassName = "cubeDatasetBuilder", builderMethodName = "cubeDatasetBuilder")
	public static DatasetVO asDataset(int datasetId, String datasetNm, DsType datsetType, List<DatasetFieldVO> fields, // 공용
			 String cubeDesc, int cubeId, String cubeNm, int dsViewId, int ordinal) {
	   return DatasetVO.topBuilder().datasetId(datasetId).datasetNm(datasetNm).datsetType(datsetType)
	 		   .fields(fields).cubeId(cubeId).cubeDesc(cubeDesc).cubeNm(cubeNm).dsViewId(dsViewId).ordinal(ordinal).build();
	}
}

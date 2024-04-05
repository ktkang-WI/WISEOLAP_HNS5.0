package com.wise.MarketingPlatForm.fileUpload.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;

import com.wise.MarketingPlatForm.dataset.entity.UserUploadMstrEntity;
import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.type.DbmsType;
import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.dataset.vo.UserUploadMstrDTO;
import com.wise.MarketingPlatForm.fileUpload.store.UploadGenerator;
import com.wise.MarketingPlatForm.fileUpload.store.factory.UploadGeneratorFatory;
import com.wise.MarketingPlatForm.fileUpload.util.CSVLoader;
import com.wise.MarketingPlatForm.fileUpload.util.ExcelLoader;
import com.wise.MarketingPlatForm.global.config.MartConfig;
import com.wise.MarketingPlatForm.global.util.WINumberUtils;
import com.wise.MarketingPlatForm.global.util.WebFileUtils;
import com.wise.MarketingPlatForm.mart.dao.MartDAO;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;

import javaxt.utils.Date;

import org.apache.catalina.util.XMLWriter;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.wise.MarketingPlatForm.querygen.querysetting.DBSetting;
import com.wise.MarketingPlatForm.querygen.querysetting.dbms.DB2BLUSetting;
import com.wise.MarketingPlatForm.querygen.querysetting.dbms.MSSQLSetting;
import com.wise.MarketingPlatForm.querygen.querysetting.dbms.OracleSetting;
import com.wise.MarketingPlatForm.querygen.querysetting.dbms.TiberoSetting;
import com.wise.MarketingPlatForm.report.dao.ReportDAO;

@Service
public class FileUploadService {
    

    private final File spreadReportFolder;
    private final DatasetService datasetService;
    private final MartConfig martConfig;
    private final MartDAO martDAO;
    private final ReportDAO reportDAO;

    FileUploadService(DatasetService datasetService, MartConfig martConfig, MartDAO martDAO, ReportDAO reportDAO) {
        this.datasetService = datasetService;
        this.martConfig = martConfig;
        this.martDAO = martDAO;
        this.reportDAO = reportDAO;
        
        
        spreadReportFolder = new File(new File("UploadFiles"), "spread_reports");
		if (!this.spreadReportFolder.isDirectory()) {
	        this.spreadReportFolder.mkdirs();
	    }
    }
	
	public void saveFile(MultipartFile file, String fileName) throws Exception {
        try (InputStream input = file.getInputStream()) {
        	File sysFile = WebFileUtils.getFile(spreadReportFolder, fileName);
        	if(sysFile == null) new Exception("spread File create Error");
			Files.copy(input, sysFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        }
    }

	public void deleteFile(String fileName) throws Exception {
		File file = WebFileUtils.getFile(spreadReportFolder, fileName);
		if (!file.delete()) {
			new Exception("spread File delete Exception");
		}
		
	}
	
	public byte[] fileImport(String fileName) throws Exception {
		byte[] fileByte = null;
		File file = WebFileUtils.getFile(spreadReportFolder, fileName);
		Path filePath = file.toPath();
		fileByte = Files.readAllBytes(filePath);

		return fileByte;
	}

	public ArrayList<JSONObject> getUploadDataColumnList(HttpServletRequest request) throws IOException {

        ArrayList<JSONObject> uploadDataColumnList = new ArrayList<JSONObject>();
        try {
            String rename = request.getParameter("rename");
            String filename = "", file = "";
            File uploadFolder = WebFileUtils.getWebFolder(true, "UploadFiles", "UserUpload");

            MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;
            Iterator<String> iterator = multipartHttpServletRequest.getFileNames();
            MultipartFile multipartFile = null;

            while (iterator.hasNext()) {
                multipartFile = multipartHttpServletRequest.getFile(iterator.next());

                if (multipartFile.isEmpty() == false) {
                    if (multipartFile.getSize() > 1024 * 1024 * 100) throw new ServletException("에러");
                    filename = multipartFile.getOriginalFilename();

                    if (rename != null && rename.equals("true")) {
                        filename = "wise"
                                + new SimpleDateFormat("yyyyMMddHHmmss").format(new Date(System.currentTimeMillis()))
                                + "." + filename.split("\\.")[1];
                    }

                    if (filename != null) {
                        if (filename.toLowerCase().endsWith(".csv") || filename.toLowerCase().endsWith(".xlsx")
                                || filename.toLowerCase().endsWith(".xls")) {
                        } else{
                            throw new ServletException("파일 업로드 에러");
                        }
                    }

                    File uploadFile = new File(uploadFolder, filename);
                    try (FileOutputStream fos = new FileOutputStream(uploadFile)) {
                        fos.write(multipartFile.getBytes());
                    }
                }
            }

            String ext = "";
            int index = filename.lastIndexOf(".");
            if (index != -1) {
                ext = filename.substring(index + 1);
            }

            UploadGeneratorFatory uploadGeneratorFatory = new UploadGeneratorFatory();
            UploadGenerator uploadGenerator = uploadGeneratorFatory.getDataStore(ext);

            uploadDataColumnList = uploadGenerator.getUploadColumnList(uploadDataColumnList,uploadFolder, filename);
            
            
        } catch (Exception e) {
            throw new UnsupportedOperationException("Unimplemented method 'getUploadDataColumnList'");
        }
        
        
        return uploadDataColumnList;
    }

	public Map<String, Object> createUploadDataTable(int userNo, int dsId,String appendTable, String dataNm, List<Map<String, Object>> uploadDataList, String tableDeleteYN) {

        DsMstrDTO dsMstrDTO = datasetService.getDataSource(dsId);

        Map<String, Object> result = new HashMap<>();

        martConfig.setMartDataSource(dsMstrDTO);
        DbmsType aDbmsType = dsMstrDTO.getDbmsType();
        String tableSystemQuery= "";
        String tmpTblNm = "";
        String createTableQuery = "";
        String Owner = dsMstrDTO.getOwnerNm();
        DBSetting oSetting = null;

        if (aDbmsType == DbmsType.MS_SQL) {
			oSetting = new MSSQLSetting();
		}
		
        if (aDbmsType == DbmsType.ORACLE) {
			oSetting = new OracleSetting();
		}

		if (aDbmsType == DbmsType.DB2) {
			oSetting = new DB2BLUSetting();
		}

		if (aDbmsType == DbmsType.TIBERO) {
			oSetting = new TiberoSetting();
		}

        if(oSetting != null){

            tableSystemQuery = oSetting.GetSelectMartTableSystemQuery();

            MartResultDTO martResultDTO = martDAO.select(dsId,tableSystemQuery);

            List<Map<String, Object>> martUploadTalbeList = martResultDTO.getRowData();
            int iCnt = 0;

            if(martUploadTalbeList.size() > 0){
                for ( int i = 0; i < martUploadTalbeList.size(); i++) {
                    iCnt ++;
                }
                tmpTblNm = Owner +".T_WISE_" + dsId + "_" + iCnt;
            } else {
                tmpTblNm = Owner +".T_WISE_" + dsId + "_" + iCnt;
            }
            try {
                result = makeCreateTable(userNo, dsMstrDTO ,appendTable, tmpTblNm, dataNm, uploadDataList, tableDeleteYN , dsId, Owner);
            } catch (Exception e) {
                e.printStackTrace();
            }

        }
		return result;
	}

    private Map<String, Object> makeCreateTable(int userNo, DsMstrDTO dsMstrDTO, String appendTable, String tmpTblNm,
                     String dataNm, List<Map<String, Object>> uploadDataList, String tableDeleteYN, int dsId, String Owner) {
        ArrayList<String> header = new ArrayList<String>();
        StringBuilder query = new StringBuilder();
        boolean iFirst = true;
        String realpath = "";
        String filename = "";
        String dbtype = dsMstrDTO.getDbmsType().toString();
        Map<String, Object> result = new HashMap<>();

        if (appendTable.equals("")) {
            if (uploadDataList != null) {
                query.append(" CREATE TABLE " + tmpTblNm + "(");
                for (int i = 0; i < uploadDataList.size(); i++) {
                    Map<String, Object> obj = uploadDataList.get(i);
                    String colType = obj.get("colType") + "";
                    if (dbtype.equals("TIBERO") && colType.toUpperCase().equals("INT")) {
                        colType = "NUMBER";
                        /* DOGFOOT ktkang 사용자 데이터 업로드 NETEZZA 추가 20200910 */
                    } else if (dbtype.equals("NETEZZA") && colType.toUpperCase().equals("INT")) {
                        colType = "NUMERIC";
                    } else if (dbtype.equals("NETEZZA") && colType.toUpperCase().equals("STRING")) {
                        colType = "NVARCHAR";
                    } else {
                        colType = obj.get("colType")+"";
                    }

                    String colLength = obj.get("colSize") + "";
                    if (iFirst) {
                        if (dbtype.equals("IMPALA")) {
                            query.append(" " + obj.get("colPhysicalNm") + " "
                                    + getMatchedLength(colType, colLength) + " ");
                        } else {
                            /* dogfoot 사용자데이터 업로드 컬럼명이 숫자일때 table 생성 오류 수정 shlim 20210308 */
                            if (WINumberUtils.isNumber(obj.get("colPhysicalNm")+"")) {
                                query.append(" " + "\"" + obj.get("colPhysicalNm") + "\"" + " "
                                        + getMatchedLength(colType, colLength) + " NULL ");
                            } else {
                                query.append(" " + obj.get("colPhysicalNm") + " "
                                        + getMatchedLength(colType, colLength) + " NULL ");
                            }

                        }
                        iFirst = false;
                    } else {
                        if (dbtype.equals("IMPALA")) {
                            query.append(" , " + obj.get("colPhysicalNm") + " "
                                    + getMatchedLength(colType, colLength) + " ");
                        } else {
                            /* dogfoot 사용자데이터 업로드 컬럼명이 숫자일때 table 생성 오류 수정 shlim 20210308 */
                            if (WINumberUtils.isNumber(obj.get("colPhysicalNm")+"")) {
                                query.append(" , " + "\"" + obj.get("colPhysicalNm") + "\""
                                        + " " + getMatchedLength(colType, colLength) + " NULL ");
                            } else {
                                query.append(" , " + obj.get("colPhysicalNm") + " "
                                        + getMatchedLength(colType, colLength) + " NULL ");
                            }

                        }
                    }
                    /* dogfoot 사용자데이터 업로드 컬럼명이 숫자일때 table 생성 오류 수정 shlim 20210308 */
                    if (WINumberUtils.isNumber(obj.get("colPhysicalNm")+"")) {
                        header.add("\"" + obj.get("colPhysicalNm") + "\"");
                    } else {
                        header.add(obj.get("colPhysicalNm") + "");
                    }

                    realpath = obj.get("realpath") + "";
                    filename = obj.get("fileName") + "";
                }

                query.append(" )");

                System.out.println(query.toString());

                if (query != null) {
                    martDAO.select(dsId,query.toString());
                    String tblCommentQuery = "";
                    if(dbtype.toUpperCase().equals("VERTICA")) {
                        tblCommentQuery = "COMMENT ON TABLE " +tmpTblNm+ " IS '"+tmpTblNm+"'";
                        martDAO.select(dsId,tblCommentQuery);
                    }
                    
                }
            }
            // 테이블 생성 끝
        } else {
            tmpTblNm = Owner + '.' + appendTable;
            
            if (tableDeleteYN != null) {
                if (tableDeleteYN.equals("Y")) {
                    
                    if (dbtype.equals("DB2BLU")) {
                        query.append("DELETE FROM " + tmpTblNm);
                    } else {
                        query.append("TRUNCATE TABLE " + tmpTblNm);
                    }

                    martDAO.select(dsId,query.toString());
                }
            }
            if (uploadDataList != null) {
                for (int i = 0; i < uploadDataList.size(); i++) {
                    Map<String, Object> obj = uploadDataList.get(i);
                    header.add(obj.get("colPhysicalNm") + "");
                    realpath = obj.get("realpath") + "";
                    filename = obj.get("fileName") + "";
                }
            }
            
        }
        
        //컬럼 정보 구하기
        ArrayList<HashMap<String, String>> colInfo = new ArrayList<HashMap<String, String>>();
        if (uploadDataList != null) {
            for (int i = 0; i < uploadDataList.size(); i++) {
                Map<String, Object> colobj = uploadDataList.get(i);
                HashMap<String, String> map = new HashMap<String, String>();
                colobj.forEach((key, value) -> {
                    //System.out.println("key: " + key + ", value: " + value);
                    if (key != null) {
                        if (!key.equals("fileName") || !key.equals("realpath")){
                            map.put(key, colobj.get(key) + "");
                        }
                    }
                });
                colInfo.add(map);
            }
        }

        
        
        // String tableXmlString;
        try {
            result = executeCsvImport(filename, tmpTblNm, header, ',', colInfo, dsId, realpath, dsMstrDTO);
            result.put("dsId",dsId);
            result.put("tableName",tmpTblNm);
            result.put("columnList",colInfo);
            // tableXmlString = UploadTableInfo(filename,
                    // filename.substring(filename.lastIndexOf(".") + 1), tmpTblNm, dsMstrDTO.getOwnerNm(), uploadDataList);

            if (result != null) {

                UserUploadMstrEntity userUploadTable = new UserUploadMstrEntity();
                userUploadTable.setDataNm(dataNm);
                userUploadTable.setTableNm(tmpTblNm);
                userUploadTable.setRegUserNo(userNo);
                userUploadTable.setDataDesc("");
                userUploadTable.setDsId(dsId);
                /* DOGFOOT mksong BASE64 오류 수정 20200116 */
                userUploadTable.setUploadXml(result.toString());
                        
                if (appendTable.equals("")) {
                    reportDAO.insertUserUpload(userUploadTable);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            // tableXmlString = "";
            tmpTblNm = "";
        }
        return result;
    }

    public Map<String, Object> executeCsvImport(String FileNm, String tblNm, ArrayList<String> header, char seprator,
			ArrayList<HashMap<String, String>> colInfo, int dsId ,String realpath,DsMstrDTO dsMstrDTO) {
		String reval = "";

		StringBuilder query = new StringBuilder();
		String uploadId = "";
		Boolean dataClearChk = false;
		Map<String, Object> result = new HashMap<>();

		try {
			String webUrl = "";


			String ext = "";
			int index = FileNm.lastIndexOf(".");
			if (index != -1) {
				ext = FileNm.substring(index + 1);
			}

			if (ext.equalsIgnoreCase("csv")) {
				CSVLoader csv = new CSVLoader(martDAO , seprator, header, dsMstrDTO);

				try {
					csv.loadCSV(realpath, tblNm, dataClearChk, colInfo,
							"True", dsId);
				} catch (IOException e) {
					e.printStackTrace();
				}

			} else {
				if (ext.equalsIgnoreCase("cell"))
					FileNm = FileNm.substring(0, index) + ".xlsx";
				ExcelLoader excel = new ExcelLoader(martDAO,"", header, dsMstrDTO);
				try {
					excel.loadExcel(realpath, tblNm, dataClearChk, colInfo,
							"True", dsId);
				} catch (IOException e) {
					e.printStackTrace();
				}
				// 국방부
				// excel.loadExcel("/opt/hpws22/tomcat_olap/webapps/WISE.BI.AUDI.WEB.SVC.v4/UploadFiles/DataFile/"
				// + FileNm, tblNm, true,colInfo,FILE_FIRSTROW_HD);

			}

			
			query.append("SELECT '" + tblNm + "' AS TABLE_NAME ").append(" , '" + tblNm + "' AS TABLE_CAPTION ")
						.append(" , COUNT(*) AS RE_CNT").append(" FROM " + tblNm);

            MartResultDTO martResultDTO = martDAO.select(dsId,query.toString());

            List<Map<String, Object>> martDataList = martResultDTO.getRowData();

            if(martDataList.size() > 0){
                for ( int i = 0; i < martDataList.size(); i++) {
                    Map<String, Object> obj = martDataList.get(i);
                    result.put("REC_CNT", obj.get("RE_CNT").toString());
                }
            }
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			
		}
		return result;
	}

    public String UploadTableInfo(String fileName,String fileExt,String tableCaption, String Owner, List<Map<String, Object>> colArr) throws IOException {
		return "";
	}

    public String getMatchedLength(String columnType, String length) {
        String value = "";
        if (columnType.equalsIgnoreCase("String")) {
            value = "VARCHAR(" + length + ")";
        } else if (columnType.equalsIgnoreCase("int")) {
            value = "INT";
        } else if (columnType.equalsIgnoreCase("NUMBER")) {
            value = "NUMBER";
            /* DOGFOOT ktkang 사용자 데이터 업로드 NETEZZA 추가 20200910 */
        } else if (columnType.equalsIgnoreCase("NUMERIC")) {
            value = "NUMERIC";
        } else if (columnType.equalsIgnoreCase("NVARCHAR")) {
            value = "NVARCHAR(" + length + ")";
        } else if (columnType.equalsIgnoreCase("decimal")) {
            String val[] = length.split("[.]");
            value = "DECIMAL(" + val[0] + "," + val[1].length() + ")";
        } else if (columnType.equalsIgnoreCase("float")) {
            value = "float(" + length + ")";
        } else {
            /* dogfoot 사용자업로드데이터 데이터 타입 변경기능 추가 임시 shlim 20210120 */
            value = columnType;
        }
        return value;
    }
}
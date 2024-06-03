package com.wise.MarketingPlatForm.fileUpload.util;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.mart.dao.MartDAO;

public class ExcelLoader {

	private static final String SQL_INSERT = "INSERT INTO ${table}(${keys}) VALUES(${values})";
	private static final String TABLE_REGEX = "\\$\\{table\\}";
	private static final String KEYS_REGEX = "\\$\\{keys\\}";
	private static final String VALUES_REGEX = "\\$\\{values\\}";

	private MartDAO martDAO;
	private String seprator;
	private ArrayList<String> header;
	private DsMstrDTO dsMstrDTO;
	
	public ExcelLoader(MartDAO martDAO,String seprator,ArrayList<String> header, DsMstrDTO dsMstrDTO) {
		this.martDAO = martDAO;
		//Set default separator
		this.seprator = seprator;
		this.header = header;
		this.dsMstrDTO = dsMstrDTO;
	}
	
	public void loadExcel(String xlsxFile, String tableName,
			boolean truncateBeforeLoad,ArrayList<HashMap<String, String>> colInfo,String FILE_FIRSTROW_HD,int dsId) throws IOException {
				
				String[] headerRow = header.toArray(new String[header.size()]);

				if (null == headerRow) {
					throw new FileNotFoundException(
							"No columns defined in given CSV file." +
							"Please check the CSV file format.");
				}

				String questionmarks = "";
				String query = SQL_INSERT.replaceFirst(TABLE_REGEX, tableName);
				query = query
						.replaceFirst(KEYS_REGEX, StringUtils.join(headerRow, ","));
					
				String ext = "";
				int index = xlsxFile.lastIndexOf(".");
				String valueQuery = "";
				try {

					String databaseName = dsMstrDTO.getDbmsType().toString();

					if (index != -1) {
						ext = xlsxFile.substring(index + 1);
					}

					if (ext.equalsIgnoreCase("xls")) {
						FileInputStream fis = new FileInputStream(xlsxFile);
						HSSFWorkbook workbook = new HSSFWorkbook(fis);
						fis.close();

						int rowindex = 0;
						int columnindex = 0;

						HSSFSheet sheet = workbook.getSheetAt(0);
						int rows = sheet.getPhysicalNumberOfRows();

						int headerCheck = 0;
						if (FILE_FIRSTROW_HD.equals("True"))
						{
							headerCheck = 1;
						}

						HSSFRow rowheader=sheet.getRow(0);
						int cells = rowheader.getPhysicalNumberOfCells();

						for (rowindex = headerCheck; rowindex < rows; rowindex++) {
							HSSFRow row=sheet.getRow(rowindex);
							questionmarks = "";
							if (row != null) {
								for (columnindex = 0; columnindex < cells; columnindex++) {
									HSSFCell cell = row.getCell(columnindex);
									String value = "";
									String coltype = colInfo.get(columnindex).get("COL_DATA_TYPE");	
									//셀이 빈값일경우를 위한 널체크
									if (cell == null) {
										value = "";

										if(columnindex == 0){
											questionmarks = "'" + value + "'";
										} else {
											questionmarks += ",'" + value + "'";
										}
									} else {

										switch (cell.getCellType()){
											case FORMULA:
												value = cell.getCellFormula();
												break;
											case NUMERIC:
												/*dogfoot 사용자업로드데이터 데이터 타입 변경기능 추가 임시 shlim 20210120*/
												if (coltype.indexOf("decimal") > -1 || coltype.indexOf("float") > -1) {
													value = cell.getNumericCellValue() + "";
												}
												else {
													value = (int)cell.getNumericCellValue() + "";
												}
												break;
											case STRING:
												value = cell.getStringCellValue() + "";
												break;
											case BLANK:
												//value=cell.getBooleanCellValue()+"";
												value = "";
												break;
											case ERROR:
												value = cell.getErrorCellValue() + "";
												break;
										}

										switch (coltype.toUpperCase()) {
											case "INT32":
											case "INT":
											case "INTEGER":
												value = cell.getStringCellValue() + "";
		
												if(value.equals("")) {
													value = "0";
												}
		
												if(columnindex == 0){
													questionmarks = ""+value;
												} else {
													questionmarks += ","+value;
												}
		
												break;
											case "DOUBLE":
											case "FLOAT":
											case "DECIMAL":
												value = cell.getStringCellValue() + "";
												if(value.equals("")) {
													value = "0";
												}
		
												if(columnindex == 0){
													questionmarks = ""+value;
												} else {
													questionmarks += ","+value;
												}
												break;
											default:
												value = cell.getStringCellValue() + "";
												if(columnindex == 0){
													questionmarks = "'" + value + "'";
												} else {
													questionmarks += ",'" + value + "'";
												}
												break;
										}
									}

									questionmarks += ",'" + value + "'";
								} 

								valueQuery = query.replaceFirst(VALUES_REGEX, questionmarks);
								// System.out.println(valueQuery);
								//1줄 읽고 insert 쿼리 던지기
						  		martDAO.select(dsId,valueQuery);
						   }
						}

					} else {
						FileInputStream fis = new FileInputStream(xlsxFile);
						XSSFWorkbook workbook = new XSSFWorkbook(fis);
						fis.close();
						int rowindex=0;
						int columnindex=0;

						XSSFSheet sheet=workbook.getSheetAt(0);

						final int batchSize = 1000;
						int rows = sheet.getPhysicalNumberOfRows();
						int headerCheck = 0;
						if (FILE_FIRSTROW_HD.equals("True"))
						{
							headerCheck = 1;
						}

						XSSFRow rowheaders = sheet.getRow(rowindex);
						int cells = colInfo.size();

						for (rowindex = headerCheck; rowindex < rows; rowindex++) {
							XSSFRow row=sheet.getRow(rowindex);
							questionmarks = "";
							if(row !=null){
								for (columnindex = 0; columnindex < cells; columnindex++) {
									XSSFCell cell=row.getCell(columnindex);
									String value="";
									String coltype = colInfo.get(columnindex).get("colType");	
									if (cell == null) {
										value="";
										if(columnindex == 0){
											questionmarks = "'" + value + "'";
										} else {
											questionmarks += ",'" + value + "'";
										}
									}
									else {

										switch (cell.getCellType()){
											case FORMULA:
												value = cell.getCellFormula();
												break;
											case NUMERIC:
												/*dogfoot 사용자업로드데이터 데이터 타입 변경기능 추가 임시 shlim 20210120*/
												if (coltype.indexOf("decimal") > -1 || coltype.indexOf("float") > -1) {
													value = cell.getNumericCellValue() + "";
												}
												else {
													value = (int)cell.getNumericCellValue() + "";
												}
												break;
											case STRING:
												value = cell.getStringCellValue() + "";
												break;
											case BLANK:
												//value=cell.getBooleanCellValue()+"";
												value = "";
												break;
											case ERROR:
												value = cell.getErrorCellValue() + "";
												break;
										}
											
										switch (coltype.toUpperCase()) {
											case "INT32":
											case "INT":
											case "INTEGER":

												if(value.equals("")) {
													value = "0";
												}
		
												if(columnindex == 0){
													questionmarks = ""+value;
												} else {
													questionmarks += ","+value;
												}
		
												break;
											case "DOUBLE":
											case "FLOAT":
											case "DECIMAL":
												if(value.equals("")) {
													value = "0";
												}
		
												if(columnindex == 0){
													questionmarks = ""+value;
												} else {
													questionmarks += ","+value;
												}
												break;
											default:
												if(columnindex == 0){
													questionmarks = "'" + value + "'";
												} else {
													questionmarks += ",'" + value + "'";
												}
												break;
										}
									}
								}
								valueQuery = query.replaceFirst(VALUES_REGEX, questionmarks);
								// System.out.println(valueQuery);

								//1줄 읽고 insert 쿼리 던지기
						  		martDAO.select(dsId,valueQuery);
						   }
						}

					}

				} catch (Exception e) {
					e.printStackTrace();
					
				}
			}
		
		
}

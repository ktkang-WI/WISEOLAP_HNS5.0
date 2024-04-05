package com.wise.MarketingPlatForm.fileUpload.util;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

import org.apache.commons.lang3.StringUtils;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.mart.dao.MartDAO;

/**
 * 
 * @author viralpatel.net
 * 
 */
public class CSVLoader {

	private static final 
		String SQL_INSERT = "INSERT INTO ${table}(${keys}) VALUES(${values})";
	private static final String TABLE_REGEX = "\\$\\{table\\}";
	private static final String KEYS_REGEX = "\\$\\{keys\\}";
	private static final String VALUES_REGEX = "\\$\\{values\\}";

	private MartDAO martDAO;
	private char seprator;
	private ArrayList<String> header;
	private DsMstrDTO dsMstrDTO;

	/**
	 * Public constructor to build CSVLoader object with
	 * Connection details. The connection is closed on success
	 * or failure.
	 * @param martDAO
	 */
	public CSVLoader(MartDAO martDAO,char seprator,ArrayList<String> header, DsMstrDTO dsMstrDTO) {
		this.martDAO = martDAO;
		//Set default separator
		this.seprator = seprator;
		this.header = header;
		this.dsMstrDTO = dsMstrDTO;
	}
	
	/**
	 * Parse CSV file using OpenCSV library and load in 
	 * given database table. 
	 * @param csvFile Input CSV file
	 * @param tableName Database table name to import data
	 * @param truncateBeforeLoad Truncate the table before inserting 
	 * 			new records.
	 * @throws NotFoundDatabaseConnectorException 
	 * @throws IOException
	 * @throws NumberFormatException 
	 * @throws CsvValidationException 
	 */
	@SuppressWarnings("null")
	public void loadCSV(String csvFile, String tableName,
			boolean truncateBeforeLoad,ArrayList<HashMap<String, String>> colInfo,String FILE_FIRSTROW_HD,int dsId) throws IOException, CsvValidationException, NumberFormatException {

		CSVReader csvReader = null;

		try {
			
			String fileEncode = "UTF8"; 
			
			if(csvFile.startsWith("h") || csvFile.startsWith("H")) {
				InputStream in = new URL(csvFile).openStream();
				csvReader = new CSVReader(new InputStreamReader(in, fileEncode));
			} else {
				csvReader = new CSVReader(new InputStreamReader(new FileInputStream(csvFile), fileEncode));
			}

		} catch (IOException e) {
			e.printStackTrace();
		}

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

		String valueQuery = "";

		String[] nextLine;
		try {
			final int batchSize = 1000;
			int count = 0;
			Date date = null;
			while ((nextLine = csvReader.readNext()) != null) {
				if(FILE_FIRSTROW_HD.equals("True"))
				{
					FILE_FIRSTROW_HD = "False";
				}
				else
				{
					if (null != nextLine) {
						int index = 1;
						for (String lineString : nextLine) {
							date = DateUtil.convertToDate(lineString);
							if (null != date) {
								//ps.setDate(index++, new java.sql.Date(date.getTime()));

								if(index == 1){
									questionmarks = ""+lineString;
								} else {
									questionmarks += ","+lineString;
								}
								
								index++;
							} else {
								
								String coltype = colInfo.get(index-1).get("colType").toUpperCase();

								switch (coltype.toUpperCase()) {
									case "INT32":
									case "INT":
									case "INTEGER":

										if(lineString.equals("")) {
											lineString = "0";
										}

										if(index == 1){
											questionmarks = ""+lineString;
										} else {
											questionmarks += ","+lineString;
										}

										break;
									case "DOUBLE":
									case "FLOAT":
									case "DECIMAL":
										if(lineString.equals("")) {
											lineString = "0";
										}

										if(index == 1){
											questionmarks = ""+lineString;
										} else {
											questionmarks += ","+lineString;
										}
										break;
									default:
										if(index == 1){
											questionmarks = "'" + lineString + "'";
										} else {
											questionmarks += ",'" + lineString + "'";
										}
										break;
								}
								
								index++;
							}
						}

						valueQuery = query.replaceFirst(VALUES_REGEX, questionmarks);
						System.out.println(valueQuery);
						//martDAO.select(dsId,valueQuery);
					}
				}
				

			}
		} catch (Exception e) {
			e.printStackTrace();
			
		} finally {
			csvReader.close();
		}
	}

}

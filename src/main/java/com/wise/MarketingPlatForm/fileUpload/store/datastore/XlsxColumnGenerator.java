package com.wise.MarketingPlatForm.fileUpload.store.datastore;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONObject;

import com.wise.MarketingPlatForm.fileUpload.store.UploadGenerator;

public class XlsxColumnGenerator implements UploadGenerator{

    @Override
    public ArrayList<JSONObject> getUploadColumnList(ArrayList<JSONObject> uploadDataColumnList, File uploadFolder, String filename) throws IOException {
        ArrayList<JSONObject> tempArr = new ArrayList<JSONObject>();
        File uploadFile = new File(uploadFolder, filename);

        try (FileInputStream fis = new FileInputStream(uploadFile);
                XSSFWorkbook workbook = new XSSFWorkbook(fis)) {
            int columnindex = 0;
            XSSFSheet sheet = workbook.getSheetAt(0);
            XSSFRow row = sheet.getRow(0);
            int cells = row.getPhysicalNumberOfCells();
            for (columnindex = 0; columnindex < cells; columnindex++) {
                XSSFCell cell = row.getCell(columnindex);
                String value = "";
                switch (cell.getCellType()) {
                    case FORMULA:
                        value = cell.getCellFormula();
                        break;
                    case NUMERIC:
                        value = cell.getNumericCellValue() + "";
                        break;
                    case STRING:
                        value = cell.getStringCellValue() + "";
                        break;
                    case BLANK:
                        value = cell.getBooleanCellValue() + "";
                        break;
                    case ERROR:
                        value = cell.getErrorCellValue() + "";
                        break;
                    default:
                        break;
                }

                JSONObject obj = new JSONObject();
                obj.put("colNm", value);
                obj.put("colPhysicalNm", (value.replaceAll(" ", "")));
                obj.put("colSize", 255);
                obj.put("realpath", uploadFile.getPath());
                obj.put("fileName", filename);
                tempArr.add(obj);
            }
            row = sheet.getRow(1);
            // cells=row.getPhysicalNumberOfCells();
            for (columnindex = 0; columnindex < cells; columnindex++) {
                XSSFCell cell = row.getCell(columnindex);
                String valueType = "";
                if (cell == null) {
                    valueType = "String";
                    JSONObject obj = tempArr.get(columnindex);
                    obj.put("colType", valueType);
                    uploadDataColumnList.add(obj);
                } else {
                    switch (cell.getCellType()) {
                        case FORMULA:
                            valueType = "int";
                            break;
                        case NUMERIC:
                            valueType = "int";
                            break;
                        case STRING:
                            valueType = "String";
                            break;
                        case BLANK:
                            valueType = "boolean";
                            break;
                        case ERROR:
                            valueType = "String";
                            break;
                        default:
                            break;
                    }
                    JSONObject obj = tempArr.get(columnindex);
                    obj.put("colType", valueType);
                    uploadDataColumnList.add(obj);
                }
            }
        }
        return uploadDataColumnList;
    }
    
}

package com.wise.MarketingPlatForm.dataset.domain.upload.store.datastore;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;

import org.json.JSONObject;

import com.wise.MarketingPlatForm.dataset.domain.upload.store.UploadGenerator;
import com.wise.MarketingPlatForm.global.util.WINumberUtils;

public class CsvColumnGenerator implements UploadGenerator {

    @Override
    public ArrayList<JSONObject> getUploadColumnList(ArrayList<JSONObject> uploadDataColumnList, File uploadFolder, String filename) throws UnsupportedEncodingException, FileNotFoundException, IOException {
        String fileEncode = "utf8";
        String UTF8_BOM = "\uFEFF";
        File uploadFile = new File(uploadFolder, filename);

        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(new FileInputStream(uploadFile), fileEncode))) {
            if (br != null) {
                String line = br.readLine();
                String[] field = line.split(",");

                ArrayList<JSONObject> tempArr = new ArrayList<JSONObject>();
                if (field != null) {
                    for (int i = 0; i < field.length; i++) {
                        String str = field[i];
                        str = (str.startsWith(UTF8_BOM)) ? str.substring(1) : str;
                        JSONObject obj = new JSONObject();
                        obj.put("colNm", str);
                        obj.put("colPhysicalNm", (str.replaceAll(" ", "")));
                        // obj.put("colType", "String");
                        obj.put("colSize", 255);
                        obj.put("realpath", uploadFile.getPath());
                        obj.put("fileName", filename);
                        tempArr.add(obj);
                    }
                }
                line = br.readLine();
                field = line.split(",", -1);
                for (int i = 0; i < field.length; i++) {
                    JSONObject obj = tempArr.get(i);
                    if (WINumberUtils.isNumber(field[i]))
                        obj.put("colType", "int");
                    else {
                        obj.put("colType", "String");
                    }
                    uploadDataColumnList.add(obj);
                }
            }
        }
        return uploadDataColumnList;
    }
    
}

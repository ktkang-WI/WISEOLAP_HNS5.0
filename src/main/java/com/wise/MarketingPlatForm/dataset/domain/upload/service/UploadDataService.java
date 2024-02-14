package com.wise.MarketingPlatForm.dataset.domain.upload.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Iterator;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.wise.MarketingPlatForm.dataset.domain.upload.store.UploadGenerator;
import com.wise.MarketingPlatForm.dataset.domain.upload.store.factory.UploadGeneratorFatory;
import com.wise.MarketingPlatForm.global.util.WebFileUtils;

import javaxt.utils.Date;

@Service
public class UploadDataService {

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
    
}

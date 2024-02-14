package com.wise.MarketingPlatForm.fileUpload.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;

import com.wise.MarketingPlatForm.dataset.entity.DsMstrEntity;
import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.type.DbmsType;
import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.fileUpload.store.UploadGenerator;
import com.wise.MarketingPlatForm.fileUpload.store.factory.UploadGeneratorFatory;
import com.wise.MarketingPlatForm.global.config.MartConfig;
import com.wise.MarketingPlatForm.global.util.WebFileUtils;
import com.wise.MarketingPlatForm.mart.dao.MartDAO;
import com.wise.MarketingPlatForm.querygen.dto.Hierarchy;
import com.wise.MarketingPlatForm.querygen.dto.SelectCube;
import com.wise.MarketingPlatForm.querygen.dto.SelectCubeMeasure;
import com.wise.MarketingPlatForm.querygen.service.QuerySettingEx;

import javaxt.utils.Date;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@Service
public class FileUploadService {
	
	@Value("${upload.path}")
	private String uploadPath;

	private final DatasetService datasetService;
    private final MartConfig martConfig;
    private final MartDAO martDAO;

    FileUploadService(DatasetService datasetService, MartConfig martConfig, MartDAO martDAO) {
        this.datasetService = datasetService;
        this.martConfig = martConfig;
        this.martDAO = martDAO;
    }
	
	public void saveFile(MultipartFile file, String fileName) throws Exception {
        try (InputStream input = file.getInputStream()) {
        	File folder = WebFileUtils.getWebFolder(true, "UploadFiles");
        	File sysFile = WebFileUtils.getFile(folder, fileName);
        	if(sysFile == null) new Exception("spread File create Error");
			Files.copy(input, sysFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        }
    }

	public void deleteFile(String fileName) throws Exception {
		File file = WebFileUtils.getWebFolder(false, "UploadFiles", fileName);
		if (!file.delete()) {
			new Exception("spread File delete Exception");
		}
		
	}
	
	public byte[] fileImport(String fileName) throws Exception {
		byte[] fileByte = null;
		File file = WebFileUtils.getWebFolder(false, "UploadFiles", fileName);
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

	public void createUploadDataTable(int dsId, String dataNm, List<Map<String, Object>> uploadDataList) {

        DsMstrDTO dsMstrDTO = datasetService.getDataSource(dsId);

        // TODO: 추후 DB 암호화 적용시 복호화 로직.
        // try {
        // Aes256Cipher aes256 = Aes256Cipher.getInstance();
        // String pw = aes256.AES_Decode(dsMstrDTO.getPassword());
        // dsMstrDTO.setPassword(pw);
        // } catch (Exception e) {
        // e.printStackTrace();
        // }

        martConfig.setMartDataSource(dsMstrDTO);
		
	}
}
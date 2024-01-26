package com.wise.MarketingPlatForm.fileUpload.service;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import javax.servlet.http.HttpServletRequest;
import com.wise.MarketingPlatForm.global.util.WebFileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileUploadService {
	
	@Value("${upload.path}")
	private String uploadPath;
	// @Autowired
	// private ResourceLoader resourceLoader;
	
	public void saveFile(HttpServletRequest request, MultipartFile file, String fileName) {
        try (InputStream input = file.getInputStream()) {
        	File folder = WebFileUtils.getWebFolder(request, true, "UploadFiles", fileName);
			Files.copy(input, folder.toPath(), StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception e) {
        	e.printStackTrace();
        } 
    }

	public void deleteFile(HttpServletRequest request, String fileName) {
		try {
			File file = WebFileUtils.getWebFolder(request, false, "UploadFiles", fileName);
			if (!file.delete()) {
				new Exception("spread File delete Exception");
			}
		} catch (Exception e) {
        	e.printStackTrace();
        } 
	}
}
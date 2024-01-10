package com.wise.MarketingPlatForm.fileUpload.service;

import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileUploadService {
	@Value("${upload.path}")
	private String uploadPath;
	
	public void saveFile(MultipartFile file, String fileName) {
        try (InputStream input = file.getInputStream()) {
        	ClassLoader classLoader = getClass().getClassLoader();
        	URL resourceURL = classLoader.getResource(uploadPath + fileName);
        	if (resourceURL != null) {
        	    Path filePath = Paths.get(resourceURL.toURI());
                Files.createDirectories(filePath.getParent());
                Files.copy(input, Paths.get(filePath.toString()), StandardCopyOption.REPLACE_EXISTING);
        	} else {
        	    System.out.println("리소스를 찾을 수 없습니다.");
        	}
        } catch (Exception e) {
        	e.printStackTrace();
        } 
    }
}

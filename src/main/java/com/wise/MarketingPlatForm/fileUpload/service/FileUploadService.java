package com.wise.MarketingPlatForm.fileUpload.service;

import java.io.File;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import javax.servlet.http.HttpServletRequest;
import com.wise.MarketingPlatForm.global.util.WebFileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileUploadService {
	
	@Value("${upload.path}")
	private String uploadPath;
	@Autowired
	private ResourceLoader resourceLoader;
	
	public void saveFile(HttpServletRequest request, MultipartFile file, String fileName) {
        try (InputStream input = file.getInputStream()) {
        	File folder = WebFileUtils.getWebFolder(request, true, "UploadFiles", fileName);
			Files.copy(input, folder.toPath(), StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception e) {
        	e.printStackTrace();
        } 
    }
}

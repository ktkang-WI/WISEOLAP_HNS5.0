package com.wise.MarketingPlatForm.fileUpload.controller;

import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.wise.MarketingPlatForm.fileUpload.service.FileUploadService;

@RestController
@RequestMapping(value="/upload", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
public class FileUploacController {
	
	@Autowired
	FileUploadService fileUploadService;
	
	@PostMapping("/import")
	public void fileUpload(
			HttpServletRequest httpServletRequest,
			@RequestPart("file") MultipartFile file, 
			@RequestPart("param") Map<String, String> param) {
		String fileName = param.get("fileName");
		fileUploadService.saveFile(file, fileName);
    }
}

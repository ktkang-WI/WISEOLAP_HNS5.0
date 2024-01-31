package com.wise.MarketingPlatForm.fileUpload.controller;

import java.io.File;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.wise.MarketingPlatForm.fileUpload.service.FileUploadService;

@RestController
@RequestMapping("/upload")
public class FileUploadController {
	
	@Autowired
	FileUploadService fileUploadService;
	
	@PostMapping(value="/upload" , consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
	public void fileUpload(
			HttpServletRequest request,
			@RequestPart("file") MultipartFile file, 
			@RequestPart("param") Map<String, String> param) {
		String fileName = param.get("fileName");
		fileUploadService.saveFile(request, file, fileName);
    }
	
	@PostMapping("/delete")
	public void fileUpload(HttpServletRequest request,
			@RequestBody Map<String, String> param) {
		String fileName = param.get("fileName");
		fileUploadService.deleteFile(request, fileName);
	}
	
	@PostMapping(value="/import")
	public ResponseEntity<byte[]> fileImport(
			HttpServletRequest request,
			@RequestBody Map<String, String> param) {
		String fileName = param.get("fileName");
		byte[] fileBytes = fileUploadService.fileImport(request, fileName);
		return ResponseEntity
                .ok()
                .header("Content-Disposition", "attachment; filename=binary-data.txt")
                .body(fileBytes);
	}
}
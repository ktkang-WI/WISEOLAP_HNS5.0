package com.wise.MarketingPlatForm.report.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "download", description = "보고서 다운로드와 관련된 요청을 처리합니다.")
@Controller
@RequestMapping(value = "/download")
public class ReportDownloadController {
    private static final Logger logger = LoggerFactory.getLogger(ReportDownloadController.class);
    
	@PostMapping(value = "/report-excel-all-exceljs", consumes = "multipart/form-data")
	public ResponseEntity<InputStreamResource> downloadReportExcelAll(
	        @RequestParam("file") MultipartFile file,
	        @RequestParam("fileName") String fileName) {
	    try {
	        InputStreamResource resource = new InputStreamResource(file.getInputStream());
	        long contentLength = file.getSize();

	        HttpHeaders headers = new HttpHeaders();
	        headers.setContentLength(contentLength);
	        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
	        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

	        String encodedFilename = URLEncoder.encode(fileName, StandardCharsets.UTF_8.toString()).replaceAll("\\+", "%20");
	        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFilename + "\"");

	        return ResponseEntity.ok()
	                .headers(headers)
	                .contentLength(contentLength)
	                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
	                .body(resource);
	    } catch (IOException e) {
	        e.printStackTrace();
	        return ResponseEntity.internalServerError().body(null);
	    }
	}

}

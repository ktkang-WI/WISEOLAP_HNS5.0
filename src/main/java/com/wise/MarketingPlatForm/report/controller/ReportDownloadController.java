package com.wise.MarketingPlatForm.report.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;

import javax.servlet.http.HttpServletRequest;

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

import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.global.util.SessionUtility;
import com.wise.MarketingPlatForm.log.service.LogService;
import com.wise.MarketingPlatForm.log.vo.ExportLogDTO;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "download", description = "보고서 다운로드와 관련된 요청을 처리합니다.")
@Controller
@RequestMapping(value = "/download")
public class ReportDownloadController {
    private static final Logger logger = LoggerFactory.getLogger(ReportDownloadController.class);
    
    private final LogService logService;

    ReportDownloadController(LogService logService) {
        this.logService = logService;
    }

	@PostMapping(value = "/report-excel-all-exceljs", consumes = "multipart/form-data")
	public ResponseEntity<InputStreamResource> downloadReportExcelAll(
            HttpServletRequest request,
	        @RequestParam("file") MultipartFile file,
	        @RequestParam("fileName") String fileName,
            @RequestParam(required = false, defaultValue = "1001") String reportId,
            @RequestParam(required = true) String reportNm,
            @RequestParam(required = true) String reportType
        ) {
	    try {
	        InputStreamResource resource = new InputStreamResource(file.getInputStream());
	        long contentLength = file.getSize();

	        HttpHeaders headers = new HttpHeaders();
	        headers.setContentLength(contentLength);
	        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
	        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

	        String encodedFilename = URLEncoder.encode(fileName, StandardCharsets.UTF_8.toString()).replaceAll("\\+", "%20");
	        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFilename + "\"");

            UserDTO user = SessionUtility.getSessionUser(request);
        
            ExportLogDTO logDTO = ExportLogDTO.builder()
                    .eventStamp(new Timestamp(System.currentTimeMillis()))
                    .reportId(Integer.parseInt(reportId))
                    .reportNm(reportNm)
                    .reportType(reportType)
                    .userId(user.getUserId())
                    .userNm(user.getUserNm())
                    .userNo(user.getUserNo())
                    .grpId(user.getGrpId())
                    .accessIp(request.getRemoteAddr())
                    .ctrlId("")
                    .ctrlCaption("")
                    .build();

            logService.insertExportLog(logDTO);
            
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

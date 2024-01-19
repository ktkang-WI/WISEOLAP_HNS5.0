package com.wise.MarketingPlatForm.report.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "download", description = "보고서 다운로드와 관련된 요청을 처리합니다.")
@Controller
@RequestMapping(value = "/download")
public class ReportDownloadController {
    private static final Logger logger = LoggerFactory.getLogger(ReportDownloadController.class);
    
    @PostMapping(value = "/saveXLSX.do")
	public @ResponseBody JSONObject saveXLSX(@RequestParam("exceldata") MultipartFile uploadFile,
			MultipartHttpServletRequest request, HttpServletResponse response) throws Exception {
		response.setContentType("text/html;charset=UTF-8");
		response.setCharacterEncoding("UTF-8");
		// UtilFile 객체 생성
		UtilFile utilFile = new UtilFile();

		// 파일 업로드 결과값을 path로 받아온다(이미 fileUpload() 메소드에서 해당 경로에 업로드는 끝났음)
		JSONObject obj = utilFile.fileUpload(request, uploadFile, ".xlsx");
		return obj;
	}

}

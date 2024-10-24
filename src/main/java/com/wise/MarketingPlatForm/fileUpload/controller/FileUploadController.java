package com.wise.MarketingPlatForm.fileUpload.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.http.HttpHeaders;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.grapecity.documents.excel.SaveFileFormat;
import com.grapecity.documents.excel.Workbook;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.config.controller.ConfigController;
import com.wise.MarketingPlatForm.fileUpload.service.FileUploadService;
import com.wise.MarketingPlatForm.global.util.SessionUtility;
import com.wise.MarketingPlatForm.global.util.WebFileUtils;
import com.wise.MarketingPlatForm.log.vo.ExportLogDTO;

@RestController
@RequestMapping("/upload")
public class FileUploadController {
	private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);
	@Autowired
	FileUploadService fileUploadService;
    @Autowired
    private RestTemplate restTemplate;
	
	@PostMapping(value="/upload" , consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
	public void fileUpload(
			@RequestPart("file") MultipartFile file, 
			@RequestPart("param") Map<String, String> param) throws Exception {
		String fileName = param.get("fileName");
		fileUploadService.saveFile(file, fileName);
    }

    @PostMapping(value="/hns-drmUpload")
    public String hnsDrmUpload(
        @RequestPart("file") MultipartFile file) throws Exception {
        return fileUploadService.hnsDrmUpload(file);
    }
	
	@PostMapping("/delete")
	public void fileUpload(@RequestBody Map<String, String> param) throws Exception {
		String fileName = param.get("fileName");
		fileUploadService.deleteFile(fileName);
	}
	
	@PostMapping(value="/import")
	public ResponseEntity<byte[]> fileImport(@RequestBody Map<String, String> param) throws Exception {
		String fileName = param.get("fileName");
		byte[] fileBytes = fileUploadService.fileImport(fileName);
		return ResponseEntity
                .ok()
                .header("Content-Disposition", "attachment; filename=binary-data.txt")
                .body(fileBytes);
	}

    @PostMapping(value="/loadDecryptionFile")
	public ResponseEntity<byte[]> loadDecrytionFile(@RequestBody Map<String, String> param) throws Exception {
		String fileName = param.get("fileName");
        String filePath = param.get("filePath");
		byte[] fileBytes = fileUploadService.loadDecrytionFile(fileName, filePath);
		return ResponseEntity
                .ok()
                .header("Content-Disposition", "attachment; filename=binary-data.txt")
                .body(fileBytes);
	}

    @PostMapping(value = "/upload-data-column")
    public void getUploadDataColumn(HttpServletRequest request, HttpServletResponse response) {
        
        response.setCharacterEncoding("utf-8");
        PrintWriter out = null;
        
        try {
                
                out = response.getWriter();

                ArrayList<JSONObject> uploadDataColumnList = fileUploadService.getUploadDataColumnList(request);

                out.print(uploadDataColumnList);
                out.flush();
                out.close();

        } catch (Exception e) {
                e.printStackTrace();
                ArrayList<JSONObject> uploadDataColumnList = new ArrayList<JSONObject>();
                JSONObject objCode = new JSONObject();
                objCode.put("code", 500);
                uploadDataColumnList.add(objCode);
                out.print(uploadDataColumnList);
                out.flush();
                out.close();
            }

    }

	@PostMapping(value = "/upload-user-data")
    public Map<String, Object> uploadUserData(HttpServletRequest request, @RequestBody Map<String, String> params) {
        Gson gson = new Gson();
        int dsId = Integer.parseInt(params.get("dsId"));

		String dataNm = params.getOrDefault("dataNm", "");

        String appendTable = params.getOrDefault("appendTable", "");

		String uploadData = params.getOrDefault("uploadData", "");

        String tableDeleteYN = params.getOrDefault("tableDeleteYN", "");

        UserDTO userDTO = SessionUtility.getSessionUser(request);

        int userNo = userDTO.getUserNo();

        List<Map<String, Object>> uploadDataList = gson.fromJson(uploadData,
            new TypeToken<ArrayList<Map<String, Object>>>() {
            }.getType());

		return fileUploadService.createUploadDataTable(userNo, dsId, appendTable, dataNm, uploadDataList, tableDeleteYN);
    }

    @GetMapping("/fetch-data")
    public ResponseEntity<String> fetchData(@RequestParam("fileName") String fileName) {
        String url = "http://drmapi.hns.tv/drm/fs/v1/dec?fileName=" + fileName + "&edGb=D";
        // String url = "http://10.2.3.180:443/drm/fs/v1/dec?fileName=" + fileName + "&edGb=D";
        logger.info("복호화 api 요청 url 은 " + url + " 입니다.");
        logger.info("파일 이름은  " + fileName);

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return ResponseEntity.ok(response.getBody());
    }

    @PostMapping("/uploadWorkbookData")
    public ResponseEntity<byte[]> uploadWorkbookData(
        @RequestPart("file") MultipartFile file,
        @RequestParam("fileName") String fileName
    ) {
        try {
            fileUploadService.uploadWorkbookData(file, fileName);
            return fileUploadService.downloadFile(fileName);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            // 오류 발생 시 500 Internal Server Error 응답
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null);
        }
    }
}
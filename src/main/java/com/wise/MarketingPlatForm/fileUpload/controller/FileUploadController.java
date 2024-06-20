package com.wise.MarketingPlatForm.fileUpload.controller;

import java.io.File;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.fileUpload.service.FileUploadService;
import com.wise.MarketingPlatForm.global.util.SessionUtility;

@RestController
@RequestMapping("/upload")
public class FileUploadController {
	
	@Autowired
	FileUploadService fileUploadService;
	
	@PostMapping(value="/upload" , consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
	public void fileUpload(
			@RequestPart("file") MultipartFile file, 
			@RequestPart("param") Map<String, String> param) throws Exception {
		String fileName = param.get("fileName");
		fileUploadService.saveFile(file, fileName);
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
}
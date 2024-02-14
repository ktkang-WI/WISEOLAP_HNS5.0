package com.wise.MarketingPlatForm.dataset.domain.upload.controller;

import java.io.PrintWriter;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.dataset.domain.upload.service.UploadDataService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "upload", description = "dataset과 관련된 요청을 처리합니다.")
@RestController
@RequestMapping("dataset/upload")
public class UploadController {

    private final UploadDataService uploadDataService;

    UploadController(UploadDataService uploadDataService) {
        this.uploadDataService = uploadDataService;
    }

    @Operation(summary = "get upload data column", description = "사용자가 업로드한 파일의 컬럼명과 타입을 가져온다.")
    @Parameters({
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = {
            @ExampleObject(name = "example", value = "")
    }))
    @PostMapping(value = "/upload-data-column")
    public void getUploadDataColumn(HttpServletRequest request, HttpServletResponse response) {
        
        response.setCharacterEncoding("utf-8");
        PrintWriter out = null;        
        
        try {
                
                out = response.getWriter();

                ArrayList<JSONObject> uploadDataColumnList = uploadDataService.getUploadDataColumnList(request);

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
    
}

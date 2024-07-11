package com.wise.MarketingPlatForm.log.controller;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.vo.RestAPIVO;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.global.util.SessionUtility;
import com.wise.MarketingPlatForm.log.service.LogService;
import com.wise.MarketingPlatForm.log.vo.ExportLogDTO;
import com.wise.MarketingPlatForm.log.vo.LogParamVO;
import com.wise.MarketingPlatForm.log.vo.LoginLogDTO;
import com.wise.MarketingPlatForm.log.vo.QueryLogDTO;
import com.wise.MarketingPlatForm.log.vo.ReportHisEntity;
import com.wise.MarketingPlatForm.log.vo.ReportHisSummaryDTO;
import com.wise.MarketingPlatForm.log.vo.ReportLogDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.tags.Tag;

// TODO: 추후 session User별 조회 기능 개발
@Tag(name = "log", description = "log과 관련된 요청을 처리합니다.")
@RestController
@RequestMapping("/log")
public class LogContoller {

    LogService logService;

    LogContoller(LogService logService) {
        this.logService = logService;
    }

    @Operation(summary = "get login log", description = "로그인 로그를 가져옵니다.")
    @Parameters({
            @Parameter(name = "startDt", description = "로그 검색 시작 구간", example = "20240520", required = true),
            @Parameter(name = "endDt", description = "로그 검색 끝 구간", example = "20240620", required = true),
            @Parameter(name = "type", description = "조회 타입. USER일 경우 현재 접속된 세션의 유저만 조회", example = "", required = false),
    })
    @GetMapping(value = "/login")
    public ResponseEntity<RestAPIVO> getLoginLog(
        HttpServletRequest request,
        @RequestParam(required = true) String startDt,
        @RequestParam(required = true) String endDt,
        @RequestParam(required = false, defaultValue = "") String type
    ) {
        String userId;
        try {
            userId = getUserId(type, request);
        } catch (NullPointerException e) {
            return RestAPIVO.unauthorizedResponse("세션이 존재하지 않습니다.");
        }

        LogParamVO logParamVO = new LogParamVO(startDt, endDt, userId);
        List<LoginLogDTO> result = logService.getLoginLog(logParamVO);

        return RestAPIVO.okResponse(result);
    }

    @Operation(summary = "get query log", description = "수행 쿼리 로그를 가져옵니다.")
    @Parameters({
            @Parameter(name = "startDt", description = "로그 검색 시작 구간", example = "20240520", required = true),
            @Parameter(name = "endDt", description = "로그 검색 끝 구간", example = "20240620", required = true),
            @Parameter(name = "type", description = "조회 타입. USER일 경우 현재 접속된 세션의 유저만 조회", example = "", required = false),
    })
    @GetMapping(value = "/query")
    public ResponseEntity<RestAPIVO> getQueryLog(
        HttpServletRequest request,
        @RequestParam(required = true) String startDt,
        @RequestParam(required = true) String endDt,
        @RequestParam(required = false, defaultValue = "") String type
    ) {
        String userId;
        try {
            userId = getUserId(type, request);
        } catch (NullPointerException e) {
            return RestAPIVO.unauthorizedResponse("세션이 존재하지 않습니다.");
        }

        LogParamVO logParamVO = new LogParamVO(startDt, endDt, userId);
        List<QueryLogDTO> result = logService.getQueryLog(logParamVO);

        return RestAPIVO.okResponse(result);
    }

    @Operation(summary = "get report log", description = "보고서 로그를 가져옵니다.")
    @Parameters({
            @Parameter(name = "startDt", description = "로그 검색 시작 구간", example = "20240520", required = true),
            @Parameter(name = "endDt", description = "로그 검색 끝 구간", example = "20240620", required = true),
            @Parameter(name = "type", description = "조회 타입. USER일 경우 현재 접속된 세션의 유저만 조회", example = "", required = false),
    })
    @GetMapping(value = "/report")
    public ResponseEntity<RestAPIVO> getReportLog(
        HttpServletRequest request,
        @RequestParam(required = true) String startDt,
        @RequestParam(required = true) String endDt,
        @RequestParam(required = false, defaultValue = "") String type
    ) {
        String userId;
        try {
            userId = getUserId(type, request);
        } catch (NullPointerException e) {
            return RestAPIVO.unauthorizedResponse("세션이 존재하지 않습니다.");
        }

        LogParamVO logParamVO = new LogParamVO(startDt, endDt, userId);
        List<ReportLogDTO> result = logService.getReportLog(logParamVO);

        return RestAPIVO.okResponse(result);
    }

    @Operation(summary = "get export log", description = "다운로드 로그를 가져옵니다.")
    @Parameters({
            @Parameter(name = "startDt", description = "로그 검색 시작 구간", example = "20240520", required = true),
            @Parameter(name = "endDt", description = "로그 검색 끝 구간", example = "20240620", required = true),
            @Parameter(name = "type", description = "조회 타입. USER일 경우 현재 접속된 세션의 유저만 조회", example = "", required = false),
    })
    @GetMapping(value = "/export")
    public ResponseEntity<RestAPIVO> getExportLog(
        HttpServletRequest request,
        @RequestParam(required = true) String startDt,
        @RequestParam(required = true) String endDt,
        @RequestParam(required = false, defaultValue = "") String type
    ) {
        String userId;
        try {
            userId = getUserId(type, request);
        } catch (NullPointerException e) {
            return RestAPIVO.unauthorizedResponse("세션이 존재하지 않습니다.");
        }

        LogParamVO logParamVO = new LogParamVO(startDt, endDt, userId);
        List<ExportLogDTO> result = logService.getExportLog(logParamVO);

        return RestAPIVO.okResponse(result);
    }

    @Operation(summary = "get Report History", description = "보고서 저장 기록을 가져옵니다.")
    @Parameters({
            @Parameter(name = "reportId", description = "보고서 ID", example = "0", required = true),
    })
    @GetMapping(value = "/report-history")
    public ResponseEntity<RestAPIVO> getReportHisList(
        HttpServletRequest request,
        @RequestParam(required = true) String reportId
    ) {
        List<ReportHisSummaryDTO> result = logService.getReportHistory(Integer.parseInt(reportId));

        return RestAPIVO.okResponse(result);
    }

    @Operation(summary = "insert export log", description = "다운로드 로그를 생성합니다.")
    @Parameters({
            @Parameter(name = "reportID", description = "보고서 ID", example = "1001", required = false),
            @Parameter(name = "reportNm", description = "보고서 명", example = "새 보고서", required = true),
            @Parameter(name = "reportType", description = "보고서 타입", example = "AdHoc", required = true),
            @Parameter(name = "ctrlId", description = "아이템 ID", example = "item1", required = false),
            @Parameter(name = "ctrlCaption", description = "아이템 명", example = "아이템1", required = false),
    })
    @PostMapping(value = "/export")
    public ResponseEntity<RestAPIVO> insertExportLog(
        HttpServletRequest request,
        @RequestBody Map<String, String> param
    ) {
        String reportId = param.getOrDefault("reportId", "1001");
        String reportNm = param.getOrDefault("reportNm", "New Report");
        String reportType = param.get("reportType");
        String ctrlId = param.getOrDefault("ctrlId", "");
        String ctrlCaption = param.getOrDefault("ctrlCaption", "");
        UserDTO user = SessionUtility.getSessionUser(request);
    
        if (user == null) {
            return RestAPIVO.unauthorizedResponse("세션이 존재하지 않습니다.");
        }

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
                .ctrlId(ctrlId)
                .ctrlCaption(ctrlCaption)
                .build();

        logService.insertExportLog(logDTO);

        return RestAPIVO.okResponse(true);
    }

    String getUserId(String type, HttpServletRequest request) {
        if ("USER".equals(type)) {
            UserDTO userDTO = SessionUtility.getSessionUser(request);

            if (userDTO == null) {
                throw new NullPointerException();
            }

            return userDTO.getUserId();
        }

        return "";
    }
    
}
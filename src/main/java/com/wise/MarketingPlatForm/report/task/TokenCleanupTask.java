package com.wise.MarketingPlatForm.report.task;

import java.io.File;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.wise.MarketingPlatForm.fileUpload.store.token.TokenStorage;
import com.wise.MarketingPlatForm.report.vo.ReportTokenDTO;

@Component
public class TokenCleanupTask {
    private final TokenStorage<ReportTokenDTO> tokenStorage;
    private static final Logger logger = LoggerFactory.getLogger(TokenCleanupTask.class);

    public TokenCleanupTask() {
        this.tokenStorage = new TokenStorage<>("report", ReportTokenDTO.class);
    }

    // 매월 1일 자정에 3개월 이상 접근하지 않은 토큰 삭제
    @Scheduled(cron = "0 0 0 1 * ?")
    public void cleanUpExpiredTokens() {
        tokenStorage.removeExpiredTokens(3);
    }
    // 1시간 지난 파일 삭제하는 메서드
    public void cleanOldFiles() {
        // 파일이 저장된 루트 디렉토리 경로
        File rootDirectory = new File(new File("UploadFiles"), "list_json_temp");

        // 1시간 = 3600000 밀리초
        long oneHourInMillis = 3600000;
        long currentTime = new Date().getTime();

        // 루트 디렉토리 내에 있는 서브 디렉토리들을 탐색
        if (rootDirectory.isDirectory()) {
            File[] directories = rootDirectory.listFiles(File::isDirectory);
            if (directories != null) {
                for (File subDirectory : directories) {
                    // 각 서브 디렉토리 내에서 JSON 파일 삭제
                    cleanJsonFiles(subDirectory, currentTime, oneHourInMillis);

                    // 서브 디렉토리가 비어 있으면 삭제
                    if (subDirectory.isDirectory() && subDirectory.list().length == 0) {
                        if (subDirectory.delete()) {
                            logger.debug("{} 디렉토리가 비어 있어서 삭제되었습니다.", subDirectory.getName());
                        } else {
                            logger.error("{} 디렉토리를 삭제하지 못했습니다.", subDirectory.getName());
                        }
                    }
                }
            }
        } else {
            logger.error("루트 디렉토리인 {}이 존재하지 않습니다.", rootDirectory.getPath());
        }
    }

    // 서브 디렉토리 내의 JSON 파일을 삭제하는 메서드
    private void cleanJsonFiles(File directory, long currentTime, long oneHourInMillis) {
        File[] jsonFiles = directory.listFiles(file -> file.isFile() && file.getName().endsWith(".tmp"));

        if (jsonFiles != null) {
            for (File jsonFile : jsonFiles) {
                long lastModifiedTime = jsonFile.lastModified();

                // JSON 파일이 1시간 이상 지났으면 삭제
                if (currentTime - lastModifiedTime > oneHourInMillis) {
                    if (jsonFile.delete()) {
                        logger.debug("{} 파일이 삭제되었습니다.", jsonFile.getName());
                    } else {
                        logger.error("{} 파일을 삭제하지 못했습니다.", jsonFile.getName());
                    }
                }
            }
        }
    }

    // 30분마다 파일 정리 작업을 실행하는 스케줄링 메서드
    @Scheduled(fixedRate = 1800000)  // 30분 = 1800000 밀리초
    public void scheduleFileCleanup() {
        logger.debug("파일 정리 작업 시작");
        cleanOldFiles();
        logger.debug("파일 정리 작업 종료");
    }
}

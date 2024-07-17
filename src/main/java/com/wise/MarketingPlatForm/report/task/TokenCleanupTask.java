package com.wise.MarketingPlatForm.report.task;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.wise.MarketingPlatForm.fileUpload.store.token.TokenStorage;
import com.wise.MarketingPlatForm.report.vo.ReportTokenDTO;

@Component
public class TokenCleanupTask {
    private final TokenStorage<ReportTokenDTO> tokenStorage;

    public TokenCleanupTask() {
        this.tokenStorage = new TokenStorage<>("report");
    }

    // 매월 1일 자정에 3개월 이상 접근하지 않은 토큰 삭제
    @Scheduled(cron = "0 0 0 1 * ?")
    public void cleanUpExpiredTokens() {
        tokenStorage.removeExpiredTokens(3);
    }
}

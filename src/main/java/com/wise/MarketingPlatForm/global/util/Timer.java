package com.wise.MarketingPlatForm.global.util;

import lombok.Getter;

@Getter
public class Timer {
    private long startTime;
    private long endTime;
    private String interval;

    public void start() {
        startTime = System.currentTimeMillis();
    }

    public void end() {
        endTime = System.currentTimeMillis();
        long diffMillis = endTime - startTime;
        setInterval(diffMillis);
    }

    private void setInterval(long diffMillis) {
        int seconds = (int) (diffMillis / 1000) % 60 ;
    	int minutes = (int) ((diffMillis / (1000 * 60)) % 60);
    	int hours   = (int) ((diffMillis / (1000 * 60 * 60)) % 24);
        
        interval = String.format("%02d:%02d:%02d.%03d", hours, minutes, seconds, diffMillis % 1000);
    }
}

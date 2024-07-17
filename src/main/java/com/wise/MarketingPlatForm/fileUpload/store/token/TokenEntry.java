package com.wise.MarketingPlatForm.fileUpload.store.token;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class TokenEntry<T> {
    private T value;
    @Getter
    private LocalDateTime lastAccessed;

    public TokenEntry(T value) {
        this.value = value;
        this.lastAccessed = LocalDateTime.now();
    }

    public void setValue(T value) {
        this.value = value;
        this.lastAccessed = LocalDateTime.now();
    }

    public T getValue() {
        this.lastAccessed = LocalDateTime.now();
        return value;
    }

    public void updateLastAccessed() {
        this.lastAccessed = LocalDateTime.now();
    }
}

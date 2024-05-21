package com.wise.MarketingPlatForm.utils;

@FunctionalInterface
public interface Function<T> {
  boolean execute(T o1, T o2);
}

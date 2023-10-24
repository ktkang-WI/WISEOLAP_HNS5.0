package com.wise.MarketingPlatForm.global.filter;

import java.util.LinkedList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public final class GenericDataResourceContext {
	
	private static ThreadLocal<Boolean> tlEnabled = new ThreadLocal<Boolean>() {
		@Override
		protected Boolean initialValue() {
	        return Boolean.FALSE;
	    }
	};

	private static ThreadLocal<List<AutoCloseable>> tlCloseableResources = new ThreadLocal<>();

	private GenericDataResourceContext() {
	}

	static void setEnabled(final boolean enabled) {
		tlEnabled.set(Boolean.valueOf(enabled));
	}

	public static boolean isEnabled() {
		return tlEnabled.get();
	}

	public static void add(final AutoCloseable closeableResource) {
		if (!isEnabled()) {
			return;
		}

		List<AutoCloseable> closeableResources = tlCloseableResources.get();

		if (closeableResources == null) {
			closeableResources = new LinkedList<>();
			tlCloseableResources.set(closeableResources);
		}

		closeableResources.add(closeableResource);
	}
	
	static void clear() {
		final List<AutoCloseable> closeableResources = tlCloseableResources.get();

		if (closeableResources != null) {
			for (AutoCloseable closeable : closeableResources) {
				try {
					closeable.close();
				} catch (Exception e) {
					log.error("Failed to close resource: " + closeable, e);
				}
			}
			closeableResources.clear();
		}
	}
}

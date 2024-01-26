package com.wise.MarketingPlatForm.report.domain.data.custom;

public class SetKey{
	private int columnIdCount;
	private String captionKey;
	private String key;
	private String expression;
	private boolean keyDuplicate;

	public int getColumnIdCount() {
		return columnIdCount;
	}
	public void setColumnIdCount(int columnIdCount) {
		this.columnIdCount = columnIdCount;
	}
	public String getCaptionKey() {
		return captionKey;
	}
	public void setCaptionKey(String captionKey) {
		this.captionKey = captionKey;
	}
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	public String getExpression() {
		return expression;
	}
	public void setExpression(String expression) {
		this.expression = expression;
	}
	public boolean isKeyDuplicate() {
		return keyDuplicate;
	}
	public void setKeyDuplicate(boolean keyDuplicate) {
		this.keyDuplicate = keyDuplicate;
	}
}
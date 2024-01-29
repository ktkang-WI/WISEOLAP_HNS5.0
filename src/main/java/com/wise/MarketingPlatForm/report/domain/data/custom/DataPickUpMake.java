package com.wise.MarketingPlatForm.report.domain.data.custom;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ExecutionException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.item.pivot.aggregator.ExpressionEngine;

public class DataPickUpMake {
    private List<Map<String, Object>> ods;
    private List<SetKey> setKeys = new ArrayList<>();
    private List<SetKey> setMeaAndDimKeys = new ArrayList<>();

    public DataPickUpMake(List<Map<String, Object>> ods) {
        this.ods = ods;
    }

    private static String generateRandomKey(int wordLength) {
	    Random r = new Random();
	    StringBuilder sb = new StringBuilder(wordLength);
	    for(int i = 0; i < wordLength; i++) { 
	        char tmp = (char) ('a' + r.nextInt('z' - 'a'));
	        sb.append(tmp); 
	    }
	    return sb.toString();
	}
    
    private SetKey createInstanceKey(String key, String expression) {
        SetKey tempSetKey = new SetKey();
        
        for (SetKey setKey : setKeys) {
            if (setKey.getCaptionKey().equals(key)) {
            	tempSetKey.setKeyDuplicate(true);
                tempSetKey.setColumnIdCount(setKey.getColumnIdCount() + 1);
                tempSetKey.setKey(key);
                tempSetKey.setCaptionKey(String.format("%s_%s", key, setKey.getColumnIdCount()));
                tempSetKey.setExpression(expression);
                
                return tempSetKey;
            }
        }

        tempSetKey.setKey(key);
        tempSetKey.setCaptionKey(key);
        tempSetKey.setColumnIdCount(1);
        tempSetKey.setExpression(expression);
        
        return tempSetKey;
    }
    
    private List<String> extractingExpression(String regex ,String expression) {
    	
    	Pattern pattern = Pattern.compile(regex);
    	Matcher matcher = pattern.matcher(expression);
    	List<String> result = new ArrayList<>();
    	
    	while(matcher.find()) {
    		result.add(matcher.group());
    	}
    	
		return result;
    }

    private void setKeysAdd(String key, String expression) {
        SetKey tempSetKey = createInstanceKey(key, expression);
        setKeys.add(tempSetKey);
    }

    private void generateColumn(String key, String expression) {
        if (key == null || key.isEmpty()) {
            throw new NullPointerException("key 값이 null 입니다.");
        }
        setKeysAdd(key, expression);
    }

    private Object evaluateExpression(String expression, Map<String, Object> odsMap) {
    	List<String> extractedKeys = extractingExpression("\\[.*?\\]",expression);
    	Map<String,Object> context = new HashMap<>();
    	ExpressionEngine expressionEngine = new ExpressionEngine();
    	Object getValueFromOds = null;
    	Object result = null;
    	
    	//init
    	expression = expression.replaceAll("(?<=\\(|,)(\\d+)(?=\\)|,)", "'$1'");
    	

    	for(String key : extractedKeys) {
        	String matchKey = null;
        	{
        		matchKey = generateRandomKey(5);
        	}
        	while(context.containsKey(matchKey));
            
        	getValueFromOds = odsMap.get(key.replaceAll("\\[|\\]", ""));
        	context.put(matchKey, getValueFromOds);
        	expression = expression.replace(key, matchKey);
        		
        }
        result = expressionEngine.evaluate(context, expression, 0);
		result = exceptionHandler(getValueFromOds,result);

		return result;
    }
    
    private Object exceptionHandler(Object value,Object calcValue){

    	try {
    		if(calcValue.equals(0) && value instanceof String) {
    			
    			if(Integer.valueOf(String.valueOf(calcValue)) == 0) {
    				return calcValue;
    			} else {
    				throw new ExecutionException("문자열은 사칙연산을 할수 없습니다.", null);
    			}
        	}
    	} catch (ExecutionException e) {
    		e.printStackTrace();
    	}
    	
    	

		return calcValue;
    }
    
    private Map<String, Object> getData(SetKey setKey, Map<String, Object> odsMap){
        Map<String, Object> temp = new HashMap<>();
        String key = null;
        Object value = null;
        
        // key setting
        if (setKey.isKeyDuplicate()) {
            key = setKey.getCaptionKey();
                
        } else {
            key = setKey.getKey();
        }

        // value setting
        if (setKey.getExpression() == null) {
        	value = odsMap.get(setKey.getKey());
        } else {
        	value = evaluateExpression(setKey.getExpression(), odsMap);
        }
        
        temp.put(key, value);
        
		return temp;
    }


    private Map<String, Object> getDataRow(Map<String, Object> odsMap){
    	Map<String, Object> temp = new HashMap<>();
    	
    	for (SetKey setKey : setKeys) {
    		String key = setKey.getCaptionKey();
    		Object value = getData(setKey, odsMap).get(key);
    		temp.put(key, value);
        }
    	return temp;
    }
    
    public DataPickUpMake getColumn(String key) {
        generateColumn(key, null);
        return this;
    }

    public DataPickUpMake getColumn(String key, String expression) {
        generateColumn(key, expression);
        return this;
    }

    public DataPickUpMake getColumns(List<SetKey> keys) {
    	for (SetKey key : keys) {
    		generateColumn(key.getKey(), key.getExpression());
    	}
    	return this;
    }

    public DataPickUpMake setMeasure(List<Measure> measures) {
        SetKey tempKey = null;
        for (Measure measure : measures) {
            tempKey = new SetKey();
            tempKey.setKey(measure.getSummaryName());
            if(measure.getExpression() != null) {
                String expression = measure.getExpression();
                for (Measure replace : measures) {
                    if (replace.getExpression() != null) continue;
                    expression = expression.replaceAll(replace.getName(), replace.getSummaryName());
                }
                tempKey.setExpression(expression);
            }
            else{
                tempKey.setExpression(null);
            }
            setMeaAndDimKeys.add(tempKey);
        }
        return this;
    }

    public DataPickUpMake setDimension(List<Dimension> dimensions) {
        SetKey tempKey = null;
        for (Dimension dimension : dimensions) {
            tempKey = new SetKey();
            tempKey.setKey(dimension.getName());
            tempKey.setExpression(null);
            setMeaAndDimKeys.add(tempKey);
        }
        return this;
    } 
    
    // 데이터 계산처리
    public List<Map<String, Object>> builder() {

        if (setMeaAndDimKeys.size() != 0) {
            getColumns(setMeaAndDimKeys);
        }
        
        if (setKeys.size() == 0) return null;

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> odsMap : ods) {
        	result.add(getDataRow(odsMap));
        }
        return result;
    }

    public List<Map<String, Object>> executer(List<Dimension> dimensions, List<Measure> measures) {
        List<Map<String, Object>> tempData = null;
        List<Measure> distinctMeasures = new ArrayList<>();
        List<String> uniqueKeys = new ArrayList<>();
        measures.stream().forEach(item -> {
            if (!uniqueKeys.contains(item.getSummaryName())) {
                distinctMeasures.add(item);
                uniqueKeys.add(item.getSummaryName());
            }
        });
        try {
            tempData = setDimension(dimensions).
                       setMeasure(distinctMeasures).
                       builder();
        } catch (Exception e) {
            e.printStackTrace();
            tempData = null;
        }

        return tempData;
    }   
}
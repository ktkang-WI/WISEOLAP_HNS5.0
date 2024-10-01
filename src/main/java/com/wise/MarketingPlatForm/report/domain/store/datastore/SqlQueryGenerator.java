package com.wise.MarketingPlatForm.report.domain.store.datastore;

import java.util.List;

import org.apache.poi.util.StringUtil;

import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Parameter;
import com.wise.MarketingPlatForm.report.domain.store.QueryGenerator;

public class SqlQueryGenerator implements QueryGenerator {

    @Override
    public String getQuery(DataAggregation dataAggregation) {
        return getQuery(dataAggregation, "");
    }

    @Override
    public String getQuery(DataAggregation dataAggregation, String ownerNm) {
        String userId = dataAggregation.getUserId() == null ? "" : dataAggregation.getUserId();
        String query = dataAggregation.getDataset().getQuery().replace("[WI_SESSION_ID]", "'" + userId + "'");
        query = applyParameter(dataAggregation.getParameters(), query);

        return query;
    }

    String getValue(String value, String type, String format) {
        if (type.equals("NUMBER")) {
            return value;
        }
        if (type.equals("DATE")) {
            if (format.length() == 0) {
                switch (value.length()) {
                    case 4:
                        format = "YYYY";
                        break;
                    case 6:
                        format = "YYYYMM";
                        break;
                    case 8:
                        format = "YYYYMMDD";
                        break;
                    case 7:
                        format = "YYYY-MM";
                        break;
                    case 10:
                        format = "YYYY-MM-DD";
                        break;
                    default:
                        format = "YYYYMMDD";
                        break;
                }
            }
            // TODO: 현재는 오라클 기준. 추후 다른 DB 추가 필요
            return "TO_DATE(\'" + value + "\', \'" + format.toUpperCase() + "\')";
        }
        return "\'" + value + "\'";
    }

    @Override
    public String applyParameter(List<Parameter> parameters, String query) {
        for (Parameter param : parameters) {
            String operation = param.getOperation();
            String result = "";
            List<String> values = param.getValues();
            String dataType = param.getDataType();
            String format = param.getFormat();
            if ("EQUALS".equals(operation)) {
                if (validateValue(values, 0)) {
                    result = getValue(param.getValues().get(0), dataType, format);
                } else {
                    result = param.getExceptionValue();
                }

            } else if ("IN".equals(operation) || "NOT_IN".equals(operation)) {
                if (validateValue(values, 0)) {
                    // 입력 문자열을 가져와 쉼표와 공백을 기준으로 분리
                    String[] items = param.getValues().get(0).split("\\s*,\\s*");
                    StringBuilder sb = new StringBuilder();

                    for (String val : items) {
                        getValue(val.trim(), dataType, format);
                    }

                    // 마지막 쉼표와 공백 제거
                    if (sb.length() > 0) {
                        sb.setLength(sb.length() - 2);
                    }

                    result = sb.toString();
                } else {
                    result = param.getExceptionValue();
                }
            } else if ("BETWEEN".equals(operation)) {
                if (validateValue(values, 0)) {
                    result = getValue(param.getValues().get(0), dataType, format);
                    ;
                } else {
                    result = param.getExceptionValue();
                }

                result += " AND ";

                if (validateValue(values, 1)) {
                    result += getValue(param.getValues().get(1), dataType, format);
                } else {
                    result += param.getExceptionValue();
                }
            }

            query = query.replaceAll(param.getName() + "\\b", result);
        }

        return query;
    }

    private boolean validateValue(List<String> values, int index) {
        return values.size() > index && StringUtil.isNotBlank(values.get(index)) &&
                !values.get(index).equals("[All]");
    }

}

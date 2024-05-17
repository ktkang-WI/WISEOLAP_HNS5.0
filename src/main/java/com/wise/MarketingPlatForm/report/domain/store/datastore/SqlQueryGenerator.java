package com.wise.MarketingPlatForm.report.domain.store.datastore;

import java.util.List;

import org.apache.poi.util.StringUtil;

import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Parameter;
import com.wise.MarketingPlatForm.report.domain.store.QueryGenerator;

public class SqlQueryGenerator implements QueryGenerator {

    @Override
    public String getQuery(DataAggregation dataAggreagtion) {
        String query = dataAggreagtion.getDataset().getQuery();
        query = applyParameter(dataAggreagtion.getParameters(), query);

        return query;
    }

    @Override
    public String applyParameter(List<Parameter> parameters, String query) {
        for (Parameter param : parameters) {
            String operation = param.getOperation();
            String result = "";
            List<String> values = param.getValues();
            if ("EQUALS".equals(operation)) {
                if (validateValue(values, 0)) {
                    result = "\'" + param.getValues().get(0) + "\'";
                } else {
                    result = param.getExceptionValue();
                }

            } else if ("IN".equals(operation) || "NOT_IN".equals(operation)) {
                if (validateValue(values, 0)) {
                    String[] items = param.getValues().get(0).split(", ");
                    StringBuilder sb = new StringBuilder();

                    for (String val : items) {
                        sb.append("\'");
                        sb.append(val);
                        sb.append("\', ");
                    }

                    result = sb.toString();
                    result = result.substring(0, result.length() - 2);
                } else {
                    result = param.getExceptionValue();
                }
            } else if ("BETWEEN".equals(operation)) {
                if (validateValue(values, 0)) {
                    result = "\'" + param.getValues().get(0) + "\'";
                } else {
                    result = param.getExceptionValue();
                }

                result += " AND ";

                if (validateValue(values, 1)) {
                    result += "\'" + param.getValues().get(1) + "\'";
                } else {
                    result += param.getExceptionValue();
                }
            }

            query = query.replaceAll(param.getName(), result);
        }

        return query;
    }

    private boolean validateValue(List<String> values, int index) {
        return values.size() > index && StringUtil.isNotBlank(values.get(index)) &&
                !values.get(index).equals("[All]");
    }

}

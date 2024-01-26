package com.wise.MarketingPlatForm.report.domain.item.pivot.aggregator;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.WeakHashMap;

import org.apache.commons.collections4.Transformer;
import org.apache.commons.collections4.map.LazyMap;
import org.apache.commons.jexl3.JexlBuilder;
import org.apache.commons.jexl3.JexlContext;
import org.apache.commons.jexl3.JexlEngine;
import org.apache.commons.jexl3.JexlExpression;
import org.apache.commons.jexl3.MapContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.report.domain.item.pivot.aggregator.util.PivotFunctions;

@Service
public class ExpressionEngine {

    private static Logger log = LoggerFactory.getLogger(ExpressionEngine.class);

    private JexlEngine jexl;

    private Map<String, JexlExpression> expressionsCache = Collections.synchronizedMap(new WeakHashMap<>());

    public ExpressionEngine() {
        final Map<String, Object> globalNamespace = new HashMap<>();
        globalNamespace.put(null, new PivotFunctions());

        jexl = new JexlBuilder().permissions(null).namespaces(globalNamespace).create();
    }

    public JexlEngine getJexl() {
    	return jexl;
    }

    public Object evaluate(final Map<String, Object> context, final String expression,
            final Object defaultValue) {
        Object ret = null;

        try {
            JexlExpression expr = expressionsCache.get(expression);
            if (expr == null) {
                expr = jexl.createExpression(expression);
                expressionsCache.put(expression, expr);
            }

            final JexlContext jexlContext = context != null ? new MapContext(context)
                    : new MapContext();

            jexlContext.set("True", true);
            jexlContext.set("False", false);

            final Map<String, Object> fields = LazyMap.lazyMap(new HashMap<>(),
                    new Transformer<String, Object>() {
                        @Override
                        public Object transform(String fieldName) {
                            return jexlContext.has(fieldName) ? jexlContext.get(fieldName) : null;
                        }
                    });

            jexlContext.set("_fields", fields);

            ret = expr.evaluate(jexlContext);
        }
        catch (Exception e) {
            log.warn("Error occurred while evaluating an expression: {}", expression, e);
        }

        return ret != null ? ret : defaultValue;
    }
}

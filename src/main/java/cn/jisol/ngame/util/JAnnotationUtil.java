package cn.jisol.ngame.util;

import org.springframework.core.annotation.AnnotationUtils;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Objects;

public class JAnnotationUtil {
    public static <A extends Annotation> Method[] findMethods(Method[] methods, Class<A> annotation){
        return (new ArrayList<Method>(){
            {
                for (Method method : methods) {
                    if (Objects.nonNull(AnnotationUtils.findAnnotation(method, annotation))){
                        add(method);
                    }
                }
            }
        }).toArray(new Method[0]);
    }
    public static boolean vRunMethod(Object object, Method method, Object[] args){
        Class<?>[] types = method.getParameterTypes();

        Object[] values = new Object[types.length];

        for (int i = 0; i < types.length; i++) {
            for (Object arg : args) {
                if(arg.getClass().isAssignableFrom(types[i]))
                    values[i] = arg;
            }
        }

        try {
            method.invoke(object,values);
            return true;
        } catch (Exception e) {
            return false;
        }

    }
}

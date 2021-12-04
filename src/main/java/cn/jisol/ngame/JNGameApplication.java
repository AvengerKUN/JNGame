package cn.jisol.ngame;

import cn.hutool.json.JSONUtil;
import cn.jisol.ngame.spring.SpringBeanUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@SpringBootApplication
public class JNGameApplication {
    public static void main(String[] args) {
        ApplicationContext applicationContext = SpringApplication.run(JNGameApplication.class);
        SpringBeanUtils.setContext(applicationContext);
    }
}

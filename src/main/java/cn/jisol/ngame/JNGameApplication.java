package cn.jisol.ngame;

import cn.jisol.ngame.util.spring.SpringBeanUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class JNGameApplication {
    public static void main(String[] args) {
        ApplicationContext applicationContext = SpringApplication.run(JNGameApplication.class);
        SpringBeanUtils.setContext(applicationContext);
    }
}

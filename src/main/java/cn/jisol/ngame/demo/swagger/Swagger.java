package cn.jisol.ngame.demo.swagger;

import io.swagger.annotations.ApiOperation;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2WebMvc;

@Configuration
@EnableSwagger2WebMvc
public class Swagger {

    @Bean(value = "defaultApi")
    public Docket defaultApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                //分组名称
                .groupName("Game Open")
                .select()
                //这里指定Controller扫描包路径
//                .apis(RequestHandlerSelectors.basePackage("com.github.xiaoymin.knife4j.controller"))
                //这里指定扫描有ApiOperation注解的类
                .apis(RequestHandlerSelectors.withMethodAnnotation(ApiOperation.class))
                //所有路径
                .paths(PathSelectors.any())
                //不包含^/inner/.*的路径
                //.paths(input -> !input.matches("^/inner/.*"))
                .build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("Game Open APIs")
                .description("Game Open APIs")
                .version("1.0")
                .build();
    }
}

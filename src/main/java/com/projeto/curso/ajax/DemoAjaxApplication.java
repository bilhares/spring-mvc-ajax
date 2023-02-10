package com.projeto.curso.ajax;

import java.util.Locale;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.FixedLocaleResolver;

@SpringBootApplication
public class DemoAjaxApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(DemoAjaxApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		System.out.println("INIT RUN");
	}

	@Bean
	public LocaleResolver localeResolver() {
		return new FixedLocaleResolver(new Locale("pt", "BR"));
	}

}

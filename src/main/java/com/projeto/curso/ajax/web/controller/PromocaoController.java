package com.projeto.curso.ajax.web.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.projeto.curso.ajax.domain.Categoria;
import com.projeto.curso.ajax.domain.Promocao;
import com.projeto.curso.ajax.repository.CategoriaRepository;
import com.projeto.curso.ajax.repository.PromocaoRepository;

@Controller
@RequestMapping("/promocao")
public class PromocaoController {

	private static Logger log = LoggerFactory.getLogger(PromocaoController.class);

	@Autowired
	CategoriaRepository categoriaRepository;

	@Autowired
	PromocaoRepository promocaoRepository;

	@ModelAttribute("categorias")
	public List<Categoria> getCategorias() {
		return categoriaRepository.findAll();
	}

	@GetMapping("/add")
	public String abrirCadastro() {
		return "promo-add";
	}

	@PostMapping("/save")
	public ResponseEntity<?> salvarPromocao(@Valid Promocao promocao, BindingResult result) {
		if (result.hasErrors()) {
			Map<String, String> errors = new HashMap<String, String>();
			for (FieldError error : result.getFieldErrors()) {
				errors.put(error.getField(), error.getDefaultMessage());
			}

			return ResponseEntity.unprocessableEntity().body(errors);
		}

		log.info("Promocao {}", promocao.toString());

		promocao.setDtCadastro(LocalDateTime.now());
		promocaoRepository.save(promocao);

		return ResponseEntity.ok().build();
	}

}

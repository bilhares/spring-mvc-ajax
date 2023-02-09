
DROP TABLE IF EXISTS categorias;
CREATE TABLE categorias (
  id BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1),
  titulo varchar(255) NOT NULL unique
)

INSERT INTO categorias VALUES ('Informatica'),('Cursos'),('Eletrodomésticos'),('Eletronicos'),('Livros'),('Móveis'),('Cama, Mesa e Banho');

DROP TABLE IF EXISTS promocoes;
CREATE TABLE promocoes (
  id BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1),
  descricao varchar(255) DEFAULT NULL,
  data_cadastro datetime DEFAULT NULL,
  total_likes int DEFAULT 0,
  link_imagem varchar(255) DEFAULT NULL,
  link_promocao varchar(255) NOT NULL,
  preco_promocao decimal(19,2) NOT NULL,
  site_promocao varchar(255) NOT NULL,
  titulo varchar(255) NOT NULL,
  categoria_fk bigint NOT NULL  FOREIGN  KEY REFERENCES categorias(id)
)
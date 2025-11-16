## Configuration du Backend (Spring Boot)

Le backend utilise Spring Boot avec un fichier de configuration `application.yml`.
Avant de lancer l'application, vous devez adapter les informations de connexion à MySQL.

### configuration `application.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/nom_de_la_base
    username: mon_username
    password: mon_password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect

server:
  port: 8080
  servlet:
    context-path: /api

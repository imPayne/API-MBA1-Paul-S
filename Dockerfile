# Utilise l'image officielle MySQL 8 comme base
FROM mysql:8

# Définit les variables d'environnement pour configurer MySQL
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=database_development
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=password

# Expose le port MySQL
EXPOSE 3306

# Commande par défaut pour lancer MySQL
CMD ["mysqld"]

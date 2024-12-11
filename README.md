# API-MBA1-Paul-S
projet api M1 2024


## Pour lancer le projet vous devez lancer le contenaire docker
docker compose up -d

## Lancer le back express 
node app.js

## Ensuite après que votre conteneur et le back-end soit lancé vous devrez run les migrations
npx sequelize-cli db:migrate

## Run le Seeder
npx sequelize-cli db:seed:all

git checkout master
git pull origin master
docker-compose build apis
docker-compose --profile dev up -d
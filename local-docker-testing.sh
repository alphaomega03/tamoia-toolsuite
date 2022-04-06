tag=basic-express
expressAppRoute=hello
# server.js has a single route, but your code could have multiple that you want to test, so change above accordingly

docker build . -t $tag -f Dockerfile.local
# https://docs.docker.com/engine/reference/commandline/build/#specify-a-dockerfile--f

docker images

docker run -p 49160:8080 -d $tag

curl -i localhost:49160/$expressAppRoute

# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
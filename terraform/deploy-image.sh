# setting container image variables
REGION=us-east1
PROJECT_ID=tamoia-toolsuite-prototype
ARTIFACT_REGISTRY_REPO_NAME=nodejs-containers
IMAGE_NAME=basic-express-container

# only provisioning artifact registry repo and required APIs
terraform apply -target google_artifact_registry_repository.nodejs-containers --auto-approve

# "Before you can push or pull images, configure Docker to use the gcloud command-line tool to authenticate requests to Artifact Registry."
gcloud auth configure-docker us-east1-docker.pkg.dev
# https://cloud.google.com/artifact-registry/docs/docker/quickstart#auth

# building the container image from it's source directory is just easier and not as error prone...
cd ../src

# this dockerfile is different from the one we'll be using in Cloud Build for our Continuous Delivery 
DOCKERFILE_PATH=Dockerfile.local
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/#creating-a-dockerfile

# building container image
docker build -t $REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REGISTRY_REPO_NAME/$IMAGE_NAME:latest . -f ${DOCKERFILE_PATH}

# pushing container image
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REGISTRY_REPO_NAME/$IMAGE_NAME:latest

# returning to directory where this bash script is in
cd ../terraform
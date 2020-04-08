# To build and run the image from this Dockerfile, where x is the name of the worker node's JS file name
# docker build -t worker:x -f ./.Dockerfile .
# docker run -it --rm --name worker-smth worker:
# 
# Why the server needs to be built first before the image is built:
#   - For performance and image size reasons, the code is built locally first before being sent to the daemon for building the image.
#   - Building can be done on the image but since it will be on top of the image running on the daemon it adds additional performance overhead.
# 
# Why is RUN used and why they are split up:
#   - Use RUN instruction to install packages required by executing commands on top of the current image to create a new layer by committing the results.
#   - The RUN commands are all split them up as different ephemeral intermmediate images to optimize the build process for caching


# Maybe alpine is causing the issue with the C++ addons? But we install g++ alr right? perhaps we can re write this with ubuntu and see if it works
FROM node:10-alpine

# Set the working directory of . from here on to be /app
WORKDIR /app

# Copy both package.json and package-lock.json in for installing dependencies with "npm ci"
COPY package*.json ./

# Increase the max memory limit of the node js process to 4GB
ENV NODE_OPTIONS --max-old-space-size=4096

# Install items and build tools needed to install the npm packages
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
        git

# Install all production Node JS dependencies using the lock file for a deterministic dependency list
# Delete .gyp files after installation
RUN npm ci --only=production && apk del .gyp

# Read the expected build-time variable workerName passed in from the build command or via docker-compose.yml
ARG workerName

# Use given ARG to set ENV value to keep using this value in container run stage and not just build stage
# If not overwritten, this value will be available to the running containers
# Reference - https://vsupalov.com/docker-arg-env-variable-guide/#setting-arg-values
ENV workerNameENV=$workerName

# Only copy the final webpack build output file into WORKDIR for executing
COPY ./build/${workerNameENV}.js .

# ENTRYPOINT Command ensures this command runs when the container is spun up, and cannot be overwritten with shell arguements like CMD
# Use shell form to get the shell to process/intepret the commands instead of calling the executable directly to use the ENV value
# exec form does not have the shell's ability to intepret the workerNameENV, thus can't be used
ENTRYPOINT npm run start:${workerNameENV}

# Below is an attempt to use exec form with ENTRYPOINT
# Does not work
# ENTRYPOINT ["npm", "run"]
# CMD start:${workerNameENV}

# Rmb to squash the image too
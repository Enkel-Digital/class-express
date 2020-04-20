# To build and run the image from this Dockerfile, where x is the name of the worker node's JS file name
# docker build -t ce-core -f ./.Dockerfile .
# docker run -d --rm --name ce-core ce-core
# Alternativly, use docker compose in root to run this service
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

# Install all production Node JS dependencies using the lock file for a deterministic dependency list
RUN npm ci --only=production

# Copy source files into current WORKDIR's src/
COPY ./src/ ./src/

# Define exposed ports, acting only as documentation. You STILL need to map the ports with -p option with docker run
EXPOSE 2090

# ENTRYPOINT Command ensures this command runs when the container is spun up, and cannot be overwritten with shell arguements like CMD
# Using exec form instead of shell form
ENTRYPOINT ["npm", "run", "start"]

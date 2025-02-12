# Stage 1: Build the Angular app
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# Build the application
RUN npm run build --prod

# Stage 2: Serve the Angular app using Nginx
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=build /app/dist/task-manager /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

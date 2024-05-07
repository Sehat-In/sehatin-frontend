# Use the official Node.js 20 image as the base image
FROM node:20

# Create and set the working directory
WORKDIR /

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the application will run on
EXPOSE 3000

ARG NODE_ENV
ARG NEXT_PUBLIC_API_URL

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL ${NEXT_PUBLIC_API_URL}
# Add other environment variables as needed

# Build the Next.js application
RUN npm run build

# Start the application
CMD ["npm", "start"]
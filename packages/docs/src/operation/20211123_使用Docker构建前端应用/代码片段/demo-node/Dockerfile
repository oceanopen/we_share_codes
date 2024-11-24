FROM node:latest
LABEL maintainer "***@***.com"

COPY package.json .
RUN npm install
COPY . .

EXPOSE 8000
CMD ["npm", "start"]
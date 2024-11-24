# docker 构建+部署

FROM node:latest as builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

ENV NODE_ENV production
RUN npm run build

FROM nginx:latest
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

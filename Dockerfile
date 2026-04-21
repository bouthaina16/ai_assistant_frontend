FROM node:22.12-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm i

RUN npm i -g @angular/cli@17

COPY . .

RUN ng build --configuration=production

FROM nginx:1.27

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build app/dist/stok-web/browser /usr/share/nginx/html

EXPOSE 80

#docker build -t stok-web .
#docker run -d --restart unless-stopped --name stok-web -p 8888:80 stok-web

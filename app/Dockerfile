FROM node:18.19.0-alpine as builder
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app/
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_WS_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV REACT_APP_WS_BASE_URL=$REACT_APP_WS_BASE_URL
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
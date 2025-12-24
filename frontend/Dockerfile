FROM node:18-alpine as build

WORKDIR /app

COPY package.json package-lock.json* bun.lockb* ./

RUN if [ -f bun.lockb ]; then npm install -g bun && bun install; else npm install; fi

# Ensure the frontend uses a relative API base (proxied by nginx)
ENV VITE_API_BASE_URL=/api

COPY . .

RUN if [ -f bun.lockb ]; then bun run build; else npm run build; fi

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
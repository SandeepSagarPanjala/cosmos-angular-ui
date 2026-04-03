FROM node:20-alpine as build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist/angular/browser /usr/share/nginx/html

# CMD ["tail", "-f", "/dev/null"]
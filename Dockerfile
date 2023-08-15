FROM node:16.18.1-alpine

WORKDIR /src

COPY / .

RUN rm package-lock.json
RUN npm cache clear --force
RUN npm install --prefer-dedupe -f
RUN export NODE_OPTIONS=--openssl-legacy-provider & npm run build

RUN npm install -g serve
EXPOSE 3000

CMD ["serve", "-s", "build"]

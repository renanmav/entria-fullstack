FROM node:8

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
RUN yarn

COPY . /app

ENV NODE_ENV=development

CMD ["yarn", "start"]

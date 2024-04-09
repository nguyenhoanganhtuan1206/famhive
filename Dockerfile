FROM node:20-slim AS dist
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . ./
RUN yarn build:prod

FROM node:20-slim AS node_modules
COPY package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile

FROM node:20-slim
ARG PORT=80
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY --from=dist dist /usr/src/app/dist
COPY --from=node_modules node_modules /usr/src/app/node_modules
COPY . /usr/src/app

EXPOSE $PORT

CMD [ "yarn", "start:prod" ]

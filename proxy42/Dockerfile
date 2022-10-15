FROM node:18

RUN npm install -g npm && \
apt update

WORKDIR /usr/src/app

COPY . .

RUN yarn install

CMD yarn start
FROM node

RUN mkdir -p /home/app

WORKDIR /home/app

COPY Backend/.env /home/app/.env

COPY package.json package-lock.json .

RUN npm install

COPY . /home/app

CMD ["node","Backend/app.js"]


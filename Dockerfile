FROM node

RUN mkdir -p /home/app

COPY . /home/app

COPY Backend/.env /home/app/.env


WORKDIR /home/app

RUN npm install

CMD ["node","Backend/app.js"]


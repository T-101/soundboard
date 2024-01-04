FROM python:3.12.1-alpine3.19

ENV PYTHONUNBUFFERED 1

RUN mkdir /app
WORKDIR /app

RUN apk update \
    && apk add gcc python3-dev musl-dev \
	&& apk add nano tzdata bash \
    && apk add zlib-dev jpeg-dev

# to change this default, build using --build-arg timezone=Something/Else
ARG timezone=Europe/Helsinki
ENV TZ=${timezone}

COPY requirements.txt /app/
RUN pip install -r requirements.txt

RUN touch /root/.bashrc \
    && echo 'alias ll="ls -lap"' > /root/.bashrc

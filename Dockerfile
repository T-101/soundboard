FROM python:3.10.1-alpine3.15
ENV PYTHONUNBUFFERED 1
RUN apk update \
    && apk add gcc python3-dev musl-dev \
	&& apk add nano tzdata bash \
    && apk add zlib-dev jpeg-dev
RUN cp /usr/share/zoneinfo/Europe/Helsinki /etc/localtime
RUN echo "Europe/Helsinki" > /etc/timezone
RUN mkdir /app
WORKDIR /app
COPY requirements.txt /app/
RUN pip install -r requirements.txt
COPY . /app/

RUN touch /root/.bashrc \
    && echo 'alias ll="ls -lap"' > /root/.bashrc

CMD ["/bin/sh", "-c", "gunicorn config.wsgi --timeout 600 -w 2 -b 0.0.0.0:8000"]

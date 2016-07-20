FROM ubuntu:14.04
MAINTAINER Ignacio Millán <ignacio.millan@bq.com>
RUN apt-get update && apt-get install -y python-pip git
COPY src /usr/local/src
RUN pip install -r /usr/local/src/requirements.txt

EXPOSE 80
WORKDIR /usr/local/src
ENTRYPOINT ["python","webapp.py"]

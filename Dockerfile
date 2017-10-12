FROM python:2-alpine
COPY src /usr/local/src
RUN pip install -r /usr/local/src/requirements.txt

EXPOSE 80
WORKDIR /usr/local/src
ENTRYPOINT ["python","webapp.py"]

#FROM python:3.9
#WORKDIR /app
#COPY notifier.py .
#RUN pip install flask
#CMD ["python", "notifier.py"]
FROM python:3.9

WORKDIR /app

COPY notifier.py .
COPY requirements.txt .

RUN pip install -r requirements.txt

CMD ["python", "notifier.py"]


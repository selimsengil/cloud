FROM python:3.12-alpine

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

RUN chgrp -R 0 /app && chmod -R g=u /app

USER app

ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
EXPOSE 5000

CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]

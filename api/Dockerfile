FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ /app/src/
ENV PYTHONPATH=/app/src

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]

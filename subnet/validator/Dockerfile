FROM python:3.10-slim

WORKDIR /code

COPY . /code
# COPY ./requirements.txt /code/requirements.txt
# COPY ./setup.py /code/setup.py

RUN python -m pip install -e .


CMD ["python", "main.py"]

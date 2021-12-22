from python:3.8

ENV PYTHONUNBUFFERED 1

RUN mkdir /backend
WORKDIR /backend
RUN pip install pip -U -i https://pypi.tuna.tsinghua.edu.cn/simple
ADD requirements.txt /backend/
RUN pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
ADD . /backend/
EXPOSE 5000
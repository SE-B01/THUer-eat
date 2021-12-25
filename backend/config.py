import os
import uuid
import configparser

ip_address = "https://thuer-eat.whiteffire.cn:5000"

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql://root:123456@152.136.200.218:3306/THUer-eat'
    SQLALCHEMY_TRACK_MODIFICATIONS = True

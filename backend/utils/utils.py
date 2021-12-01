from sklearn.decomposition import NMF
import numpy as np

def img2blob(addr):
    f = open("./test.jpg", 'rb')
    img = f.read()
    f.close()
    return img





def img2blob(addr):
    f = open("./test.jpg", 'rb')
    img = f.read()
    f.close()
    return img



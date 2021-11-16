from model import Dish

def test_database():
    dish = Dish.query.first()
    print(dish)
    return dish
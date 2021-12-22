from sklearn.decomposition import NMF
import numpy as np
from ..db import db
from ..canteen.models import Canteen
from ..dish.models import Dish
from ..user.models import User
from ..appraise.models import Appraise
from flask import Blueprint, request

recommend = Blueprint('recommend', __name__)

@recommend.route('/recommend_test', methods=['GET', 'POST'])
def recommend_example():
    user_idx = 1
    canteen_number = Canteen.query.count()
    user_number = User.query.count()
    #print(f'canteen_number:{canteen_number}')
    #print(f'user_number:{user_number}')
    recommend = Recommendation(user_idx, canteen_number, user_number)
    recommend.construct_nonnegative_matrix()
    recommend.nonnegative_matrix_decomposition()
    recommend_idx = recommend.recommendation()
    #print(f'recommend_idx:{recommend_idx}')
    return str(canteen_number), 200

@recommend.route('/recommend_dish', methods=['GET', 'POST'])
def recommend_dish():
    user_id = request.args.get('user_id')
    canteen_name = request.args.get('canteen_name')
    recommend = Recommendation(canteen_name, user_id)
    recommend.construct_nonnegative_matrix()
    recommend.nonnegative_matrix_decomposition()
    recommend_dish = recommend.recommendation()
    recommend_dish = ",".join(recommend_dish)
    print(recommend_dish)
    return recommend_dish, 200


class Recommendation():

    def __init__(self, canteen_name, user_id):
        self.score_matrix = None # (canteen, user)
        self.score_matrix_cnt = None
        self.NMF = None
        self.W = None
        self.H = None
        self.filtered_matrix = None
        self.reconstruct_matrix = None
        self.reconstruct_filtered_matrix = None
        self.canteen_name = canteen_name
        self.user_id = user_id
        user_list = User.query.all()
        self.user_list = [user.id for user in user_list]

        try:
            self.user_idx = self.user_list.index(self.user_id)
            print(f'user_idx:{self.user_idx}')
            print(f'user_id:{self.user_id}')
        except:
            raise userError('user does not exist.')
        # TODO: 获取餐厅id
        self.canteen_id = 5
        #print(f'canteen_id:{canteen_id}')
        dish_list = Dish.query.filter(Dish.canteen_id == self.canteen_id).all()
        self.dish_list = [dish.id for dish in dish_list]
        self.dish_name = [dish.name for dish in dish_list]
        self.dish_number = len(self.dish_name)
        self.user_number = len(self.user_list)

    def construct_nonnegative_matrix(self):
        self.score_matrix = np.zeros((self.user_number, self.dish_number))
        self.score_matrix_cnt = np.zeros((self.user_number, self.dish_number))
        for user_idx, user in enumerate(self.user_list):
            appraise_list = Appraise.query.filter_by(user_id=user, canteen_id=self.canteen_id).all()
            appraise_item = [appraise.id for appraise in appraise_list]
            for appraise in appraise_list:
                try:
                    dish_list = appraise.dish.split(',')
                except:
                    dish_list = appraise.dish
                print(dish_list)
                try:
                    for dish in dish_list:
                        dish_idx = self.dish_name.index(dish)
                        print(f'dish:{dish}')
                        self.score_matrix[user_idx][dish_idx] += appraise.star
                        self.score_matrix_cnt[user_idx][dish_idx] += 1
                except:
                    pass
        self.filtered_matrix = self.score_matrix < 1e-8

    def nonnegative_matrix_decomposition(self):
        self.NMF = NMF()
        self.W = self.NMF.fit_transform(self.score_matrix)
        self.H = self.NMF.components_
        #print(self.H)

    def recommendation(self):
        self.reconstruct_matrix = np.dot(self.W, self.H)
        #self.reconstruct_filtered_matrix = (self.reconstruct_matrix * self.filtered_matrix).T
        #print(self.reconstruct_filtered_matrix)
        #print(f'self.reconstruct_filtered_matrix: {self.reconstruct_filtered_matrix}')
        reconstruct_sorted_value = sorted(self.reconstruct_matrix[self.user_idx], reverse=True)
        reconstruct_value = self.reconstruct_matrix[self.user_idx]
        dish_name_list = []
        for val in reconstruct_sorted_value:
            idx = list(reconstruct_value).index(val)
            dish_name_list.append(self.dish_name[idx])
        print(f'dish_name_list: {dish_name_list}')
        return dish_name_list

if __name__ == '__main__':
    #print('test')
    recommend = Recommendation(10)
    recommend.construct_nonnegative_matrix()
    recommend.nonnegative_matrix_decomposition()
    idx = recommend.recommendation()
    print(idx)
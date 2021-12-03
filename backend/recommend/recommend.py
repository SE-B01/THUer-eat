from sklearn.decomposition import NMF
import numpy as np
from ..db import db
from ..canteen.models import Canteen
from ..user.models import User
from ..appraise.models import Appraise
from flask import Blueprint

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


class Recommendation():

    def __init__(self, user_idx, canteen_number, user_number):
        self.score_matrix = None # (canteen, user)
        self.score_matrix_cnt = None
        self.NMF = None
        self.W = None
        self.H = None
        self.filtered_matrix = None
        self.reconstruct_matrix = None
        self.reconstruct_filtered_matrix = None
        self.user_idx = user_idx # the order in user_list
        user_list = User.query.all()
        self.user_list = [user.id for user in user_list]
        canteen_list = Canteen.query.all()
        self.canteen_list = [canteen.id for canteen in canteen_list]
        self.canteen_name = [canteen.name for canteen in canteen_list]
        self.canteen_number = canteen_number
        self.user_number = user_number

    def construct_nonnegative_matrix(self):
        self.score_matrix = np.zeros((self.user_number, self.canteen_number))
        self.score_matrix_cnt = np.zeros((self.user_number, self.canteen_number))
        #print(f'self.canteen_list: {self.canteen_list}')
        #print(f'self.user_list: {self.user_list}')
        for user_idx, user in enumerate(self.user_list):
            appraise_list = Appraise.query.filter_by(user_id=user)
            for appraise in appraise_list:
                canteen_idx = self.canteen_list.index(appraise.canteen_id)
                self.score_matrix[user_idx][canteen_idx] += appraise.star
                self.score_matrix_cnt[user_idx][canteen_idx] += 1
        zero_idx = np.where(self.score_matrix_cnt < 1)
        self.score_matrix_cnt[zero_idx] += 1
        self.score_matrix /= self.score_matrix_cnt
        #print(self.score_matrix)
        self.score_matrix = self.score_matrix.T
        # construct score_matrix with shape (canteen, user)
        """self.score_matrix = np.array(
        [[5, 5, 3, 0, 5, 5, 4, 3, 2, 1, 4, 1, 3, 4, 5],
        [5, 0, 4, 0, 4, 4, 3, 2, 1, 2, 4, 4, 3, 4, 0],
        [0, 3, 0, 5, 4, 5, 0, 4, 4, 5, 3, 0, 0, 0, 0],
        [5, 4, 3, 3, 5, 5, 0, 1, 1, 3, 4, 5, 0, 2, 4],
        [5, 4, 3, 3, 5, 5, 3, 3, 3, 4, 5, 0, 5, 2, 4],
        [5, 4, 2, 2, 0, 5, 3, 3, 3, 4, 4, 4, 5, 2, 5],
        [5, 4, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0],
        [5, 4, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [5, 4, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
        [5, 4, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]]
    )"""
        self.filtered_matrix = self.score_matrix < 1e-8

    def nonnegative_matrix_decomposition(self):
        self.NMF = NMF()
        self.W = self.NMF.fit_transform(self.score_matrix)
        self.H = self.NMF.components_

    def recommendation(self):
        self.reconstruct_matrix = np.dot(self.W, self.H)
        self.reconstruct_filtered_matrix = (self.reconstruct_matrix * self.filtered_matrix).T
        #print(f'self.reconstruct_filtered_matrix: {self.reconstruct_filtered_matrix}')
        recommend_canteen_index = np.array(np.nonzero(self.reconstruct_filtered_matrix[self.user_idx, :])[0])
        #print(f'recommend_canteen_index: {recommend_canteen_index}')
        recommend_canteen_list = np.array(self.canteen_name)[recommend_canteen_index]
        return recommend_canteen_list

if __name__ == '__main__':
    #print('test')
    recommend = Recommendation(10)
    recommend.construct_nonnegative_matrix()
    recommend.nonnegative_matrix_decomposition()
    idx = recommend.recommendation()
    print(idx)
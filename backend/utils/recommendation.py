from sklearn.decomposition import NMF
import numpy as np


class Recommendation():

    def __init__(self, user_id):
        self.score_matrix = None # (canteen, user)
        self.NMF = None
        self.W = None
        self.H = None
        self.filtered_matrix = None
        self.reconstruct_matrix = None
        self.reconstruct_filtered_matrix = None
        self.user_id = user_id # the order in user_list
        self.user_list = []
        self.canteen_list = []

    def construct_nonnegative_matrix(self):
        # construct score_matrix with shape (canteen, user)
        self.score_matrix = np.array(
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
    )
        self.filtered_matrix = self.score_matrix < 1e-8

    def nonnegative_matrix_decomposition(self):
        self.NMF = NMF()
        self.W = self.NMF.fit_transform(self.score_matrix)
        self.H = self.NMF.components_

    def recommendation(self):
        self.reconstruct_matrix = np.dot(self.W, self.H)
        self.reconstruct_filtered_matrix = (self.reconstruct_matrix * self.filtered_matrix).T
        recommend_canteen_index = np.nonzero(self.reconstruct_filtered_matrix[self.user_id, :])
        return recommend_canteen_index



if __name__ == '__main__':
    #print('test')
    recommend = Recommendation(10)
    recommend.construct_nonnegative_matrix()
    recommend.nonnegative_matrix_decomposition()
    idx = recommend.recommendation()
    print(idx)
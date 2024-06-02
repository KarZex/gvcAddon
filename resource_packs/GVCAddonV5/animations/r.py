import numpy as np

#回転行列の定義
def rotation_matrix_x(theta):
    return np.array([
        [1, 0, 0],
        [0, np.cos(theta), -np.sin(theta)],
        [0, np.sin(theta), np.cos(theta)]
    ])

def rotation_matrix_y(theta):
    return np.array([
        [np.cos(theta), 0, np.sin(theta)],
        [0, 1, 0],
        [-np.sin(theta), 0, np.cos(theta)]
    ])

def rotation_matrix_z(theta):
    return np.array([
        [np.cos(theta), -np.sin(theta), 0],
        [np.sin(theta), np.cos(theta), 0],
        [0, 0, 1]
    ])

#点の定義
point = np.array([1, 2, 3])

#角度の定義（ラジアン）
theta_x = np.pi / 4  # 45度
theta_y = np.pi / 4  # 45度
theta_z = np.pi / 4  # 45度

#回転行列の適用
rotated_point_x = rotation_matrix_x(theta_x).dot(point)
rotated_point_y = rotation_matrix_y(theta_y).dot(rotated_point_x)
rotated_point_z = rotation_matrix_z(theta_z).dot(rotated_point_y)

print("Original point:", point)
print("Rotated point:", rotated_point_z)
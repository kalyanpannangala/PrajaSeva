import os

file_path = "schemes_model.pkl"
if os.path.exists(file_path):
    file_size_bytes = os.path.getsize(file_path)
    file_size_mb = file_size_bytes / (1024 * 1024)
    print(f"The size of schemes_model.pkl is: {file_size_mb:.2f} MB")
else:
    print(f"File not found at {file_path}")
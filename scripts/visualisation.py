import json
import pandas as pd
import matplotlib.pyplot as plt
import boto3
from io import BytesIO

MINIO_ENDPOINT = "http://localhost:9000"
MINIO_ACCESS_KEY = "admin"
MINIO_SECRET_KEY = "admin123"
BUCKET_NAME = "spotify-playlists"
PARQUET_FILE_NAME = "playlist.parquet"
LOCAL_JSON_PATH = "playlist.json"

s3_client = boto3.client(
    "s3",
    endpoint_url=MINIO_ENDPOINT,
    aws_access_key_id=MINIO_ACCESS_KEY,
    aws_secret_access_key=MINIO_SECRET_KEY,
)

try:
    s3_client.head_bucket(Bucket=BUCKET_NAME)
except Exception:
    s3_client.create_bucket(Bucket=BUCKET_NAME)

try:
    with open(LOCAL_JSON_PATH, "r", encoding="utf-8") as file:
        data = json.load(file)
except FileNotFoundError:
    exit()

df = pd.DataFrame(data)

def duration_to_seconds(duration):
    minutes, seconds = map(int, duration.split(':'))
    return minutes * 60 + seconds

df["duration_seconds"] = df["duration"].apply(duration_to_seconds)

temp_buffer = BytesIO()
df.to_parquet(temp_buffer, index=False)

temp_buffer.seek(0)
s3_client.put_object(Bucket=BUCKET_NAME, Key=PARQUET_FILE_NAME, Body=temp_buffer.getvalue())

print(df)

plt.figure(figsize=(10, 5))
plt.hist(df["duration_seconds"], bins=10, edgecolor='black')
plt.xlabel("Durée (secondes)")
plt.ylabel("Nombre de morceaux")
plt.title("Répartition des durées des morceaux Spotify")
plt.show()

plt.figure(figsize=(10, 5))
plt.barh(df["titre"], df["duration_seconds"], color='skyblue')
plt.xlabel("Durée (secondes)")
plt.ylabel("Titre")
plt.title("Durée des morceaux Spotify")
plt.gca().invert_yaxis()
plt.show()
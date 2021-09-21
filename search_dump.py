from sentence_transformers import SentenceTransformer
import pandas as pd
import numpy as np
from tqdm import tqdm

from search_elastic import connect_elastic, insert
import config


def process_data():
    df = pd.read_csv("data/pulse-content.csv", encoding='unicode_escape')
    u = df.select_dtypes(object)
    df[u.columns] = u.apply(lambda x: x.str.encode(
        'utf-8').str.decode('ascii', 'ignore'))

    print("\nIndexing pulse data...")
    for _, row in tqdm(df.iterrows()):
        # Index each qa pair along with the question id and embedding
        embedding = np.asarray(model.encode(row['body'])).tolist()
        # print(embedding)
        print(row['body'])
        insert('pulse', {
            'title': row['title'],
            'link': row['link'],
            'body': row['body'],
            'body_vec': embedding,
        })


if __name__ == '__main__':
    # Load the model
    model = SentenceTransformer(config.TRANSFORMER_MODEL)
    print('Model loaded successfully...')

    # connect to elastic node
    connect_elastic(config.ELASTIC_CLUSTER,
                    config.ELASTIC_USER, config.ELASTIC_PASSWORD)

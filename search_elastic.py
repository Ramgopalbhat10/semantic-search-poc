from elasticsearch import Elasticsearch
import json

from numpy.core.fromnumeric import size

es = None


def connect_elastic(cloud_id, user, password):
    global es

    es = Elasticsearch(cloud_id=cloud_id, http_auth=(user, password))
    if es.ping():
        print('Connected to elasticsearch...')
        es.info()
    else:
        print('Error while connecting to elasticsearch...')

    return es


def create_index():
    index_body = {
        'mappings': {
            'properties': {
                'title': {
                    'type': 'text'
                },
                'link': {
                    'type': 'text'
                },
                'body': {
                    'type': 'text'
                },
                'body_vec': {
                    'type': 'dense_vector',
                    'dims': 768
                }
            }
        }
    }

    try:
        # Create the index if not exists
        if not es.indices.exists("pulse"):
            # Ignore 400 means to ignore "Index Already Exist" error.
            es.indices.create(
                index="pulse", body=index_body  # ignore=[400, 404]
            )
            print("Created Index -> pulse")
        else:
            print("Index pulse exists...")
    except Exception as ex:
        print(str(ex))


def insert(body):
    if not es.indices.exists("pulse"):
        create_index()
        # Insert a record into the es index
        es.index(index="pulse", body=body)


def semantic_search(query_vector, page=0, threshold=1, top_n=10):
    if not es.indices.exists("pulse"):
        return "No records found"

    s_body = {
        "query": {
            "script_score": {
                "query": {
                    "match_all": {},
                },
                "script": {
                    "source": "cosineSimilarity(params.query_vector, 'body_vec') + 1.0",
                    "params": {"query_vector": query_vector}
                },
            },
        }
    }

    print("getting records from: ", page)
    # Semantic vector search with cosine similarity
    result = es.search(index='pulse', body=s_body, size=2,
                       from_=page, track_total_hits=True)
    total = result['hits']['total']['value']
    total_match = len(result["hits"]["hits"])
    print("Total Matches: ", str(total_match))

    res = {
        'total_records': total,
        'data': []
    }
    if total_match > 0:
        titles = []
        for hit in result['hits']['hits']:
            titles.append(hit['_source']['title'])
            res['data'].append({"score": hit["_score"], "title": hit["_source"]['title'],
                                "link": hit["_source"]['link'], "body": hit["_source"]['body']})

        print(json.dumps(titles))

    return res

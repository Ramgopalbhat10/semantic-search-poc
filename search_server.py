from flask import Flask, request, jsonify, render_template
from sentence_transformers import SentenceTransformer
import numpy as np

from search_elastic import connect_elastic, semantic_search
import config

app = Flask(__name__)


@app.before_request
def before_request():
    app.jinja_env.cache = {}


@app.after_request
def apply_caching(response):
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response


app.before_request(before_request)
app.after_request(apply_caching)


model = SentenceTransformer(config.TRANSFORMER_MODEL)
connect_elastic(config.ELASTIC_CLUSTER,
                config.ELASTIC_USER, config.ELASTIC_PASSWORD)


@app.route('/get_search', methods=['GET', 'POST'])
def search_request():
    print("method is: ", request.method)
    if request.method == 'POST':
        user_input = ''
        page = request.args.get('page')

        if page:
            page = int(page)
            user_input = request.args.get('query')
        else:
            page = 0
            user_input = request.form['search']
        # user_input = user_input_raw['utterance']

        query_vector = np.asarray(model.encode(user_input)).tolist()
        records = semantic_search(query_vector, page)
        records['query'] = user_input
        return {'data': records}

        # return render_template('index.html', records=records)
    return render_template('search.html')


if __name__ == '__main__':
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['ENV'] = 'development'
    app.config['DEBUG'] = True
    app.run(host='0.0.0.0', port=5003)

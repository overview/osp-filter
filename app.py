

import os

from osp.common.config import config
from osp.citations.hlom.utils import prettify_field
from osp.citations.hlom.ranking import Ranking
from osp.locations.models.doc_inst import Document_Institution
from flask import Flask, render_template, request, jsonify
from flask.ext.cache import Cache
from peewee import fn


app = Flask(__name__)

cache = Cache(app, config={
    'CACHE_TYPE': 'redis',
    'CACHE_DEFAULT_TIMEOUT': 86400,
})


@app.route('/')
def search():
    return render_template('search.html')


@app.route('/texts/rank')
def api_rank_texts():

    """
    Rank texts.
    """

    texts = rank_texts(
        request.args.get('keywords'),
        request.args.get('state'),
        request.args.get('institution')
    )

    return jsonify(texts)


@app.route('/institutions/load')
def api_load_institutions():

    """
    Load institutions.
    """

    query = {'match_all': {}}

    return jsonify({
        'institutions': load_institutions(query, 3000)
    })


@app.route('/institutions/search')
def api_search_institutions():

    """
    Search institutions.
    """

    q = request.args.get('q')

    # Match `name`, when a query is provided.
    if q:
        query = {
            'multi_match': {
                'query': q,
                'type': 'phrase_prefix',
                'fields': ['name', 'city']
            }
        }

    # If the query is empty, load everything.
    else: query = {'match_all': {}}

    return jsonify({
        'institutions': load_institutions(query)
    })


@cache.memoize()
def rank_texts(keywords=None, state=None, institution=None):

    """
    Pull text rankings.

    Args:
        keywords (str)
        state (str)
        institution (int)

    Returns:
        list: A ranked list of texts.
    """

    ranking = Ranking()

    # Filter by keywords:
    if keywords: ranking.filter_keywords(keywords)

    # Filter by state:
    if state: ranking.filter_state(state)

    # Filter by institution:
    if institution: ranking.filter_institution(institution)

    results = ranking.rank()

    texts = []
    for r in results['ranks']:

        record = r['record']

        texts.append({
            'id':       record.id,
            'title':    prettify_field(record.marc.title()),
            'author':   prettify_field(record.marc.author()),
            'rank':     r['rank'],
            't_count':  record.metadata['citation_count'],
            'f_count':  record.count,
        })

    return {
        'count': results['count'],
        'texts': texts
    }


@cache.memoize()
def load_institutions(query, size=100):

    """
    Load all institutions.

    Args:
        query (dict): An Elasticsearch query.

    Returns: dict
    """

    # Query Elasticsearch.
    docs = config.es.search('osp', 'institution', body={
        'size': size,
        'query': query,
        'sort': [{
            'count': {
                'order': 'desc'
            }
        }]
    })

    # Flatten out the results.
    results = []
    for d in docs['hits']['hits']:
        results.append({
            'id':       d['_id'],
            'count':    d['_source']['count'],
            'name':     d['_source']['name'],
            'state':    d['_source']['state'],
            'city':     d['_source']['city'],
            'url':      d['_source']['url'],
            'lon':      d['_source']['lon'],
            'lat':      d['_source']['lat'],
        })

    return results


if __name__ == '__main__':
    app.run(port=os.getenv('PORT', 5000), debug=True)

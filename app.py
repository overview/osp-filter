

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


@app.route('/texts/search')
def api_search_texts():

    """
    Search texts.
    """

    texts = search_texts(request.args.get('query'))
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
            'id':           record.id,
            'title':        prettify_field(record.marc.title()),
            'author':       prettify_field(record.marc.author()),
            'publisher':    prettify_field(record.marc.publisher()),
            'rank':         r['rank'],
            't_count':      record.metadata['citation_count'],
            'f_count':      record.count,
        })

    return {
        'count': results['count'],
        'texts': texts
    }


@cache.memoize()
def search_texts(q=None):

    """
    Search metadata.

    Args:
        q (str): The search query.

    Returns:
        list: A ranked list of texts.
    """

    # Search all fields when query is provided.
    if q:
        query = {
            'multi_match': {
                'query': q,
                'fields': ['title', 'author', 'publisher'],
                'type': 'phrase_prefix'
            }
        }

    # If the query is empty, load all documents.
    else:
        query = {
            'match_all': {}
        }

    results = config.es.search('osp', 'record', body={
        'query': query,
        'size': 100,
        'sort': [{
            'count': {
                'order': 'desc'
            }
        }],
        'highlight': {
            'fields': {
                'title': {
                    'number_of_fragments': 1,
                    'fragment_size': 1000
                },
                'author': {
                    'number_of_fragments': 1,
                    'fragment_size': 1000
                },
                'publisher': {
                    'number_of_fragments': 1,
                    'fragment_size': 1000
                }
            }
        }
    })

    texts = []
    for h in results['hits']['hits']:
        texts.append({
            'id':           h['_id'],
            'title':        highlight(h, 'title'),
            'author':       highlight(h, 'author'),
            'publisher':    highlight(h, 'publisher'),
            'rank':         h['_source']['rank'],
            't_count':      h['_source']['count'],
            'f_count':      h['_source']['count'],
        })

    return {
        'count': results['hits']['total'],
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


def highlight(hit, field):

    """
    Try to get a hit highlight for a field. If none is available, return the
    raw field value.

    Args:
        hit (dict): The raw Elasticsearch hit.
        field (str): The field name.

    Returns: string
    """

    try:
        return hit['highlight'][field]
    except:
        return hit['_source'][field]


if __name__ == '__main__':
    app.run(port=os.getenv('PORT', 5000), debug=True)

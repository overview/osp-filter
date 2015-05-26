

import os

from osp.citations.hlom.ranking import Ranking
from osp.citations.hlom.utils import prettify_field
from flask import Flask, render_template, request, jsonify


app = Flask(__name__)


def format_ranks(ranks):

    """
    Construct a list of hydrated texts for the client.

    Args:
        ranks (list): A ranked list of texts.

    Returns:
        dict: The formatted list.
    """

    texts = []
    for r in ranks:

        record = r['record']

        texts.append({
            'title':    prettify_field(record.marc.title()),
            'author':   prettify_field(record.marc.author()),
            'rank':     r['rank'],
            'count':    record.count,
        })

    return texts


@app.route('/')
def search():
    return render_template('search.html')


@app.route('/rank')
def rank():

    """
    Rank texts.
    """

    ranking = Ranking()

    # Filter state.
    state = request.args.get('state')
    if state: ranking.filter_state(state)

    # Filter institution.
    inst = request.args.get('inst')
    if inst: ranking.filter_institution(inst)

    return jsonify({
        'texts': format_ranks(ranking.rank())
    })


if __name__ == '__main__':
    app.run(port=os.getenv('PORT', 5000), debug=True)

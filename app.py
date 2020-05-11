import sqlite3

from flask import Flask, g, redirect, render_template, request, session, url_for

app = Flask(__name__)
app.config["DEBUG"] = True

DATABASE = 'subject_data.db'


def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


@app.route('/', methods=['GET'])
def home():
    session['subject_id'] = request.args.get('PROLIFIC_PID')
    if session['subject_id'] is not None and len(session['subject_id']) == 24:
        return redirect(url_for('consent'))
    else:
        error_text = ('Could not find a valid Prolific ID in the url. '
                      'Please check your URL.')
        return render_template('error.html', error_text=error_text)


@app.route('/consent', methods=['GET'])
def consent():
    return render_template('consent.html')


@app.route('/consent-failure', methods=['GET'])
def consent_failuer():
    return render_template('consent-failure.html')


@app.route('/experiment', methods=['GET', 'PUT'])
def experiment():
    return render_template('experiment.html')


if __name__ == '__main__':
    app.run()

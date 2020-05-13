import os
import sqlite3

from flask import Flask, g, redirect, render_template, request, session, url_for

app = Flask(__name__)
app.config['DEBUG'] = False
app.config['SECRET_KEY'] = 'gh948ghhg2498gh'

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


def insert_data(subject_id, data):
    sql = 'INSERT OR REPLACE INTO participants VALUES (?, ?);'
    c = get_db().cursor()
    c.execute(sql, (subject_id, data))
    get_db().commit()


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


@app.route('/', methods=['GET'])
def home():
    session['subject_id'] = request.args.get('PROLIFIC_PID')
    if session['subject_id'] is not None and len(session['subject_id']) == 24:
        insert_data(session['subject_id'], "")
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


@app.route('/experiment', methods=['GET'])
def experiment():
    return render_template('experiment.html')


@app.route('/save-data', methods=['POST'])
def save_data():
    try:
        insert_data(session['subject_id'], request.data)
    except KeyError:
        error_text = ("Couldn't save your data."
                      "Do you have cookies disabled or an adblocker running?")
        return render_template('error.html', error_text=error_text)
    return 'OK'


if __name__ == '__main__':
    init_db()
    app.run()

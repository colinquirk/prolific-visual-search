import os

from flask import Flask, redirect, render_template, request, session, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['DEBUG'] = False
app.config['SECRET_KEY'] = 'gh948ghhg2498gh'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
db = SQLAlchemy(app)

from .models import Participant


def insert_data(subject_id, data):
    p = Participant.query.filter_by(pid=subject_id).first()
    print(subject_id)
    if not p:
        p = Participant(subject_id, data)
        db.session.add(p)
    else:
        print("data")
        print(data)
        p.data = data
    db.session.commit()


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
        print(request.json)
        insert_data(session['subject_id'], request.json)
    except KeyError:
        error_text = ("Couldn't save your data."
                      "Do you have cookies disabled or an adblocker running?")
        return render_template('error.html', error_text=error_text)
    return 'OK'


if __name__ == '__main__':
    app.run()

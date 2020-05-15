import os

from flask import Flask, redirect, render_template, request, session, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['DEBUG'] = False
app.config['SECRET_KEY'] = 'gh948ghhg2498gh'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
db = SQLAlchemy(app)

from .models import Trial


def insert_data(pid, **kwargs):
    trial = Trial(pid, **kwargs)
    db.session.add(trial)
    db.session.commit()


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


@app.route('/experiment', methods=['GET'])
def experiment():
    return render_template('experiment.html')


@app.route('/save-data', methods=['POST'])
def save_data():
    try:
        form = request.form.to_dict()
        if form['response'] == "":
            form['response'] = None
        if form['reaction_time'] == "":
            form['reaction_time'] = None

        insert_data(session['subject_id'], **form)
    except KeyError:
        error_text = ("Couldn't save your data."
                      "Do you have cookies disabled or an adblocker running?")
        return render_template('error.html', error_text=error_text)
    return 'OK'


if __name__ == '__main__':
    app.run()

from flask import Flask, redirect, render_template, url_for

app = Flask(__name__)
app.config["DEBUG"] = True


@app.route('/', methods=['GET'])
def home():
    return redirect(url_for('consent'))


@app.route('/consent', methods=['GET'])
def consent():
    return render_template('consent.html')


@app.route('/consent-failure', methods=['GET'])
def consent_failuer():
    return render_template('consent-failure.html')


@app.route('/experiment', methods=['GET', 'PUT'])
def experiment():
    return render_template('experiment.html')


app.run()

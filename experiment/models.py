from .app import db


class Participant(db.Model):
    __tablename__ = 'participants'

    pid = db.Column(db.String(), primary_key=True)
    data = db.Column(db.String())

    def __init__(self, pid, data):
        self.pid = pid
        self.data = data

    def __repr__(self):
        return '<pid {}>'.format(self.pid)

from .app import db
from sqlalchemy.dialects.postgresql import JSON


class Participant(db.Model):
    __tablename__ = 'participants'

    pid = db.Column(db.String(), primary_key=True)
    data = db.Column(JSON)

    def __init__(self, pid, data):
        self.pid = pid
        self.data = data

    def __repr__(self):
        return '<pid {}>'.format(self.pid)

from .app import db


class Trial(db.Model):
    __tablename__ = 'participants'

    primary_key = db.Column(db.Integer, primary_key=True)
    pid = db.Column(db.String())
    trial_num = db.Column(db.Integer())
    timestamp = db.Column(db.Integer())
    target_color = db.Column(db.String())
    target_loc_x = db.Column(db.Integer())
    target_loc_y = db.Column(db.Integer())
    target_rotation = db.Column(db.Integer())
    distractor_xs = db.Column(db.String())
    distractor_ys = db.Column(db.String())
    distractor_rotations = db.Column(db.String())
    distractor_type = db.Column(db.String())
    correct_response = db.Column(db.String())
    response = db.Column(db.String())
    accuracy = db.Column(db.String())
    reaction_time = db.Column(db.Integer())

    def __init__(self, pid, trial_num, timestamp, target_color, target_loc_x, target_loc_y,
                 target_rotation, distractor_xs, distractor_ys, distractor_rotations,
                 distractor_type, correct_response, response, accuracy, reaction_time):
        self.pid = pid
        self.trial_num = trial_num
        self.timestamp = timestamp
        self.target_color = target_color
        self.target_loc_x = target_loc_x
        self.target_loc_y = target_loc_y
        self.target_rotation = target_rotation
        self.distractor_xs = distractor_xs
        self.distractor_ys = distractor_ys
        self.distractor_rotations = distractor_rotations
        self.distractor_type = distractor_type
        self.correct_response = correct_response
        self.response = response
        self.accuracy = accuracy
        self.reaction_time = reaction_time

    def __repr__(self):
        return '<pid {}>'.format(self.pid)

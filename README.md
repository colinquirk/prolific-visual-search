# Prolific Visual Search

This experiment is designed to be hosted on heroku and linked to from an online experiment platform, sona, or however else you are recruiting participants.

app.py includes the flask code which defines the backend. This is the part of the code that gets info about the participant, determines which page to show, and saves the data.
  - Don't forget to change the secret key

models.py is sqlalchemy code that defines the schema for the database.

templates/ contains the html files that are displayed.

static/js/experiment.js is the actual javascript that defines what happens when the participant is actually doing the experiment.

Feel free to dm me on twitter @ColinTQuirk with any questions.

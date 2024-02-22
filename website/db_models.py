from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func

class Irrigation(db.Model):
    id = db.Column(db.Integer, primary_key = True)

    duration_per_session = db.Column(db.Integer, nullable = False)
    num_sessions_per_day = db.Column(db.Integer, nullable = False)

    account_id = db.Column(db.Integer, db.ForeignKey("account.id"))

class Account(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key = True)

# Enforces that no two accounts can hold the same associated email
    email = db.Column(db.String(150), unique = True)
    password = db.Column(db.String(150))

    irrigation_plans = db.relationship("Irrigation")
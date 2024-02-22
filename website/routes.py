from flask import Blueprint, render_template, request, flash, jsonify, redirect, url_for
from flask_login import login_required, current_user
from . import db
from .db_models import Irrigation
import json

routes = Blueprint("routes", __name__)

# Route for the home page of the website where users see their notes
# This page only appears after the user signs up or signs in
@routes.route("/", methods = ["GET", "POST"])
@login_required
def home_page():
    if request.method == "POST":
        duration_per_session = request.form.get("duration_per_session")
        sessions_per_day = request.form.get("sessions_per_day")

        if int(duration_per_session) > 20:
            flash("It is not recommended to water plants for more than 20 continuous minutes!", category = "error")

        elif int(sessions_per_day) > 10:
            flash("Your irrigation plan can have a maximum of only 10 watering sessions per day!", category = "error")

        else:
            new_irrigation_plan = Irrigation(duration_per_session = duration_per_session, num_sessions_per_day = sessions_per_day, account_id = current_user.id)
            db.session.add(new_irrigation_plan)
            db.session.commit()

            flash("New irrigation plan has successfully been created!", category = "successful")

    return render_template("home_page.html", account = current_user)

@routes.route("/weathermap", methods = ["GET", "POST"])
@login_required
def weather_map():
    return render_template("weather_map.html", account = current_user)

@routes.route("/about")
def about_us():
    return render_template("about_us.html", account = current_user)

@routes.route("/del-account-irrigation-plan/<id>")
def del_account_irrigation_plan(id):
    new_irrigation_plan = Irrigation.query.filter_by(id = id).first()

    db.session.delete(new_irrigation_plan)
    db.session.commit()

    flash("Selected irrigation plan deleted!", category = "successful")

# Returns object
    return redirect(url_for("routes.home_page"))
# Main flask application file to run the server from "website"
from website import create_web_app

web_app = create_web_app()

if __name__ == "__main__":
    web_app.run(debug = True, port = "5000")
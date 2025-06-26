from flask import Flask
from flask_restful import Api
from flask_cors import CORS

# PUBLIC_INTERFACE
def create_app():
    """Creates and configures the Flask application for HabitTrackerApp backend."""
    app = Flask(__name__)
    CORS(app)
    api = Api(app)

    @app.route("/")
    def index():
        # PUBLIC_INTERFACE
        """Root route to verify server is running."""
        return {"message": "HabitTrackerApp Flask backend running."}, 200

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)

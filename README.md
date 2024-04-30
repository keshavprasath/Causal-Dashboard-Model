

# SigmaJS Graph Application

Welcome to the SigmaJS Graph Application. This application visualizes causal graphs using web technologies and includes a Python preprocessing script to generate graph layouts.

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.x
- Pip (Python package installer)
- Node.js (optional, if you intend to serve the application using a different HTTP server)

## Installation

To set up your environment and run the application, follow these steps:

### Python Environment Setup

1. (Optional) Create a virtual environment to manage your Python packages:
   ```shell
   python3 -m venv venv
   ```
   Activate the virtual environment:
   - On macOS/Linux:
     ```shell
     source venv/bin/activate
     ```
   - On Windows:
     ```shell
     venv\Scripts\activate
     ```

2. Install the required Python packages:
   ```shell
   pip install networkx
   ```

### Web Application Setup

1. If you do not have an HTTP server setup, install the http-server package globally using npm (comes with Node.js):
   ```shell
   npm install --global http-server
   ```

## Running the Application

### Preprocessing Step

1. Navigate to the main directory of the application:
   ```shell
   cd path/to/sigma_js_appV2
   ```
2. Run the preprocessing script:
   ```shell
   python preprocessing.py
   ```
   This script generates the necessary `master_layout.json` file for the application.

### Serving the Web Application

1. Serve the application using an HTTP server:
   ```shell
   http-server
   ```
   Or use Python's built-in HTTP server:
   ```shell
   python -m http.server
   ```
2. Open your web browser and go to `http://localhost:8080` to view the application.

## File Structure

- `app.js`: The main JavaScript file for the web application.
- `index.html`: The HTML file for the web application.
- `preprocessing.py`: The Python script for preprocessing graph data.
- `graph_directory/`: Directory containing individual graph data in JSON format.
- `master_layout.json`: The generated master layout file from the preprocessing script.

## Troubleshooting

If you encounter any issues, ensure that you have all the necessary permissions to execute the scripts and that Python and npm (if used) are correctly installed and configured on your system.

## Contributing

Feel free to fork the repository and submit pull requests with your enhancements.

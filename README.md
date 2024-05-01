

# Causal Dashboard Application

## Introduction
The Causal Dashboard Application provides a dynamic visualization platform for analyzing causal relationships within datasets through interactive graph representations. It is designed to assist researchers and data scientists in exploring complex data interactions efficiently.

## Features
- **Dynamic Graph Visualization**: Utilizes Sigma.js for smooth rendering of interactive graphs.
- **Interactive Filters**: Users can filter visualizations by categories such as age, gender, and education level.
- **Custom Graph Styling**: Highlights and differentiates graph elements based on data-driven criteria.
- **Responsive Layout**: Ensures compatibility across various devices with a flexible, user-friendly interface.


## Prerequisites

Before setting up the Causal Dashboard Application, please ensure you have the following installed:

- **Python 3.x**: For running the preprocessing scripts.
- **Pip**: Python's package installer.
- **Node.js**: Optional, required if using Node's `http-server` to serve the application. Alternatively, Python's built-in HTTP server can be used.

## Installation

Follow these instructions to prepare your environment and get the application up and running.

### Python Environment Setup

1. **Set Up a Virtual Environment** (Optional): 
   Isolating your Python environment is recommended to avoid conflicts with system-wide packages.
   - **Create a virtual environment**:
     ```shell
     python3 -m venv venv
     ```
   - **Activate the virtual environment**:
     - On macOS/Linux:
       ```shell
       source venv/bin/activate
       ```
     - On Windows:
       ```shell
       venv\Scripts\activate
       ```

2. **Install Python Dependencies**:
   Install the required Python packages using pip:
   ```shell
   pip install networkx matplotlib
   ```

### Web Application Setup

1. **Install HTTP Server** (Optional):
   If you don't have a web server, you can install Node.js's `http-server`, a simple zero-configuration command-line http server.
   ```shell
   npm install --global http-server
   ```

## Running the Application

Follow these steps to process the data and launch the application:

### Preprocessing Data

1. **Navigate to the Application Directory**:
   Change into the directory containing your application files.
   ```shell
   cd path/to/your_app_directory
   ```

2. **Run the Preprocessing Script**:
   Execute the preprocessing script to generate the necessary layout JSON file (`master_layout.json`):
   ```shell
   python preprocessing.py
   ```
   This script processes your provided graph data files into a format required by the application. You can use the existing graph data files or your own dataset.

### Serving the Web Application

1. **Start the HTTP Server**:
   You can serve the application using the installed http-server or Python's built-in server.
   - Using Node.js `http-server`:
     ```shell
     http-server
     ```
   - Using Python's built-in server:
     ```shell
     python -m http.server
     ```

2. **Access the Application**:
   Open your web browser and visit `http://localhost:8080` to interact with the Causal Dashboard Application.

## Usage

- **Selecting a Graph**: Use the dropdown menu to choose a graph set. The graphs are responsive and update based on the selection criteria provided via the filter options.
- **Applying Filters**: Customize the data view using the filters for gender, age, and education. These options dynamically update the graph to focus on selected demographics.
- **Weight Filter**: Adjust the slider to filter connections by weight, highlighting stronger relations within the data.
- **Reset View**: Reverts the graph to its default state for a fresh overview.

## Technical Overview
The application leverages the power of Sigma.js for graph rendering, with additional scripts to handle user interactions and data filtering. The layout and data mapping are managed through predefined JSON files, enabling swift and accurate updates to the visualization.

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

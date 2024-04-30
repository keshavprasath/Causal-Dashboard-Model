// Functions:
//
//

// Function to transform the graph data to the format expected by Sigma.js
function transformData(graphData, layoutData) {
  // Transform nodes with fixed positions from the layout data
  const nodes = graphData.nodes.map(node => {
      const layout = layoutData[node.id];
      return {
          id: node.id,
          label: node.id,
          x: layoutData[node.id] && layoutData[node.id].pos ? layoutData[node.id].pos[0] : 0,  // Use layout position if available, else default to 0
          y: layoutData[node.id] && layoutData[node.id].pos ? layoutData[node.id].pos[1] : 0,  // Use layout position if available, else default to 0
          size: 2  // Adjust the size as needed
      };
  });

  // Transform links to edges and add weights as labels 
  const edges = graphData.links.map((link, index) => ({
      id: 'e' + index,
      source: link.source,
      target: link.target,
      label: link.weight.toString(), // display weights as labels
      size: Math.max(Math.log(link.weight + 1), 0.5),
      color: getEdgeColor(link.weight),
      type: 'arrow'
  }));

  return { nodes, edges };
}

function getEdgeColor(weight) {
  if (weight > 5) return '#ff4136'; // High weight
  else if (weight > 2) return '#0074D9'; // Medium weight
  else return '#AAAAAA'; // Low weight
}

// Simulated function to mock fetching graph file names from the backend
function fetchGraphFileNames() {
  // Simulate a backend call with static data
  return Promise.resolve(Array.from({ length: 24 }, (_, i) => `graph_${i}.json`));
}

function populateGraphSelector() {
  const graphSelector = document.getElementById('graph-selector');

  // Clear existing options
  graphSelector.innerHTML = '';

  fetchGraphFileNames().then(files => {
    files.forEach(file => {
      const option = new Option(file.replace('graph_', '').replace('.json', ''), file);
      graphSelector.appendChild(option);
    });
  }).catch(error => {
    console.error("Failed to load graph files:", error);
  });
}



function customizeSigmaEdges(sigmaInstance) {
  var originalDrawEdge = sigma.canvas.edges.def;
  sigma.canvas.edges.def = function(edge, source, target, context, settings) {
      // First call the original method to draw the edge itself
      originalDrawEdge(edge, source, target, context, settings);

      // Adding labels: calculate the midpoint of the edge for label placement
      var x = (source.x + target.x) / 2;
      var y = (source.y + target.y) / 2;
      var label = edge.label || '';

      context.fillStyle = 'black'; // Label text color
      var fontSize = 12; // Font size for the labels
      context.font = fontSize + 'px Arial';
      context.fillText(label, x, y); // Draw the label at the midpoint of the edge
  };
}

function updateEdgeLabels(sigmaInstance) {
  const container = document.getElementById('sigma-container');
  const prefix = 'renderer0:'; // This prefix should match your Sigma instance renderer's prefix

  // Clear previous labels
  container.querySelectorAll('.edge-label').forEach(label => label.remove());

  sigmaInstance.graph.edges().forEach(edge => {
      const sourceNode = sigmaInstance.graph.nodes(edge.source);
      const targetNode = sigmaInstance.graph.nodes(edge.target);

      // Use the renderer's method to convert graph coordinates to screen coordinates
      const sourceScreenX = sourceNode[prefix + 'x'];
      const sourceScreenY = sourceNode[prefix + 'y'];
      const targetScreenX = targetNode[prefix + 'x'];
      const targetScreenY = targetNode[prefix + 'y'];

      // Calculate the midpoint of the edge for label positioning
      const midpointScreenX = (sourceScreenX + targetScreenX) / 2;
      const midpointScreenY = (sourceScreenY + targetScreenY) / 2;

      // Create label div and position it on the midpoint
      let label = document.createElement('div');
      label.className = 'edge-label';
      label.style.position = 'absolute';
      label.style.left = container.offsetLeft + midpointScreenX + 'px';
      label.style.top = container.offsetTop + midpointScreenY + 'px';
      label.textContent = edge.label;
      container.appendChild(label);
  });
}


// SLIDER Segment
//
//

function filterGraphByWeight(threshold, sigmaInstance) {
  threshold = parseFloat(threshold);

  // Filter edges based on the threshold
  sigmaInstance.graph.edges().forEach(edge => {
      // Parse the edge label as a float for comparison
      const edgeWeight = parseFloat(edge.label);
      edge.hidden = edgeWeight < threshold;
  });

  // Update node visibility based on the visibility of connected edges
  sigmaInstance.graph.nodes().forEach(node => {
      const connectedEdges = sigmaInstance.graph.edges().filter(e => 
          (e.source === node.id || e.target === node.id) && !e.hidden);
      node.hidden = connectedEdges.length === 0;
  });

  // Refresh the graph to apply the changes
  sigmaInstance.refresh();
}


// Initialize slider with dynamic values from the graph
function initializeSlider(sigmaInstance) {
  // Parse edge labels as floats and filter out any non-numeric values
  const edgeWeights = sigmaInstance.graph.edges().map(edge => parseFloat(edge.label)).filter(w => !isNaN(w));

  // If there are no valid edge weights, log an error and return early
  if (edgeWeights.length === 0) {
      console.error('No valid edge weights found.');
      return;
  }

  const minWeight = Math.min(...edgeWeights);
  const maxWeight = Math.max(...edgeWeights);

  const weightSlider = document.getElementById('weight-slider');
  weightSlider.min = minWeight;
  weightSlider.max = maxWeight;
  weightSlider.value = minWeight;  // Start with the minimum weight
  weightSlider.step = (maxWeight - minWeight) / 100;  // Set a fine-grained step value

  // Update the labels to show the current min and max weights
  document.getElementById('weight-min').textContent = minWeight.toFixed(2);
  document.getElementById('weight-max').textContent = maxWeight.toFixed(2);
}

// Sigma Initialisation:
//
//

// Function to initialize Sigma with a given graph JSON
function initializeSigma(graphJson, layoutData) {
  fetch(graphJson)
    .then(response => response.json())
    .then(graphData => {
      // Transform the graph data to fit Sigma's expectations
      const sigmaGraphData = transformData(graphData, layoutData);

      // Clear previous graph if exists
      const container = document.getElementById('sigma-container');
      container.innerHTML = ''; // A simple way to clear the container

      const s = new sigma({
        graph: sigmaGraphData,
        renderer: {
          container: document.getElementById('sigma-container'),
          type: 'canvas'  // Use 'canvas' instead of the default 'webgl'
        },
        settings: {
          defaultNodeColor: '#333',
          edgeColor: 'default',
          defaultEdgeColor: '#ccc',
          edgeLabelSize: 'proportional',
          enableEdgeHovering: true,
          edgeHoverColor: 'default',
          edgeHoverPrecision: 10, 
          defaultEdgeHoverColor: '#f46607',
          edgeLabelThreshold: 1,
          defaultEdgeLabelColor: '#000',
          labelThreshold: 0,
          labelSize: 'fixed',
          defaultLabelColor: '#000',
          sideMargin: 1,
          minArrowSize: 5,
          autoRescale: true,
          doubleClickEnabled: true,
          mouseWheelEnabled: true,
          touchEnabled: true,
          defaultNodeSize: 2, // Adjust the default size for all nodes
          labelSizeRatio: 1.5, // Adjust the ratio for the label size // Define the font used for labels if needed
          labelSize: 'proportional', // Change to 'proportional' if you want the label size to scale with the node size
          defaultLabelSize: 14
        }
      });


      // customizeSigmaEdges(s); 
      initializeSlider(s);
      // updateEdgeLabels(s);
      s.refresh(); 
      window.s = s;

      applyStylesBasedOnSelectedNode(s, state.selectedNode);

      s.bind('clickNode', (e) => {
        console.log('Node clicked:', e.data.node.id);
        state.selectedNode = e.data.node.id; // Update selected node in the state
        applyStylesBasedOnSelectedNode(s, state.selectedNode); // Apply styles
      });
      s.refresh();

      /*
      s.bind('coordinatesUpdated', function() {
        updateEdgeLabels(s);
      });
      s.refresh();
      */

      s.bind('overNode', function (e) {
          document.getElementById('tooltip').style.display = 'block';
          document.getElementById('tooltip').innerHTML = `Node: ${e.data.node.id}<br>Info: ${e.data.node.info}`;
          document.getElementById('tooltip').style.top = `${e.data.captor.clientY}px`;
          document.getElementById('tooltip').style.left = `${e.data.captor.clientX}px`;
        });
        
      s.bind('outNode', function (e) {
          document.getElementById('tooltip').style.display = 'none';
        });

      s.bind('overEdge', function(e) {
          const edge = e.data.edge;
          document.getElementById('tooltip').innerHTML = `Weight: ${edge.label}`;
          document.getElementById('tooltip').style.display = 'block';
          document.getElementById('tooltip').style.left = e.data.captor.clientX + 'px';
          document.getElementById('tooltip').style.top = e.data.captor.clientY + 'px';
      });
      
      s.bind('outEdge', function(e) {
          document.getElementById('tooltip').style.display = 'none';
      });
      
      
    });
}





// Helper function to apply styles
function applyStylesBasedOnSelectedNode(s, selectedNodeId) {
  s.graph.nodes().forEach(node => {
    if (node.id === selectedNodeId) {
      node.color = '#ff4136'; // Highlight color for selected node
    } else {
      node.color = 'gray'; // Default color for non-selected nodes
    }
  });

  s.graph.edges().forEach(edge => {
    if (edge.source === selectedNodeId || edge.target === selectedNodeId) {
      edge.color = '#0074D9'; // Highlight color for connected edges
    } else {
      edge.color = '#ccc'; // Default color for other edges
    }
  });

  s.refresh(); // Refresh to apply changes
}


// Global state of the application
const state = {
  searchQuery: '',
  selectedNode: null,
  highlightedNodes: new Set()
};

// Adding the mapping segment
let filterMappings = [];

fetch('mapping_index.json')  
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    filterMappings = data; // Cache the mapping data
    loadFilterOptions(); // Call this here to ensure filterMappings is populated
  })
  .catch(error => {
    console.error("Failed to load mapping index:", error);
  });

function getGraphFileName(gender, age, edu) {
  const mapping = filterMappings.find(m => m.gender === gender && m.age === age && m.education === edu);
  return mapping ? mapping.graph_file : null;
}


// Filter segment
//
//

function loadFilterOptions() {
  // Assuming filterMappings has already been loaded
  const genderSet = new Set(filterMappings.map(m => m.gender));
  const ageSet = new Set(filterMappings.map(m => m.age));
  const eduSet = new Set(filterMappings.map(m => m.education));

  const genderSelector = document.getElementById('gender-selector');
  const ageSelector = document.getElementById('age-selector');
  const eduSelector = document.getElementById('edu-selector');

  // Clear existing options before adding new ones
  [genderSelector, ageSelector, eduSelector].forEach(selector => {
    selector.innerHTML = '';
  });

  genderSet.forEach(gender => genderSelector.add(new Option(gender, gender)));
  ageSet.forEach(age => ageSelector.add(new Option(age, age)));
  eduSet.forEach(education => eduSelector.add(new Option(education, education)));
}

document.getElementById('gender-selector').addEventListener('change', updateGraphBasedOnFilters);
document.getElementById('age-selector').addEventListener('change', updateGraphBasedOnFilters);
document.getElementById('edu-selector').addEventListener('change', updateGraphBasedOnFilters);

function updateGraphBasedOnFilters() {
  const gender = document.getElementById('gender-selector').value;
  const age = document.getElementById('age-selector').value;
  const edu = document.getElementById('edu-selector').value;
  const graphFileName = getGraphFileName(gender, age, edu);

  if (graphFileName) {
    initializeSigma('graph_directory/' + graphFileName, layoutData);
  } else {
    console.log("No corresponding graph file found.");
  }
}

// 
//
//

let layoutData = null;


document.addEventListener('DOMContentLoaded', function() {
  fetch('master_layout.json')
    .then(response => response.json())
    .then(layout => {
        layoutData = layout;
        initializeSigma('graph_directory/graph_0.json', layoutData);
    });

  populateGraphSelector();
  document.getElementById('graph-selector').addEventListener('change', function(event) {
    const selectedGraphFile = event.target.value;
    initializeSigma('graph_directory/' + selectedGraphFile, layoutData);
  });
});

document.getElementById('weight-slider').addEventListener('input', function(e) {
  filterGraphByWeight(e.target.value, s);
});
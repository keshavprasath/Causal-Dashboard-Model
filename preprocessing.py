import networkx as nx
import random
import json
import os

def generate_random_causal_graphs(num_graphs, num_nodes, num_edges, output_directory):
    """
    Generate random directed graphs with specified numbers of nodes and edges,
    and save them in the specified output directory.
    """
    # Labels used for testing
    node_labels = [
        "Education Level", "Career Progression", "Salary", "Job Satisfaction",
        "Work-Life Balance", "Economic Conditions", "Age", "Industry",
        "Professional Training", "Networking Opportunities", "Technological Advances",
        "Market Trends", "Regulatory Impact", "Company Culture", "Leadership Influence",
        "Remote Work Opportunities", "Job Security", "Employee Benefits"
    ]
    node_labels = node_labels[:num_nodes]  # Adjust the list based on number of nodes

    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    for i in range(num_graphs):
        G = nx.DiGraph()
        for label in node_labels:
            G.add_node(label, id=label)
        possible_edges = [(u, v) for u in node_labels for v in node_labels if u != v]
        chosen_edges = random.sample(possible_edges, min(len(possible_edges), num_edges))
        for u, v in chosen_edges:
            weight = random.uniform(0, 1)
            label = f"Causal link {random.randint(1, 100)}"
            G.add_edge(u, v, weight=weight, label=label)

        data = nx.readwrite.json_graph.node_link_data(G)
        with open(os.path.join(output_directory, f'graph_{i}.json'), 'w') as f:
            json.dump(data, f)

def create_master_layout(graph_directory, output_filename):
    """
    Create a master layout file aggregating information from individual graph JSON files.
    """
    all_nodes = set()
    for graph_file in os.listdir(graph_directory):
        if graph_file.endswith('.json'):
            with open(os.path.join(graph_directory, graph_file), 'r') as f:
                json_data = json.load(f)
            for node in json_data['nodes']:
                all_nodes.add(node['id'])

    master_graph = nx.Graph()
    for node_id in all_nodes:
        master_graph.add_node(node_id, label=node_id)
    master_pos = nx.spring_layout(master_graph)  # This assigns fixed positions

    master_layout = {node: {'pos': list(pos), 'label': master_graph.nodes[node]['label']}
                     for node, pos in master_pos.items()}

    if os.path.exists(output_filename):
        os.remove(output_filename)

    with open(output_filename, 'w') as f:
        json.dump(master_layout, f)

# Set the directory for the graph data and the path for the master layout output
graph_directory = 'graph_directory'
output_path = 'master_layout.json'

# Check if the graph data already exists
if not os.listdir(graph_directory):
    # No graph data found, generate new graphs
    generate_random_causal_graphs(24, 18, 34, graph_directory) # For test purposes, we have stuck to 24 graphs as we wanted to test 3 Filters

# Always create or update the master layout
create_master_layout(graph_directory, output_path)
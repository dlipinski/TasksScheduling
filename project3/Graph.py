"""
Created: 23.05.18
Author: Dawid Lipinski

"""

class Graph:

    def __init__(self,activities):
        self.graph = {}
        for activity in activities:
            self.graph[activity.id] = activity.successors
            
    def find_all_paths(self, start, end, path=[]):
        path = path + [start]
        if start == end:
            return [path]
        if start not in self.graph:
            return []
        paths = []
        for node in self.graph[start]:
            if node not in path:
                newpaths = self.find_all_paths(node, end, path)
                for newpath in newpaths:
                    paths.append(newpath)
        return paths

    def find_all_nodes(self,start,end):
        paths = self.find_all_paths(start,end)
        all_nodes = []
        for path in paths:
            for node in path:
                if node not in all_nodes:
                    all_nodes.append(node)
        return all_nodes

    
  
       
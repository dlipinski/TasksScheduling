"""
Created: 23.05.18
Author: Dawid Lipinski

"""

class Activity:
    def __init__(self, id, pi,successors, predecessors):
        self.id = id
        self.pi = pi
        self.successors = successors
        self.predecessors = predecessors
        self.level = 0
        self.dkmax = 0
        self.in_system = False
        self.done = False
    
    def __str__(self):
        return "ID: {},  pi: {},level: {},drootmax: {}".format(self.id,self.pi,self.level,self.dkmax)
   
    
  
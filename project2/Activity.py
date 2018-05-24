"""
Created: 23.05.18
Author: Dawid Lipinski

"""

class Activity:
    def __init__(self, id, pi, dj, rj, successors, predecessors):
        self.id = id
        self.dj = dj
        self.pi = pi
        self.rj = rj
        self.successors = successors
        self.predecessors = predecessors
        self.dimax = 0
        self.Li = 0
        self.in_system = False
        self.done = False
        self.Li_setted = False
        self.timer = 0
    
    def __str__(self):
        return "ID: {}, dj: {}, pi: {},rj: {},dimax: {},Li: {}".format(self.id,self.dj,self.pi,self.rj,self.dimax,self.Li)
    def set_dimax(self,dimax):
        self.dimax = dimax

    def set_rj(self,rj):
        self.rj = rj
    
  
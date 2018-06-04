"""
Created: 23.05.18
Author: Dawid Lipinski

"""

class Machine:
    def __init__(self, id):
        self.id = id
        self.activities_times = []

    def __str__(self):
        return "Activities times: {}".format( self.activities_times )
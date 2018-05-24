"""
Created: 23.05.18
Author: Dawid Lipinski

"""
from Graph import Graph
import sys
import operator

class Brucker:
    def __init__(self, activities, machines_amount):
        self.activities = activities
        self.graph = Graph(activities)
        self.machines_amount = machines_amount
        self.chart = []
        
    def get_activities(self):
        return self.activities

    def get_activities_sorted_level(self):
        level_ids = {}
        for level in [a.level for a in self.activities]:
            level_ids[level]=[a.id for a in self.activities if a.level == level]
        return sorted(level_ids.items(), key=operator.itemgetter(0), reverse = True)

    def get_chart(self):
        return self.chart
    
    def get_activities_by_id(self,ids):
        return [a for a in self.activities if a.id in ids]
    
    def set_level(self,activity):
        for predecessor in [ a for a in self.activities if a.id in activity.predecessors ]:
            predecessor.level = activity.level+1
            self.set_level(predecessor)

    def set_levels(self):
        root = [a for a in self.activities if len(a.successors) == 0][0]
        root.level = 0
        self.set_level(root)

    def print_levels(self):
        for activity in self.activities:
            print("Z{}.level: {}".format(activity.id,activity.level))
  

    def set_d(self):
        for level in [a.level for a in self.activities ]:
            if level == 0:
                root = [a for a in self.activities if len(a.successors) == 0][0]
                root.dkmax = 1 - root.pi
            else:
                same_level_activities = [ a for a in self.activities if a.level == level ]
                for activity in same_level_activities:
                    my_dk = 1 - activity.pi
                    child_dkmax = 1+ [ a.dkmax for a in self.activities if a.id in activity.successors ][0]
                    activity.dkmax = max(my_dk,child_dkmax)
    
    def print_d(self):
        for activity in self.activities:
            print("Z{}.dkmax: {}".format(activity.id,activity.dkmax))

    def do_it(self):
        while(True):
            print([a.id for a in self.activities if a.done == True])
            done_ids = [a.id for a in self.activities if a.done==True]
            orphan_ids = [a.id for a in self.activities if len(a.predecessors)==0]
            undone= [a for a in self.activities if a.done==False]
            activities_undone_fathers_done = [u for u in undone if (u.id in orphan_ids) or any(elem in u.predecessors for elem in done_ids )]
           
            my_activities =sorted(activities_undone_fathers_done, key=lambda x: x.dkmax, reverse=True)[:self.machines_amount]

            self.chart.append(my_activities)

            for activity in my_activities:
                activity.done = True
            done_activities = [a for a in self.activities if a.done == True]

            if len(my_activities) == 0:
                break

    def print_it(self):
        for activities in self.chart:
            print('---')
            for activity in activities:
                print(activity.id,": ",activity.dkmax)
        

                

   
    
"""
Created: 23.05.18
Author: Dawid Lipinski

"""
import sys
import operator

class Brucker:
    def __init__(self, activities, machines_amount):
        self.activities = activities
        self.machines_amount = machines_amount
        self.chart = []
        self.time = 0
        
    def get_activities(self):
        return self.activities

    def get_activities_sorted_level(self):
        level_ids = {}
        for level in [a.level for a in self.activities]:
            level_ids[level]=[a.id for a in self.activities if a.level == level]
        return sorted(level_ids.items(), key=operator.itemgetter(0), reverse = True)

    def get_Limax(self):
        return max([a.Li for a in self.activities])

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
            orphan_ids = [a.id for a in self.activities if len(a.predecessors)==0]
            undone= [a for a in self.activities if a.done==False]
            my = []
            for activity in undone:
                isIt = True
                for predecessor in activity.predecessors:
                    predecessor_real = [a for a in self.activities if a.id == predecessor][0]
                    if predecessor_real.done == False:
                        isIt = False
                if isIt or activity.id in [orphan_ids]:
                    my.append(activity)
           
            my_activities =sorted(my, key=lambda x: x.dkmax, reverse=True)[:self.machines_amount]
            print([a.id for a in my_activities])
            self.chart.append(my_activities)

            for activity in my_activities:
                activity.done = True
                activity.Li =  self.time +  activity.dkmax
            
            self.time+=1
            if len(my_activities) == 0:
                break

    def print_it(self):
        for activities in self.chart:
            print('---')
            for activity in activities:
                print(activity.id,": ",activity.dkmax)
        

                

   
    
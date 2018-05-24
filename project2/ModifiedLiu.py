"""
Created: 23.05.18
Author: Dawid Lipinski

"""
from Graph import Graph

class ModifiedLiu:

    def __init__(self,activities):
        self.activities = activities
        self.graph = Graph(activities)
        self.chart = {}
        self.t = 0

    def get_activities(self):
        return self.activities

    def get_activities_by_id(self,ids):
        return [a for a in self.activities if a.id in ids]

    def get_dimax(self):
        return [a.dimax for a in self.activities]

    def get_Li(self):
        return [a.Li for a in self.activities]
    
    def get_Limax(self):
        return max([a.Li for a in self.activities])

    def get_Chart(self):
        return self.chart

    def get_last_activity(self):
        return [a.id for a in self.activities if len(a.successors) == 0][0]

    def fill_dimax(self):
        for activity in self.activities:
            current_activities_ids = self.graph.find_all_nodes(activity.id,self.get_last_activity())
            current_activities = self.get_activities_by_id(current_activities_ids)
            activity.dimax =  min([a.dj for a in current_activities])


    def fill_Li(self):
        while True:
            
            ready_activities = [a for a in self.activities if a.rj == self.t]
            for activity in ready_activities:
                activity.in_system = True
            
            running_activities = [a for a in self.activities if a.in_system == True and len([x for x in self.get_activities_by_id(a.predecessors) if x.done == False]) == 0]

            if running_activities:
                min_dimax_activity = min(running_activities, key=lambda x: x.dimax)
                min_dimax_activity.timer+=1
                self.chart[self.t]=min_dimax_activity.id
                if min_dimax_activity.timer == min_dimax_activity.pi:
                    min_dimax_activity.in_system = False
                    min_dimax_activity.done = True
                    min_dimax_activity.Li = self.t - min_dimax_activity.dimax + 1
            else:
                self.chart[self.t] = 'N'

            done_activities = [a for a in self.activities if a.done == True]
            if len(done_activities) == len(self.activities):
                break

            self.t+=1
            




            


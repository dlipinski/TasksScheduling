"""
Created: 23.05.18
Author: Dawid Lipinski

"""
from Machine import  Machine

class Activity:
    def __init__(self, id, machines, durations):
        self.id = id
        self.machines = []
        for x in range(machines):
            self.machines.append(Machine(x+1))
        for duration in durations:
            for x in range (duration[1],duration[2]):
                self.machines[duration[0]-1].activities_times.append(x)
            
    def get_activities_times_from_machine(self, machine_id):
        return self.machines[machine_id].activities_times            
    
    def __str__(self):
        string = "ID: A{}, ".format(self.id)
        for x in range(len(self.machines)):
            string+= "Machine: {}. Activity times: {};".format(self.machines[x].id,self.machines[x].activities_times)
        return string

   
    
  
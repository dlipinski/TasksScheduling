"""
Created: 23.05.18
Author: Dawid Lipinski

"""
import sys
import operator

class Johnson:

    def __init__(self, activities, machines_amount):
        self.activities = activities
        self.machines_amount = machines_amount

    def print_activities(self):
        for activity in self.activities:
            print(activity)

    def check_activities(self):
        for activity in self.activities:
            temp = []
            for machine in range(self.machines_amount):
                activity_times = activity.get_activities_times_from_machine(machine)
                for activity_time in activity_times:
                    if activity_time in temp:
                        raise ValueError('ERROR: One activity per time in one machine.')
                    else:
                        temp.append(activity_time)

            
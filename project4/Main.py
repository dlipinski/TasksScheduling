"""
Created: 23.05.18
Author: Dawid Lipinski

"""

from Activity import Activity
from Johnson import Johnson
from HTMLGenerator import HTMLGenerator

def main():
    activity_1 = Activity(1, 3, [[1,17,21],[2,21,22],[3,23,25]])
    activity_2 = Activity(2, 3, [[1,3,6],[2,6,9],[3,9,14]])
    activity_3 = Activity(3, 3, [[1,6,11],[2,11,13],[3,13,18]])
    activity_4 = Activity(4, 3, [[1,11,17],[2,17,18],[3,18,22]])
    activity_5 = Activity(5, 3, [[1,0,3],[2,3,5],[3,5,9]])
    activities = [activity_1,activity_2,activity_3,activity_4,activity_5]

    johnson = Johnson(activities,3)
    johnson.print_activities()
    johnson.check_activities()

    html = HTMLGenerator(3,activities)
    html.create_page()
    html.run()

if __name__ == "__main__":
    main()
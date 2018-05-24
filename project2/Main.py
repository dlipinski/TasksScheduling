"""
Created: 23.05.18
Author: Dawid Lipinski

"""
from Activity import Activity
from ModifiedLiu import ModifiedLiu
from HTMLData import HTMLData

def main():
    activity_1 = Activity(1,3,4,0,[3],[])
    activity_2 = Activity(2,2,6,4,[4],[])
    activity_3 = Activity(3,2,8,2,[5],[1])
    activity_4 = Activity(4,1,15,5,[5,6],[2])
    activity_5 = Activity(5,4,10,6,[7],[4])
    activity_6 = Activity(6,1,20,15,[7],[4])
    activity_7 = Activity(7,2,25,13,[],[5,6])
    
    activities = [activity_1,activity_2,activity_3,activity_4,activity_5,activity_6,activity_7]

    ml = ModifiedLiu(activities)
    ml.fill_dimax()
    ml.fill_Li()

    page = HTMLData(ml.get_Limax(),ml.get_Chart(),ml.get_activities())
    page.create_page()

    
if __name__ == "__main__":
    main()
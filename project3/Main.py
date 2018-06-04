"""
Created: 23.05.18
Author: Dawid Lipinski

"""
from Activity import Activity
from Brucker import Brucker
from HTMLData import HTMLData

def main():
    activities = [
    Activity(1, 16  ,[]     ,[2,3,6]),
    Activity(2, 20  ,[1]    ,[5]    ),
    Activity(3, 4   ,[1]    ,[4]    ),
    Activity(4, 3   ,[3]    ,[]     ),
    Activity(5, 15  ,[2]    ,[24,12,11]),
    Activity(6, 14  ,[1]    ,[7]    ),
    Activity(7, 17  ,[6]    ,[8]    ),
    Activity(8, 6   ,[7]    ,[9]    ),
    Activity(9, 6   ,[8]    ,[10]),
    Activity(10,4   ,[9]    ,[]),
    Activity(11,10  ,[5]    ,[15]),
    Activity(12,8   ,[5]    ,[13]),
    Activity(13,9   ,[12]   ,[14]),
    Activity(14,7   ,[13]   ,[]),
    Activity(15,10  ,[11]   ,[16]),
    Activity(16,9   ,[15]   ,[17]),
    Activity(17,10  ,[16]   ,[18]),
    Activity(18,8   ,[17]   ,[21,19]),
    Activity(19,2   ,[18]   ,[20]),
    Activity(20,3   ,[19]   ,[]),
    Activity(21,6   ,[18]   ,[22]),
    Activity(22,5   ,[21]   ,[23]),
    Activity(23,4   ,[22]   ,[]),
    Activity(24,11  ,[5]    ,[25]),
    Activity(25,12  ,[24]   ,[26]),
    Activity(26,9   ,[25]   ,[27]),
    Activity(27,10  ,[26]   ,[28]),
    Activity(28,8   ,[27]   ,[29]),
    Activity(29,7   ,[28]   ,[31,30]),
    Activity(30,5   ,[29]   ,[]),
    Activity(31,3   ,[29]   ,[32]),
    Activity(32,5   ,[31]   ,[])
    ]

    brucker = Brucker(activities,4)
    brucker.set_levels()
    brucker.set_d()
    #brucker.do_it()
    page = HTMLData(4,brucker.get_Limax(),brucker.get_activities(),brucker.get_activities_sorted_level(),brucker.get_chart())
    page.create_page()

if __name__ == "__main__":
    main()
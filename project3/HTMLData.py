"""
Created: 23.05.18
Author: Dawid Lipinski

"""
import webbrowser, os
from urllib.request import pathname2url

class HTMLData:

    def __init__(self,machines_amount,activities,levels,chart):
        self.machines_amount = machines_amount
        self.activities = activities
        self.levels = levels
        self.chart = chart

    def create_page(self):
        html_file= open("index.html","w+")
        html_file.write("<html>")
        html_file.write("""
        <style>
            body{
                background: grey;
            }
            div{
                display: table;
                background: lightgrey;
                padding: 10px;
                margin: 0 auto;
                text-align: center;
                margin-top: 10px;
                border-radius:10px;
            }
            td{
                width:50px;
                text-align:center;
                border:1px solid grey;
            }
            th{
                border-right: 1px solid grey;
                text-align:right;
            }
            table{
                background: white;
            }
        </style>
        """)
        html_file.write("<div> <h3>Brucker Alghoritm</h3> </div>")
        html_file.write("<div>Activities</div>")
        html_file.write("<div><table>")
        html_file.write("""
            <tr>
                <th>Activity</th>
                <th>dkmax</th>
                <th>Level</th>
                <th>successors</th>
                <th>predecessors</th>
            </tr>
        """)
        for activity in self.activities:
            html_file.write("""
                <tr>
                    <td>Z{}</td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>{}</td>
                </tr>
            """.format(activity.id,activity.dkmax,activity.level,activity.successors,activity.predecessors))
        html_file.write("</table></div>")
        html_file.write("<div>Levels</div>")
        html_file.write("<div><table>")
        html_file.write("""
            <tr>
                <th>Level</th>
                <th>Activities</th>
            </tr>
        """)
        for activities in self.levels:
            html_file.write("""
                <tr>
                    <td>{}</td>
                    <td style='width:auto'>{}</td>
                </tr>
            """.format(activities[0],activities[1]))
        html_file.write("</table></div>")
        html_file.write("<div>Chart</div>")
        html_file.write("<div><table>")
        html_file.write("<tr>")
        for number in range(1,self.machines_amount+1):
            html_file.write("<th>P{}</th>".format(number))
        html_file.write("</tr>")
        for time in self.chart:
            html_file.write("<tr>")
            for activities in time:
                 html_file.write("<td>Z{}</td>".format(activities.id))
            html_file.write("</tr>")
        for time in self.chart:
            for activities in time:
                print(activities)
        html_file.write("</table></div>")

        html_file.write("</html>")
        url = 'file:{}'.format(pathname2url(os.path.abspath('index.html')))
        webbrowser.open(url)
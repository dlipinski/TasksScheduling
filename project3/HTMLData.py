"""
Created: 23.05.18
Author: Dawid Lipinski

"""
import webbrowser, os
from urllib.request import pathname2url

class HTMLData:

    def __init__(self,machines_amount,Limax,activities,levels,chart):
        self.machines_amount = machines_amount
        self.activities = activities
        self.levels = levels
        self.chart = chart
        self.Limax = Limax

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
                padding:0; margin:0;
            }
            th{
                border-right: 1px solid grey;
                text-align:center;
            }
            table{
                background: white;
                border-collapse: collapse;
            }
        </style>
        """)
        html_file.write("<div> <h3>Brucker Alghoritm</h3> </div>")
        html_file.write("<div><h3>Limax: {}</h3></div>".format(self.Limax))
        html_file.write("<div>Activities</div>")
        html_file.write("<div><table>")
        html_file.write("""
            <tr>
                <th>Activity</th>
                <th>dkmax</th>
                <th>Li</th>
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
                    <td>{}</td>
                </tr>
            """.format(activity.id,activity.dkmax,activity.Li,activity.level,activity.successors,activity.predecessors,activity.done))
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
        trs = []
        for trs_amount in range(0,self.machines_amount):
            trs.append("<tr><th>P{}</th>".format(trs_amount+1))
        trs.append("<tr><th>T</th>")
        for idx, val in enumerate(self.chart):
            for idxx,vall in enumerate(val):
                trs[idxx] += "<td>Z{}</td>".format(vall.id)
            trs[-1]+="<td style='border: none; border-top:2px solid black;text-align:right'>{}</td>".format(idx+1)
        for tr in trs:
            tr += "</tr>"
            html_file.write(tr)
        html_file.write("</table></div>")
        html_file.write("</html>")
        url = 'file:{}'.format(pathname2url(os.path.abspath('index.html')))
        webbrowser.open(url)
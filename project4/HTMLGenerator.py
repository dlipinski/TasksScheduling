"""
Created: 23.05.18
Author: Dawid Lipinski

"""
import webbrowser, os
from urllib.request import pathname2url

class HTMLGenerator:

    def __init__(self,machines_amount,activities):
        self.machines_amount = machines_amount
        self.activities = activities
        self.head = "<html><head></head><body>"
        self.style = """
        <style>
        body{
            background: #93ffde;
        }
        #chart{
            
            background: white;
            border: 1px solid black;
        }
        #chart_th{
            padding: 0px 8px 0px 8px;
            text-align: right;
        }
        td{
            text-align: center;
        }
        h2{
            margin: 0 auto;
        }
        .act{
            border: 1px solid black;
        }
        .noact{
            background: grey;
        }
        table{
                margin: 0 auto;
                border-collapse: collapse;
        }
        </style>
        """
        self.foot = "</body></html>"

    def find_last_time(self):
        last_time = 0
        
        for activity in self.activities:
            for machine_id in range(self.machines_amount):
                if max(activity.get_activities_times_from_machine(machine_id)) > last_time:
                    last_time = max(activity.machines[machine_id].activities_times  )
        return last_time+1

    def generate_chart(self):
        columns = self.find_last_time()
        html = "<h2>Chart</h2><table id='chart'>"
        html += "<tr>"
        for column in range(columns):
            html += "<th id='chart_th'>{}</th>".format(column+1)
        html += "</tr>"
        for machine_id in range(self.machines_amount):
            html+="<tr>"
            for column in range(columns):
                activity_id = [a.id for a in self.activities if column in a.machines[machine_id].activities_times ]
                if activity_id:
                    html+="<td class='act'>{}</td>".format('A'+str(activity_id[0]))
                else:
                    html+="<td class='noact'></td>"

            html+="</tr>"
        html +="</table>"
        return html

    def create_page(self):
        html = self.head + self.style
        html += self.generate_chart()
        html += self.foot
        return html

    def run(self):
        html_file= open("index.html","w+")
        html_file.write(self.create_page())
        url = 'file:{}'.format(pathname2url(os.path.abspath('index.html')))
        webbrowser.open(url)        
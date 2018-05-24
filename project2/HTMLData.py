"""
Created: 23.05.18
Author: Dawid Lipinski

"""
import webbrowser, os
from urllib.request import pathname2url

class HTMLData:

    def __init__(self,Limax,chart_data, activities):
        self.Limax = Limax
        self.chart_data = chart_data
        self.activities = activities
    def get_color(self,id):
        if(id=='N'): return "black"
        else:
            number = id % 6
            return{
                0: "lightblue",
                1:  "#C5E17F",
                2:  "lightgreen",
                3:  "#FE8F7B",
                4:  "#8974FE",
                5:  "#74FEA0"
            }[number]
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
                margin-top: 50px;
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
                text-align:right;
            }
            table{
                background: white;

                border-collapse: collapse;
            }
        </style>
        """)
        html_file.write("<div> Modified Liu Alghoritm </div>")
        html_file.write("<div><table>")
        tr1 = "<tr>"
        tr2 = "<tr>"
        for time,activity_id in self.chart_data.items():
            tr1 += "<th>" +str(time+1)+ "</th>"
            tr2 += "<td style='background: {}'>".format(self.get_color(activity_id)) +str(activity_id)+ "</td>"
        tr1 += "</tr>"
        
        html_file.write(tr1)
        html_file.write(tr2)
        html_file.write("</table></div>")
        html_file.write("<div>Lmax: {} </div> ".format(str(self.Limax)))

        html_file.write("""
        <div><table>
        <tr>
            <th>Activity</th>
            <th>pi</th>
            <th>dj</th>
            <th>rj</th>
            <th>dimax</th>
            <th>Li</th>
        </tr>
        """)
        for activity in self.activities:
            html_file.write("""
            <tr>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
            </tr>
            """.format(activity.id,activity.pi,activity.dj,activity.rj,activity.dimax,activity.Li))
        html_file.write("</div></table>")
        html_file.write("</html>")
        url = 'file:{}'.format(pathname2url(os.path.abspath('index.html')))
        webbrowser.open(url)
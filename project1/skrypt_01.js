//jshint browser: true, esversion:6, jquery:true
$(() => {
    //Init nodes Array
    let nodes = [];

    
    //------------------------------------------------------------------------------------------------------------------------------------------------ DRAWING SHIT START
    var GO = go.GraphObject.make;
    var myDiagram =
    GO(go.Diagram, "myDiagramDiv",
        {
        "undoManager.isEnabled": true, // enable Ctrl-A to undo and Ctrl-Y to redo
        layout: GO(go.TreeLayout, // specify a Diagram.layout that arranges trees
                    { angle: 90, layerSpacing: 50 }),
                    initialDocumentSpot: go.Spot.TopCenter,
                    initialViewportSpot: go.Spot.TopCenter,
                    initialAutoScale: go.Diagram.Uniform
        });

    myDiagram.nodeTemplate =
    GO(go.Node, "Auto",
        GO(go.Panel,"Horizontal",
            GO(go.Shape, {margin: new go.Margin(0, 0, 0, 23), figure: "Ellipse",fill:"Lightblue", maxSize: new go.Size(50,50)}),
            GO(go.TextBlock, { margin: new go.Margin(0, 0, 0, 2),font: "bold 12pt serif" }, new go.Binding("text", "key")),
            GO(go.TextBlock,{ margin: new go.Margin(0, 0, 0, -57) , stroke: "red" ,font: "bold 14pt serif"} ,new go.Binding("text", "name"))
        )
    );
    var myModel = GO(go.GraphLinksModel);
    //------------------------------------------------------------------------------------------------------------------------------------------------ DRAWING SHIT END
    $('#wipeData').click( function () {
        if (confirm("You will lose your work. Sure?")) {
            nodes = [];
            drawGraph();
            drawTable();
            drawChart();
        } else {
            return;
        } 
    });
    function insertNode(index,children,duration){
        //check if index is integer
        if(!(Number.isInteger(parseInt(index)))) { alert('Index must be integer!');return false; }
        let childrenNotOk = false;
        for (let i=0;i<children.length;i++){
            if(!(Number.isInteger(parseInt(children[i])))) {childrenNotOk=true;}
        }
        if(childrenNotOk) { alert('Chidren must be list of integers!');return false; }
        //check if duration is integer
        if(!(Number.isInteger(parseInt(duration)))) { alert('Duration must be integer!');return false; }
        
        //check if ! activity -> activity
        if(children.includes(index)) { alert('No loops!');return false; }
        //reparse index
        index = 'A'+index;
        //reparse children
        for (let i=0;i<children.length;i++){
            children[i]='A'+children[i];
        }

        let newNode = {index, children,duration};

        //check if node with this index aready exists
        let exist = false;
        nodes.forEach ( (node) => { if(node.index === newNode.index) { exist = true; } } ) ;
        if(exist) { alert('Node with index \''+newNode.index+'\' arleady exists!'); }


        nodes.push(newNode);
        return true;

    }
    $('#loadSample').click( function () {
        if (confirm("You will lose your work. Sure?")) {
        nodes = [];
        insertNode(1,[3],2);
        insertNode(2,[3],2);
        insertNode(3,[5,6,7,8,9],1);
        insertNode(4,[8,9],2);
        insertNode(5,[],1);
        insertNode(6,[],1);
        insertNode(7,[],1);
        insertNode(8,[],1);
        insertNode(9,[],1);

        drawGraph();
        drawTable();
        drawChart();
        } else {
            return;
        } 
    });
    
    $('.click').click( function () {
        
        //get data
        let row = $(this).parent();
        let index = row.find('#index').val(); 
        let children = row.find('#children').val().split(',');
        let duration = row.find('#duration').val(); 

        if (index === ''  || duration === '') { alert('Fields can not be empty!'); return;}
        
        //insert new node
        if(!
            insertNode(index,children,duration)
        ){ return;}

        //clear inputs
        row.find('#index').val('');
        row.find('#children').val('');
        row.find('#duration').val('');

        


        drawGraph();
        drawTable();
        drawChart();
    });

    function drawGraph(){
        let nodesKeys = [];
        let nodesFrom = [];

        nodes.forEach ( (node) => { 
            nodesKeys.push({key: node.index, name: node.duration});
            node.children.forEach( (child) => {
                nodesFrom.push({from: node.index, to: child});
            }); 
        });
        myModel.nodeDataArray = nodesKeys;
        myModel.linkDataArray = nodesFrom;
        myDiagram.model = myModel;
        
    }

    function drawTable(){
        let tbody = $('#nodesTable').find('tbody');
        tbody.html('');
        nodes.forEach ( (node) => {  
            tbody.append($("<tr class='record'>")
            .append($('<td>').text(node.index))
            .append($('<td>').text(node.children))
            .append($('<td>').text(node.duration))
            .append($('<td>').text())
            );
        });  
    }

    function drawChart(){
        let chartTable = $('#chartTable');
        chartTable.html('');
        var table = new ActivityList();
        nodes.forEach ( (node) => { 
        
            let predecessors = [];
            nodes.forEach ( (nodeI) => {  
                if(nodeI.children.includes(node.index)) {predecessors.push(nodeI.index);}
            });
            table.addActivity( new Activity({
                id: node.index,
                duration: parseInt(node.duration),
                predecessors: predecessors
            }));
        });
        
    
        let drawNodes = [];
        table.getList();
        let lastEnd = 0;

        let nodesLength = nodes.length+1;

        for(let i=1;i<nodesLength;i++){
            let g= 'A'+i;
            drawNodes.push({id: g, start: table.getCriticalPath(g).est,end: table.getCriticalPath(g).eet });
            if(table.getCriticalPath(g).eet > lastEnd) { lastEnd = table.getCriticalPath(g).eet;}
        }
        let cpmDataTbody = $('#cpmData').find('tbody');
        cpmDataTbody.html('');
        //fill CPM Data
        drawNodes.forEach ( (drawNode) => {  
            cpmDataTbody.append($("<tr class='hoverTr' >")
            .append($('<td   style="width:28%;">').text(drawNode.id))
            .append($('<td  style="width:18%; border-left: 1px dotted lightgrey;">').text(table.getCriticalPath(drawNode.id).est))
            .append($('<td  style="width:18%;border-left: 1px dotted lightgrey;">').text(table.getCriticalPath(drawNode.id).eet))
            .append($('<td  style="width:18%;border-left: 1px dotted lightgrey;">').text(table.getCriticalPath(drawNode.id).lst))
            .append($('<td  style="width:18%;border-left: 1px dotted lightgrey; ">').text(table.getCriticalPath(drawNode.id).let))
            );
        });  

        function sortByKey(array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }


        drawNodes = sortByKey(drawNodes,'start');

        chartTable = $('#chartTable');
        let chartDivWidth = $('#chart').width();

        
        chartTable.append($('<tr>'));
        let lastTr = $('#chartTable tr:last');
        for(let j=0;j<lastEnd;j++){
            switch (j){
                case 0: lastTr.append($('<td style="text-align: right;padding-top:5px;width:'+(chartDivWidth/lastEnd)+'px;height:20px;">').text(j+1)); break;
                case (lastEnd-1): lastTr.append($('<td style="text-align: right;padding-top:5px;border-right:none;width:'+(chartDivWidth/lastEnd)+'px;height:20px;">').text(j+1)); break;
                default: lastTr.append($('<td style="text-align: right;padding-top:5px;width:'+(chartDivWidth/lastEnd)+'px;height:20px;">').text(j+1));

            }
          
        }
        chartTable.append($('<tr>'));
        lastTr = $('#chartTable tr:last');
        for(let j=0;j<lastEnd;j++){
            switch (j){
                case 0: lastTr.append($('<td style="padding-top:5px;border: 1px solid black;border-top:none;border-left:none;width:'+(chartDivWidth/lastEnd)+'px;height:10px;">')); break;
                case (lastEnd-1): lastTr.append($('<td style="padding-top:5px;border: 1px solid black;border-top:none;border-right:none;width:'+(chartDivWidth/lastEnd)+'px;height:10px;">')); break;
                default: lastTr.append($('<td style="padding-top:5px;border: 1px solid black;border-top:none;width:'+(chartDivWidth/lastEnd)+'px;height:10px;">'));
            }
          
        }
        
        function TdHtml (color,side) {
            let myTd = '<td style="padding: 5px;height: 20px;width: '+(chartDivWidth/lastEnd)+'px;';
            if(color!=='none'){
                myTd += 'background: ' + color+';';
            }else {
                myTd += 'border-left: 1px dotted lightgrey; '
            }

            if(side!=='none'){
                if (side === 'left') { myTd += 'border-radius: 10px 0px 0px 10px;';}
                if (side === 'right') { myTd += 'border-radius: 0px 10px 10px 0px;';}
                if (side === 'both') { myTd += 'border-radius: 10px 10px 10px 10px;';}
            } 
           
            myTd += ';">';
            return myTd;
        }

        function GiveColor (number) {
            switch(number%6) {
                case 0: return 'lightblue'; 
            case 1: return 'lightgreen';
            case 2: return 'lightcoral';
            case 3: return 'lightskyblue';
            case 4: return 'lightsalmon';
            case 5: return 'lightseagreen';
            }
        } 
        for(let i=0;i<nodesLength;i++){
            chartTable.append($('<tr>'));
            lastTr = $('#chartTable tr:last');
            for(let j=0;j<lastEnd;j++){
                if(j>=drawNodes[i].start && j<drawNodes[i].end){  
                    if(j===drawNodes[i].start && (j+1)===drawNodes[i].end) {lastTr.append($(TdHtml(GiveColor(i),'both')).text(drawNodes[i].id));}
                    if(j===drawNodes[i].start && (j+1)!==drawNodes[i].end) {lastTr.append($(TdHtml(GiveColor(i),'left')).text(drawNodes[i].id));}
                    if(j>drawNodes[i].start && j<drawNodes[i].end  && (j+1)!==drawNodes[i].end)  {lastTr.append($(TdHtml(GiveColor(i),'none')).text(drawNodes[i].id));}
                    if(j>drawNodes[i].start && j<drawNodes[i].end  && (j+1)===drawNodes[i].end)  {lastTr.append($(TdHtml(GiveColor(i),'right')).text(drawNodes[i].id));}

                }else {
                    lastTr.append($(TdHtml('none','none')));
                }
            }
        }
    }


});


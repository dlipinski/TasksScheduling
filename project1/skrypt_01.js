//jshint browser: true, esversion:6, jquery:true, devel: true
$(() => {
    //Init nodes Array
    let nodes = [];
    $('#filepicker').hide();
    $('#helpContent').hide();
    
    let myHeight = 0;
    //------------------------------------------------------------------------------------------------------------------------------------------------ DRAWING SHIT START
    var GO = go.GraphObject.make;
    var myDiagram =
    GO(go.Diagram, "myDiagramDiv",
        {"DocumentBoundsChanged": function(e) {
            var dia = e.diagram;
            $('#myDiagramDiv').height(dia.documentBounds.height);
          },
        "undoManager.isEnabled": true, // enable Ctrl-A to undo and Ctrl-Y to redo
        layout: GO(go.TreeLayout, // specify a Diagram.layout that arranges trees
                    { angle: 90, layerSpacing: 50 }),
                    initialDocumentSpot: go.Spot.TopCenter,
                    initialViewportSpot: go.Spot.TopCenter,
                    initialAutoScale: go.Diagram.Uniform
        });

    myDiagram.nodeTemplate =
    GO(go.Node, "Horizontal",
        
        GO(go.Panel,go.Panel.Auto,
            GO( go.Shape, "Circle",{ fill:"white",  desiredSize: new go.Size(50,50),portId: ""} ),
                GO(go.TextBlock,{  stroke: "darkred" ,font: "normal 14pt serif"} ,new go.Binding("text", "name"))
             
                
        ),
        GO(go.TextBlock, {font: "normal 12pt serif" }, new go.Binding("text", "key"))   
    );



    myDiagram.linkTemplate =
    GO(go.Link,
      { routing: go.Link.AvoidsNodes ,  // Orthogonal routing
        corner: 10 },  // link route should avoid nodes
      GO(go.Shape),
      GO(go.Shape, { toArrow: "Standard" })
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
    $('#help').click( function () {
        $('#helpContent').toggle();
    });
    $('#loadFromCsv').click( function () {
        let vis = $('#loadFromCsv').attr('pickerVisible');

        if(vis==='true'){
            $('#loadFromCsv').attr('pickerVisible','false');
            $('#filepicker').hide();
        }else{ 
            if (confirm("You will lose your work. Sure?")) {
                $('#loadFromCsv').attr('pickerVisible','true');
                $('#filepicker').show();
            } else {
                return;
            } 
        }
    });

    $('#filepicker').on( 'input', function () {
        if (!window.FileReader) {
            alert('Your browser is not supported');
        }
        var input =  $('#filepicker').get(0);
        
        // Create a reader object
        var reader = new FileReader();
        if (input.files.length) {
            var textFile = input.files[0];
            reader.readAsText(textFile);
            $(reader).on('load', processFile);
        } else {
            alert('Please upload a file before continuing');
        } 
    });

    function processFile(e) {
        var file = e.target.result,
            results;
        if (file && file.length) {
            let dataLines = file.split('\n');
            
            dataLines.forEach ( (line) => { 
                let nodeData = line.split(';');
                insertNode(nodeData[0],nodeData[1].split(','),nodeData[2]);
            });
                drawGraph();
                drawTable();
                drawChart();
            
        }
    }

//------------------------------------------------------------------------------- DETECT CYCLE
    function getNodeChildren(node){
        let children = [];
        
        for(let i=0; i< node.children.length;i++){
            for(let j=0;j<nodes.length;j++){
                if(node.children[i]===nodes[j].index){
                    children.push(nodes[j]);
                }
            }
        }
        return children;
    }
    
    function copy(o) {
        var output, v, key;
        output = Array.isArray(o) ? [] : {};
        for (key in o) {
            v = o[key];
            output[key] = (typeof v === "object") ? copy(v) : v;
        }
        return output;
    }

    function detectCycle(index,children,duration){

        let graphNodes = copy(nodes);
        const visited= {};
        const recStack = {};

        for( let i=0;i<graphNodes.length;i++){
            const node = graphNodes[i];
            if(detectCycleUtil(node,visited,recStack)){
                return true;
            }
        }
        return false;
    }

    function detectCycleUtil(vertex, visited, recStack) {
        if(!visited[vertex.index]){
            
            visited[vertex.index] = true;
            recStack[vertex.index] = true;
            const nodeChildren = getNodeChildren(vertex);
            for(let i = 0; i< nodeChildren.length; i++){
                const currentNode = nodeChildren[i];
                if(!visited[currentNode.index] && detectCycleUtil(currentNode,visited,recStack)){
                    return true;
                } else if (recStack[currentNode.index]){
                    return true;
                }
            }
        }
        recStack[vertex.index] = false;
        return false;
    }
//-------------------------------------------------------------------------------
    function validNode(index,children,duration,create){
        //check if index is integer
        if(!(Number.isInteger(parseInt(index)))) { alert('Index must be integer!');return false; }
        
        //check children
        let childrenNotIntegers = false;
        if(children.length ===1 && children[0]==''){
            children=[];
        } else {
            for (let i=0;i<children.length;i++){
                if(!(Number.isInteger(parseInt(children[i])))) {childrenNotIntegers=true;}
            }
        }
        if(childrenNotIntegers) { alert('Chidren must be list of integers!');return false; }
        
        //check if duration is integer
        if(!(Number.isInteger(parseInt(duration)))) { alert('Duration must be integer!');return false; }
        
        //check if node with this index aready exists if not edit
        if(create){
            let exist = false;
            nodes.forEach ( (node) => { if(node.index === ('A'+index)) { exist = true; } } ) ;
            if(exist) { alert('Node with index \''+index+'\' arleady exists!'); return false; }
        }
        
        //check if not father to itself
        if(children.includes(index)) { alert('No loops!');return false; }

        //Check if children does not include fathers
    
        if(detectCycle(index,children,duration)){ alert('No loops!');return false; }
        
    
        return true;
    }
    function deleteNode(index){
        for(let i=0;i<nodes.length;i++){
            if(nodes[i].index===index){
                nodes.splice(i,1);
            }
        }
    }
    function editNode(index,children,duration){
        if(!(validNode(index,children,duration,false))) {return;}
        //reparse index
        index = 'A'+index;
        //reparse children
        if(!(children.length ===1 && children[0]=='')){
            for (let i=0;i<children.length;i++){
                children[i]='A'+children[i];
            }
        }
        nodes.forEach ( (node) => { 
            if(node.index === index) {
                node.children = children;
                node.duration = duration;
            }
        });
        drawGraph();
        drawTable();
        drawChart();

    }

    function insertNode(index,children,duration){
        
        if(!(validNode(index,children,duration,true))) {return;}
        
        //reparse index
        index = 'A'+index;
        //reparse children
        if(!(children.length ===1 && children[0]=='')){
            for (let i=0;i<children.length;i++){
                children[i]='A'+children[i];
            }
        }

        let newNode = {index, children, duration};



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
        if(!insertNode(index,children.slice(0),duration)){ return;}

        //clear inputs
        row.find('#index').val('');
        row.find('#children').val('');
        row.find('#duration').val('');

        drawGraph();
        drawTable();
        drawChart();
    });

    function drawGraph(){
        // Model.addNodeDataCollection and GraphLinksModel.addLinkDataCollection.
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
            tbody.append($("<tr class='hoverTr' id='actable'>")
            .append($('<td id ="index" class = "actableElement" style="">').text(node.index))
            .append($('<td id = "children" class = "actableElement" style="border-left: 1px dotted lightgrey;">').text(node.children))
            .append($('<td id="duration" class = "actableElement" style="border-left: 1px dotted lightgrey;">').text(node.duration))
            .append($('<td  style="border-left: 1px dotted lightgrey; " class="save">').text('save'))
            );
        });  

        $('.save').hide();
        $('td.actableElement').attr('isOpen','false');

        $('td.actableElement').dblclick( function () {
            if($(this).attr('isOpen')=='true'){
                return;
            }
            $(this).attr('isOpen','true');
            let value = $(this).html().replace(/\A/g, '');
            $(this).html('');
            $(this).append($('<input>',{
                val: value,
                id: $(this).attr('id')
            }));
            $(this).parent().find('.save').show();

        });

        $('.save').click( function () {
            let row = $(this).parent();
            row.find('save').hide();
            let index = row.find('input#index').val() || row.find('td#index').html();
            let children1 = row.find('input#children').val() ||    row.find('td#children').html() ;
            let duration = row.find('input#duration').val() || row.find('td#duration').html();
            
            if(children1.indexOf('input')>=0) { children1 = ''; }
            let children  = [];
            children = children1.replace(/\A/g, '').split(',');
            
            //console.log({index: index.replace(/\A/g, ''),children,duration});

            editNode(index.replace(/\A/g, ''),children,duration);
          
   
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
                myTd += 'border-left: 1px dotted lightgrey; ';
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


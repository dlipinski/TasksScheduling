//jshint browser: true, esversion:6, jquery:true
$(() => {
    //-------------------------------
    let nodes = [];
    let machines = 1;

    //shit for drawing
    var GO = go.GraphObject.make;
    var myDiagram =
    GO(go.Diagram, "myDiagramDiv",
        {
        "undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
        layout: GO(go.TreeLayout, // specify a Diagram.layout that arranges trees
                    { angle: 90, layerSpacing: 40 }),
                    initialDocumentSpot: go.Spot.TopCenter,
                    initialViewportSpot: go.Spot.TopCenter,
                    initialAutoScale: go.Diagram.Uniform
        });

        myDiagram.nodeTemplate =
        GO(go.Node, "Auto",
            GO(go.Panel,"Horizontal",
                GO(go.Shape, {margin: new go.Margin(0, 0, 0, 10), figure: "Ellipse",fill:"Lightblue", maxSize: new go.Size(50,50)}),
                GO(go.TextBlock, { margin: new go.Margin(0, 0, 0, 0),font: "bold 12pt serif",text: "Z" }, new go.Binding("text", "key")),
                GO(go.TextBlock,{ margin: new go.Margin(0, 0, 0, -44) , stroke: "red" ,font: "bold 14pt serif"} ,new go.Binding("text", "name"))
            )
        
        );
    var myModel = GO(go.GraphLinksModel);
    drawGraph();

    $('#machinesMinus').click( function () {if(machines===1){alert('Already 1 machine!');return;} machines--; $('#machinesAmount').html(machines);});
    $('#machinesPlus').click( function () {machines++; $('#machinesAmount').html(machines);});

    $('#loadSample').click( function () {
        
        if (confirm("You will lose your work. Sure?")) {
        nodes = [];
        nodes.push(        {index: 1, children: [3], value: '2'}    );
        nodes.push(        {index: 2, children: [3], value: '2'}    );
        nodes.push(        {index: 3, children: [5,6,7,8,9], value: '1'}    );
        nodes.push(        {index: 4, children: [8,9], value: '2'}    );
        nodes.push(        {index: 5, children: [], value: '1'}    );
        nodes.push(        {index: 6, children: [], value: '1'}    );
        nodes.push(        {index: 7, children: [], value: '1'}    );
        nodes.push(        {index: 8, children: [], value: '1'}    );
        nodes.push(        {index: 9, children: [], value: '1'}    );
        drawGraph();
        drawTable();
        machines = 3;
        $('#machinesAmount').html(machines);
        } else {
            return;
        } 
    });
    $('.click').click( function () {
        //errors array
        let errors=[];
        //get values
        let row = $(this).parent();
        let index = row.find('#index').val();
        let children = row.find('#children').val().split(',');
        let value = row.find('#value').val();
        if (index == ''  || value == '') { errors.push('Fields can not be empty!');}
        //clear inputs
        row.find('#parent').val('');
        row.find('#child').val('');
        row.find('#value').val('');

        //check if node with this index aready exists
        let exist = false;
        nodes.forEach ( (node) => { if(node.index === index) { exist = true; } } ) ;
        if(exist) { errors.push('Node with index '+index+' arleady exists!'); }

        //return if errors
        if(errors.length>0) {alert(errors);return;}
        //insert new node
        nodes.push({index,children,value});

        //draw rows
        drawTable();
        //draw graph
        drawGraph();  
    });
    function drawGraph(){
        let nodesKeys = [];
        let nodesFrom = [];

        nodes.forEach ( (node) => { 
            nodesKeys.push({key: node.index, name: node.value});
            node.children.forEach( (child) => {
                nodesFrom.push({from: node.index, to: child});
            }); 
        });
        myModel.nodeDataArray = nodesKeys;
        myModel.linkDataArray = nodesFrom;
        myDiagram.model = myModel;
        
    };

    function drawTable(){
        let tbody = $('#nodesTable').find('tbody');
        tbody.find('.record').empty();
        nodes.forEach ( (node) => {  
            tbody.append($("<tr class='record'>")
            .append($('<td>').text(node.index))
            .append($('<td>').text(node.children))
            .append($('<td>').text(node.value))
            .append($('<td>').text())
            );
        });  
    }


});


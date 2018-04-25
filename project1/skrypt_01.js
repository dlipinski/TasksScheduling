//jshint browser: true, esversion:6, jquery:true
$(() => {
    let nodes = [];

    $('.click').click( function () {
        //get values
        let row = $(this).parent();
        let parent = row.find('#parent').val();
        let child = row.find('#child').val();
        let value = row.find('#value').val();

        //clear inputs
        row.find('#parent').val('');
        row.find('#child').val('');
        row.find('#value').val('');

        //insert new node
        nodes.push({parent,child,value});
        
        //add node row rows
        $('#nodesTable').find('tbody')
        .append($('<tr>')
            .append($('<td>').text(parent))
            .append($('<td>').text(child))
            .append($('<td>').text(value))
            .append($('<td>').text())
        );

    });


//$('#myTable tr:last').after('<tr>...</tr><tr>...</tr>');

    /*
    $('tr').click( function () {
        $('tr').removeClass('yellow');
        $(this).addClass('yellow');
    });
    $(this).keydown( function (e) {
        let row = $('.yellow');
        if(e.key === "ArrowUp"){
            row.insertBefore(row.prev());
        }
        if(e.key === "ArrowDown"){
            row.insertAfter(row.next());
        } 
    });
    $('td').dblclick( function () {
        let val = $(this).text();
        $(this).empty();
        $(this).append(
            $('<input>', {
                type: 'text',
                val: val
            })
        );
        $(this).children().first().keyup( function (e) {
            if (e.key === "Enter") {
                val = $(this).val();
                $(this).parent().text(val);
                $(this).remove();     
            }
        });
    });*/
});

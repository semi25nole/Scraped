// Grab the articles as a json
$("#butt").on("click", function() {
    $.getJSON("/all", function(data) {
        //console.log(data);
        var lines = data;
        var output = '';
        $.each(data, function(i, element) {
            output += `<div class="text-center">
                            <h4 class="title" style="margin-top: 20px">'${element.title}</h4>
                            <br>
                            <img src="${element.photo}" alt="photo" style="height: 300px; width: 500px">
                            <br>
                            <p style="margin-top: 20px">'${element.excerpt}'</p>
                            <br>
                            <a href="${element.link}">'${element.link}'</a>
                            <br>
                            <textarea type="text" id="note" style="width: 300px; height: 200px; margin-top: 20px; margin-bottom: 20px"></textarea>
                            <br>
                            <button class="btn btn-warning btn-small" id="submit" style="margin-bottom: 20px">Add Note</button>
                            <button class="btn btn-primary btn-small" id="delete" style="margin-left: 20px; margin-bottom: 20px">Delete Note</button>
                            </div>`
        })

        $('#info').html(output);

        });

    });


$(document).on("click", "#refresh", function() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/scrape",
        success: function(response) {
            console.log("updated");
        }
    });
});


$(document).on("click", "#submit", function() {

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/submit",
        data: {
            note: $("#note").val(),
            created: Date.now()
        }
    })

        .done(function(data) {

            console.log(data);

        });

    $("#note").val("");

});

$(document).on("click", "#delete", function() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/clear",
        success: function(response) {
            console.log("deleted");
        }
    });
});



























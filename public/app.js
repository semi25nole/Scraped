// Grab the articles as a json
$("#butt").on("click", function() {
    $.getJSON("/all", function(data) {
        //console.log(data);
        var lines = data;
        var output = '';
        $.each(data, function(i, element) {
            output += `
                   <div class=row>
                        <div class="col-md-6">
                            <div class="text-center">
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
                            </div>       
                        </div>
                        <div class="col-md-6">
                            <div class="text-center">
                                <div id="saved">
                                
                                </div>                            
                            </div>
                        </div>
                   </div>`
        })

        $('#info').html(output);
        cleared();

        });

    });


function saved() {
    $.getJSON("/note", function(data) {
        var notes = data;
        var output = '';
        $.each(data, function(i, element) {
            output += `
                          <p style="margin-top: 20px" id=' + "${element.data._id}" + '>'${element.note}'</p>
                         `
        });
    });
};


$(document).on("click", "#submit", function() {
    $.ajax({
        method: "POST",
        dataType: "json",
        url: "/submit",
        data: {
            note: $("#note").val(),
            created: Date.now()
        }
    }).done(function(data) {

        $("#note").val("");

    });

   saved();

});


function cleared() {
    $.ajax({
        method: "GET",
        dataType: "json",
        url: "/clear",
        success: function(response) {
            $("#saved").empty();
        }
    });
};






















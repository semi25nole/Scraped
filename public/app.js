// Grab the articles as a json
$("#butt").on("click", function() {
    $.getJSON("/all", function(data) {
        //console.log(data);
        let lines = data;
        let output = '';
        $.each(data, function(i, element) {
            output += `
                        <div class=row>
                            <div class="col-md-12">
                                <div class="text-center">
                                    <h4 class="title">'${element.title}</h4>
                                    \n
                                    <img src="${element.photo}" alt="photo">
                                    <p>'${element.excerpt}'</p>
                                    <a href="${element.link}">'${element.link}'</a>
                                </div>
                            </div>
                        </div>`
        })

        $('#info').html(output);

        });

    });











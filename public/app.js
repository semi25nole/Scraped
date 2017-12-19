// Grab the articles as a json
$("#butt").on("click", function() {
    $.getJSON("/all", function(data) {
        var title = [];
        var link = [];
        var excerpt = [];
            for(var i = 0; i < data.length; i++) {
                title.push(data[i].title);
                link.push(data[i].link);
                excerpt.push(data[i].excerpt);
            }
            console.log(title);
            console.log(link);
            console.log(excerpt);
        });
    });








$(document).on("pageinit", "#page1", function () {
            $("#autocomplete").on("listviewbeforefilter", function (e, data) {
                var $ul = $(this),
                    $input = $(data.input),
                    value = $input.val(),
                    html = "";
                $ul.html("");
                if (value && value.length > 2) {
                    $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
                    $ul.listview("refresh");
                    $.ajax({
                        url: "http://bmsandroid.net.mandrake.arvixe.com/api/Clientes/GetBuscarClientes",
                        type: "GET",
                        dataType: "jsonp",
                        crossDomain: true,
                        data: {
                            estab: "1",
                            filtro: $input.val()
                        }
                    })
                    .then(function (response) {
                        $.each(response, function (i, val) {
                            html += "<li>" + val.nombre + "<ul><li> Código: " + val.codigo + "</li></ul></li>";
                        });
                        $ul.html(html);
                        $ul.listview("refresh");
                        $ul.trigger("updatelayout");
                    });
                }
            });
        });
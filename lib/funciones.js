/*global numeral,FastClick*/
    /*++++++++++++++++++++ Variables BMS  ++++++++++++++++++++++++++ */
var bmsUser;
var bmsEstab = "";
var bmsTipo; //Pedido o Cobranza
var bmsServer;
     /*+++++++++++++++++++++ Pedido    +++++++++++++++++++++++++++++++ */
var bmsCliente = "";
var bmsLineaDetalle = [];
var bmsFecha = new Date();
var bmsNotas = "";
var bmsPedImporte = 0.00;
var bmsPedIva = 0.00;
var bmsPedTotal = 0.00;
     /*+++++++++++++++++++++ Cliente   +++++++++++++++++++++++++++++++ */
var bmsLPV;
var bmsCondPago;
var bmsSaldo = 0;
var bmsSucursal;
     /*+++++++++++++++++++++ Productos +++++++++++++++++++++++++++++++ */
var bmsProducto;
var bmsUnidad;
var bmsCantidad = 0;
var bmsPeso;
var bmsVolumen;
var bmsPrecio;
var bmsProdImporte;
var bmsProdIva;
var bmsProdTotal;
    /*+++++++++++++++++++++ Unidades +++++++++++++++++++++++++++++++ */
var bmsUnidadAbrev;
var bmsUnidadNombre;

var prodObj = {};
var prodObjModif = {};
var iProdObjModif = -1;

     /*+++++++++++++++++++++ --------- +++++++++++++++++++++++++++++++ */
     //var currentTime = new Date();

function producto(codigo, descripcion, unidad, unidadAbrev, cantidad,  peso, volumen, precio, importe, iva, total) {
    this.codigo = codigo;
    this.descripcion = descripcion;
    this.unidad = unidad;
    this.unidadAbrev = unidadAbrev;
    this.cantidad = cantidad;
    this.peso = peso;
    this.volumen = volumen;
    this.precio = precio;
    this.importe = importe;
    this.iva = iva;
    this.total = total;
}
function logGlobal(){
    console.log('***DEBUGGING LOG - [Page: logGlobal()] [\n'+         '******* PEDIDO *******' +'\n' +
                                                                      'Data: bmsCliente = ' + bmsCliente + '\n' +
                                                                      'Data: bmsFecha = ' + bmsFecha + '\n' +
                                                                      'Data: bmsNotas = ' + bmsNotas + '\n' +
                                                                      'Data: bmsPedImporte = ' + bmsPedImporte + '\n' +
                                                                      'Data: bmsPedIva = ' + bmsPedIva + '\n' +
                                                                      'Data: bmsPedTotal = ' + bmsPedTotal + '\n' +
                                                                      '******* CLIENTE *******' +'\n' + 
                                                                      'Data: bmsLPV = ' + bmsLPV + '\n' +
                                                                      'Data: bmsCondPago = ' + bmsCondPago + '\n' + 
                                                                      'Data: bmsSaldo = ' + bmsSaldo + '\n' + 
                                                                      'Data: bmsSucursal = ' + bmsSucursal + '\n' + 
                                                                      '******* PRODUCTO *******' +'\n' +
                                                                      'Data: bmsProducto = ' + bmsProducto + '\n' +
                                                                      'Data: bmsUnidad = ' + bmsUnidad + '\n' +
                                                                      'Data: bmsUnidadAbrev = ' + bmsUnidadAbrev + '\n' + 
                                                                      'Data: bmsUnidadNombre = ' + bmsUnidadNombre + '\n' +  
                                                                      'Data: bmsCantidad = ' + bmsCantidad + '\n' + 
                                                                      'Data: bmsPeso = ' + bmsPeso + '\n' +
                                                                      'Data: bmsVolumen = ' + bmsVolumen + '\n' +
                                                                      'Data: bmsPrecio = ' + bmsPrecio + '\n' + 
                                                                      'Data: bmsProdImporte = ' + bmsProdImporte + '\n' + 
                                                                      'Data: bmsProdIva = ' + bmsProdIva+ '\n' +
                                                                      'Data: bmsProdTotal = ' + bmsProdTotal + '\n' +                                                                      
                                                                      'Data: prodObj = ' + JSON.stringify(prodObj) + '\n' +

         ']');
}

      // Manejo de base de datos 

      // global variables DB
var db;
var shortName = 'WebSqlDB';
var version = '1.0';
var displayName = 'WebSqlDB';
var maxSize = 65535;

function alertBox(msg, cb, title, btnName){
      navigator.notification.alert(
            msg,        // message
            cb,         // callback
            title,      // title
            btnName     // buttonName
        );
}

function cdDefault(){
//CallBack del alertBox:Hacer algo.
}

//SWIPE LIST
    $(document).on( "pageshow", "#pedidoDetalle", function() {
        //alert("Estamos en pageshow #pedidoDetalle");
        $('#list').empty();
        var length = bmsLineaDetalle.length,
            obj    = null,
            html   = "",
            i; 
        
            for (i = 0; i < length; i++) {
                obj = bmsLineaDetalle[i];
                html +=  "<li class='"+"item"+"'data-value='"+obj.codigo+"'><a href="+"'#'"+"><p class="+"topic"+">"+ obj.descripcion +"</p><p class="+"topic"+"><strong>Cant: </strong>"+ obj.cantidad+"</p><p class="+"topic"+"><strong>Unidad: </strong>"+obj.unidadAbrev+"</p><p><strong>Importe: </strong>"+numeral(obj.importe).format('$0,0.00')+"</p><p><strong>IVA: </strong>"+numeral(obj.iva).format('$0,0.00')+"</p><p><strong>TOTAL: </strong>"+numeral(obj.total).format('$0,0.00')+"</p></a><a href="+"#"+" class="+"delete"+">Delete</a></li>";
            }
            $('#list').append(html);
            $( "#list" ).listview( "refresh" );
    
    function confirmAndDelete( listitem, transition, i ) {
        // Highlight the list item that will be removed
        listitem.addClass( "ui-btn-down-d" );
        // Inject topic in confirmation popup after removing any previous injected topics
        $( "#confirm .topic" ).remove();
        listitem.find( ".topic" ).clone().insertAfter( "#question" );
        // Show the confirmation popup
        $( "#confirm" ).popup( "open" );
        // Proceed when the user confirms
        $( "#confirm #yes" ).on( "click", function() {
            // Remove with a transition
            if ( transition ) {
                listitem
                    // Remove the highlight
                    .removeClass( "ui-btn-down-d" )
                    // Add the class for the transition direction
                    .addClass( transition )
                    // When the transition is done...
                    .on( "webkitTransitionEnd transitionend otransitionend", function() {
                        // ...the list item will be removed
                        
                        var eliminado = bmsLineaDetalle.splice(i,1);
                        alertBox("Producto eliminado: " + eliminado[0].descripcion + " Cant. "+eliminado[0].cantidad + " Importe. " + numeral(eliminado[0].importe).format('$0,0.00'), "cbDefault()", "BMS Móvil", "OK");
                        //alert("Producto eliminado: " + eliminado[0].descripcion + " Cant. "+eliminado[0].cantidad + " Importe. " + numeral(eliminado[0].importe).format('$0,0.00'));
                        listitem.remove();
                        actualizaTotalesPedido();
                        // ...the list will be refreshed and the temporary class for border styling removed
                        $( "#list" ).listview( "refresh" ).find( ".ui-li.border" ).removeClass( "border" );
                    })
                    // During the transition the previous list item should get bottom border
                    .prev( "li.ui-li" ).addClass( "border" );
            }
            // If it's not a touch device or the CSS transition isn't supported just remove the list item and refresh the list
            else {
                var eliminado = bmsLineaDetalle.splice(i,1);
                        alertBox("Producto eliminado: " + eliminado[0].descripcion + " Cant. "+eliminado[0].cantidad + " Importe. " + numeral(eliminado[0].importe).format('$0,0.00'), "cbDefault()", "BMS Móvil", "OK");
                        //alert("Producto eliminado: " + eliminado[0].descripcion + " Cant. "+eliminado[0].cantidad + " Importe. " + numeral(eliminado[0].importe).format('$0,0.00'));
                listitem.remove();
                actualizaTotalesPedido();
                $( "#list" ).listview( "refresh" );
            }
        });
        // Remove active state and unbind when the cancel button is clicked
        $( "#confirm #cancel" ).on( "click", function() {
            listitem.removeClass( "ui-btn-down-d" );
            $( "#confirm #yes" ).off();
        });
    }   
    $(document).on('pagehide', function () { $(this).off('swipeleft swiperight'); });    
    // Swipe to remove list item
    $(document).on( "swipeleft", "#list li.ui-li", function( event ) {
        //alert("Estamos en event #pedidoDetalle");

        var i = $(this).index();
        event.stopPropagation();
        var listitem = $( this ),
            // These are the classnames used for the CSS transition
            dir = "left", //event.type === "swipeleft" ? "left" : "right",
            // Check if the browser supports the transform (3D) CSS transition
            transition = $.support.cssTransform3d ? dir : false;
            confirmAndDelete( listitem, transition, i );
    });
    // If it's not a touch device...
    if ( ! $.mobile.support.touch ) {
        // Remove the class that is used to hide the delete button on touch devices
        $( "#list" ).removeClass( "touch" );
        // Click delete split-button to remove list item
        $( ".delete" ).on( "click", function() {
            var i = $(this).parent("li.ui-li").index(),
            listitem = $( this ).parent( "li.ui-li" );
            confirmAndDelete( listitem, false, i );
        });
    }
});

function errorHandler(transaction, error) {
    alert('Error: ' + error.message + ' code: ' + error.code);
}

function successCallBack() {
 //alert("DEBUGGING: success");
}

function nullHandler() {}

function renderEntries(tx, result) {
         //alert("DEBUGGING: We are on renderEntries()");
    if (result.rows.length == 0) {
        console.log("No se trajo registros con el SELECT");
    } else {
        var row = result.rows.item(0);
        console.log('***DEBUGGING LOG - [Page: Config - SQL SELECT] [Data: row.serverText  ' + row.serverText);
        document.getElementById("config_servidor").value = row.serverText;
        console.log('***DEBUGGING LOG - [Page: Config] [Data: bmsServer =  ' + row.serverText);
        bmsServer = row.serverText;
    }
}

function queryDB() {

    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    db.transaction(function(transaction) {
        transaction.executeSql('SELECT serverText FROM Config ORDER BY serverId DESC LIMIT 1;', [], renderEntries, errorHandler);
    }, errorHandler, nullHandler);
    return;
}

      // called when the application loads 
function onBodyLoad() {

 //alert("DEBUGGING: we are in the onBodyLoad() function"); 

    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }

    db = window.openDatabase(shortName, version, displayName, maxSize);
    queryDB();

 // this line will try to create the table User in the database just created/openned 
    db.transaction(function(tx) {
     //tx.executeSql( 'CREATE TABLE IF NOT EXISTS Config(serverId INTEGER NOT NULL PRIMARY KEY, serverText TEXT NOT NULL)',[],nullHandler,errorHandler);
        tx.executeSql('CREATE TABLE IF NOT EXISTS Config(serverId INTEGER NOT NULL PRIMARY KEY, serverText TEXT NOT NULL)', [], nullHandler, errorHandler);
    }, errorHandler, successCallBack);
 //alert('DB Created!');
}

      // list the values in the database to the screen using jquery to update the ##config_servidor element 

function AddValueToDB() {

    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }

    bmsServer = $('#config_servidor').val();
    db.transaction(function(transaction) {
        transaction.executeSql('INSERT INTO Config(serverText) VALUES (?)', [bmsServer],
            nullHandler, errorHandler);
        console.log('***DEBUGGING LOG - [Page: config] [Data: bmsServer = ' + bmsServer + ']');
        alert('Información guardada: ' + bmsServer);
    });

    return false;
}

function validateForm() {
    var x = document.forms["Login"]["text1"].value,
    y = document.forms["Login"]["text2"].value,
    band = true;
    bmsServer = document.getElementById("config_servidor").value;
    
    if (x == null || x == "") {
        alertBox("Por favor indique su nombre de usuario.", "cbDefault()", "BMS Móvil", "OK");
        //alert("Por favor indique su nombre de usuario.");
        band = false;
        return band;
    }  
    if (y == null || y == "") {
        alertBox("Por favor indique su contraseña.", "cbDefault()", "BMS Móvil", "OK");
        //alert("Por favor indique su contraseña.");
        band = false;
        return band;
    }  
    if (bmsServer == null || bmsServer == "") {
     alertBox("Por favor indique un servidor en el panel de configuración.", "cbDefault()", "BMS Móvil", "OK");
     //alert("Por favor indique un servidor en el panel de configuración.");
        band = false;
        return band;
    }
    return true;
}

function limpiaProducto(){
    //Limpia el formulario de producto y se resetean las variables globales de los valores de pedido
    $('#productos_txtProducto').val('');
    $('#productos_listaUnidad').empty();
    $('#productos_txtCantidad').val('');
    $('#productos_txtPeso').val('');
    $('#productos_txtVolumen').val('');
    $('#productos_txtPrecioUni').val('');
    $('#productos_txtImporte').val('');
    $('#productos_txtIva').val('');
    $('#productos_txtTotal').val('');

    $('#productosEditar_txtProducto').val('');
    $('#productosEditar_listaUnidad').empty();
    $('#productosEditar_txtCantidad').val('');
    $('#productosEditar_txtPeso').val('');
    $('#productosEditar_txtVolumen').val('');
    $('#productosEditar_txtPrecioUni').val('');
    $('#productosEditar_txtImporte').val('');
    $('#productosEditar_txtIva').val('');
    $('#productosEditar_txtTotal').val('');

    //Limpiar variables
    bmsProdImporte = 0;
    bmsProdIva = 0;
    bmsProdTotal = 0;
    prodObj = {};
    prodObjModif = {};
    iProdObjModif = -1;

    bmsProducto = "";
    bmsUnidad = "";
    bmsCantidad = 0;
    bmsPeso = 0;
    bmsVolumen = 0;
    bmsPrecio = 0.0;

    bmsUnidadAbrev = "";
    bmsUnidadNombre = "";
}

function nuevoPedido(){
        limpiaProducto();
        $('form').clearForm();
        bmsCliente = "";
        
        bmsLineaDetalle = [];
        bmsFecha = new Date();
        bmsNotas = "";
        bmsPedImporte = 0.00;
        bmsPedIva = 0.00;
        bmsPedTotal = 0.00;
        document.getElementById("pedido_txtImporte").value = numeral(bmsPedImporte).format('$0,0.00');
        document.getElementById("pedido_txtIva").value = numeral(bmsPedIva).format('$0,0.00');
        document.getElementById("pedido_txtTotal").value = numeral(bmsPedTotal).format('$0,0.00');
        document.getElementById("pedido_dtpFecha").valueAsDate = bmsFecha;
        document.getElementById("config_servidor").value = bmsServer;
     }
     function actualizaTotalesPedido() {
        var length = bmsLineaDetalle.length,
            obj    = null,
            i;
            bmsPedImporte = 0;
            bmsPedIva = 0;
            bmsPedTotal = 0; 
        if (length !== 0) {
            for (i = 0; i < length; i++) {
                obj = bmsLineaDetalle[i];
                bmsPedImporte += obj.importe;
                bmsPedIva += obj.iva;
                bmsPedTotal += obj.total;
            }    
        }
        if (length == 0) {
            bmsPedImporte = 0;
            bmsPedIva = 0;
            bmsPedTotal = 0;                        
        }
        document.getElementById("pedido_txtImporte").value = numeral(bmsPedImporte).format('$0,0.00');
        document.getElementById("pedido_txtIva").value = numeral(bmsPedIva).format('$0,0.00');
        document.getElementById("pedido_txtTotal").value = numeral(bmsPedTotal).format('$0,0.00');

        $('#pedidoDetalle_totalImporte').text(numeral(bmsPedImporte).format('$0,0.00'));
        $('#pedidoDetalle_totalIva').text(numeral(bmsPedIva).format('$0,0.00'));
        $('#pedidoDetalle_Total').text(numeral(bmsPedTotal).format('$0,0.00'));
        logGlobal();              
     }

     function actualizaTotalesProducto( cant, precio ){
        var b;
        if (precio === 0) {
            b = true;
        } else {
            b = false;
        }
        bmsProdImporte = 0;
        bmsProdIva = 0;
        bmsProdTotal = 0;
        if (bmsUnidad === 'U') {
            bmsPeso = cant * prodObj.peso;
            if (precio === 0) {
                bmsPrecio = prodObj.precioUC;
            } else {
              bmsPrecio = precio;  
            }
            
            bmsProdImporte = bmsPrecio * cant;
            bmsVolumen = cant * prodObj.volumen;
        }
        if (bmsUnidad === 'P') {
            bmsPeso = (cant * prodObj.volumen)/prodObj.contenido;
            if (precio === 0) {
                bmsPrecio = prodObj.precioUA;
            } else {
              bmsPrecio = precio;  
            }
            
            bmsProdImporte = bmsPrecio * cant;
            bmsVolumen = cant * prodObj.volumen;
        }
        
        
        bmsProdIva = (prodObj.porcentajeIVA * bmsProdImporte) / 100;
        bmsProdTotal = bmsProdImporte + bmsProdIva;
        if (b) {document.getElementById("productos_txtPrecioUni").value = numeral(bmsPrecio).format('$0,0.00');}
        document.getElementById("productos_txtImporte").value = numeral(bmsProdImporte).format('$0,0.00');
        document.getElementById("productos_txtIva").value = numeral(bmsProdIva).format('$0,0.00');
        document.getElementById("productos_txtTotal").value = numeral(bmsProdTotal).format('$0,0.00');

        //if (confirm("Imprimir Log General?")){
        //    logGlobal();
        //}
        logGlobal();
     }

     function actualizaTotalesProductosEditar( cant, precio ){
        var b;
        if (precio === 0) {
            b = true;
        } else {
            b = false;
        }
        bmsProdImporte = 0;
        bmsProdIva = 0;
        bmsProdTotal = 0;
        if (bmsUnidad === 'U') {
            bmsPeso = cant * prodObj.peso;
            if (precio === 0) {
                bmsPrecio = prodObj.precioUC;
            } else {
              bmsPrecio = precio;  
            }
            
            bmsProdImporte = bmsPrecio * cant;
            bmsVolumen = cant * prodObj.volumen;
        }
        if (bmsUnidad === 'P') {
            bmsPeso = (cant * prodObj.volumen)/prodObj.contenido;
            if (precio === 0) {
                bmsPrecio = prodObj.precioUA;
            } else {
              bmsPrecio = precio;  
            }
            
            bmsProdImporte = bmsPrecio * cant;
            bmsVolumen = cant * prodObj.volumen;
        }
        
        bmsProdIva = (prodObj.porcentajeIVA * bmsProdImporte) / 100;
        bmsProdTotal = bmsProdImporte + bmsProdIva;
        if (b) {document.getElementById("productosEditar_txtPrecioUni").value = numeral(bmsPrecio).format('$0,0.00');}
        document.getElementById("productosEditar_txtImporte").value = numeral(bmsProdImporte).format('$0,0.00');
        document.getElementById("productosEditar_txtIva").value = numeral(bmsProdIva).format('$0,0.00');
        document.getElementById("productosEditar_txtTotal").value = numeral(bmsProdTotal).format('$0,0.00');

        //if (confirm("Imprimir Log General?")){
        //    logGlobal();
        //}
        
     }
     function modificaDetalle (){
      var b = false;
        if (bmsLineaDetalle[iProdObjModif].cantidad !== bmsCantidad) {
          bmsLineaDetalle[iProdObjModif].cantidad = bmsCantidad;
          b = true;
        }
        if (bmsLineaDetalle[iProdObjModif].peso !== bmsPeso) {
          bmsLineaDetalle[iProdObjModif].peso = bmsPeso;
          b = true;
        }
        if (bmsLineaDetalle[iProdObjModif].volumen !== bmsVolumen) {
          bmsLineaDetalle[iProdObjModif].volumen = bmsVolumen;
          b = true;
        }
        if (bmsLineaDetalle[iProdObjModif].precio !== bmsPrecio) {
          bmsLineaDetalle[iProdObjModif].precio = bmsPrecio;
          b = true;
        }
        if (bmsLineaDetalle[iProdObjModif].importe !== bmsProdImporte) {
          bmsLineaDetalle[iProdObjModif].importe = bmsProdImporte;
          b = true;
        }
        if (bmsLineaDetalle[iProdObjModif].iva !== bmsProdIva) {
          bmsLineaDetalle[iProdObjModif].iva = bmsProdIva;
          b = true;
        }
        if (bmsLineaDetalle[iProdObjModif].total !== bmsProdTotal) {
          bmsLineaDetalle[iProdObjModif].total = bmsProdTotal;
          b = true;
        }
        
        logGlobal();

        return b;
     }


function inicio() {        
         nuevoPedido();
         $('#listaEstab').empty();
         bmsEstab = "";
         bmsTipo = "";
         document.getElementById("text1").value = '';
         document.getElementById("text2").value = '';
         $('#text1').focus();
     }

function iniciaPedido(){
        document.getElementById("pedido_dtpFecha").valueAsDate = bmsFecha;
        document.getElementById("pedido_txtImporte").value = numeral(bmsPedImporte).format('$0,0.00');
        document.getElementById("pedido_txtIva").value = numeral(bmsPedIva).format('$0,0.00');
        document.getElementById("pedido_txtTotal").value = numeral(bmsPedTotal).format('$0,0.00');
      }
    

function llenaSelect(codigoUsuario){ //Recibe un codigo de usuario, consume el ws GetEstabs y llena un Select 
      
         var url = bmsServer + "/api/sesion/GetEstabs",
         
         html = '<option value="' + '-1' + '">' + "Seleccione..." + '</option>',
         success = function(data) {
             if (data.codigo !== "") {
                 $('#listaEstab').empty();
                 //alert("Llenar combo.");
                 //console.log(data);
                 $.each(data, function(i, val) {
                     html += '<option value="' + val.codigo + '">' + val.nombre + '</option>';
                 });
                 $('#listaEstab').append(html);
                 $("#listaEstab").selectmenu('refresh', true);
             }

         };
         //Llamada al web service GetEstabs 
         $.ajax({
             type: 'get',
             url: url,
             data: {
                 "usuario": codigoUsuario
             },
             dataType: "jsonp",
             crossDomain: true,
             cache: false,
             success: success,
             error: function(jqXHR, textStatus, errorThrown) {
                 alert(errorThrown);
             }
         });
     }

    function validaCabeceroDoc(){
      var b = true;
      if (bmsUser === "" || bmsUser === "undefined" || bmsUser === null ) {
        alertBox("Usuario no válido.", "cbDefault()", "BMS Móvil", "OK");
        b = false;
        return b;
      }
      if (bmsEstab === "" || bmsEstab === "undefined" || bmsEstab === null ) {
        alertBox("Establecimiento no válido.", "cbDefault()", "BMS Móvil", "OK");
        b = false;
        return b;
      }
      if (bmsTipo !== "pedido") {
        alertBox("Tipo de docuemento no válido.", "cbDefault()", "BMS Móvil", "OK");
        b = false;
        return b;
      }
      if (bmsCliente === "" || bmsCliente === "undefined" || bmsCliente === null ) {
        alertBox("Cliente no válido.", "cbDefault()", "BMS Móvil", "OK");
        b = false;
        return b;
      }
      if (bmsFecha === "" || bmsFecha === "undefined" || bmsFecha === null ) {
        alertBox("Fecha no válida.", "cbDefault()", "BMS Móvil", "OK");
        b = false;
        return b;
      }
      /*if (bmsSucursal === "" || bmsSucursal === "undefined" || bmsSucursal === null ) {
        alertBox("No selecciono una sucursal.", "cbDefault()", "BMS Móvil", "OK");
        b = false;
        return b;
      }*/ 
      return b;
    }
    
    function guardaPedido() {
        var b = true;
         bmsNotas = document.getElementById("pedido_txtNotas").value;
         //Crear los objetos para mandarlos por el WS
         //Si se enviaron regresar true;
        
         return b;
    }                              

      //Funciones Básicas
    window.addEventListener('load', function() {
    new FastClick(document.body);
    }, false);
$(document).ready(function() {

    document.getElementById("text1").value = '1';
    document.getElementById("text2").value = 'coloma';
    //nuevoPedido();


    $("#btnIniciar").click(function() {
        if (!validateForm()) {
            return;
        }
     var username = $("#text1").val(),
     password = $("#text2").val(),
     estab = "1",
     url = bmsServer+"/api/sesion/GetUsuario",
     data = {},
     success = function(data) {
         if (data.codigo == "") {
             alertBox("No se pudo iniciar sesion, por favor verifique sus datos.", "cbDefault()", "BMS Móvil", "OK");
             //alert("No se pudo iniciar sesion, por favor verifique sus datos.");
             inicio();
             return;
         }  
         if (data.codigo != "") {
             alertBox("Bienvenido " + data.nombre, "cbDefault()", "BMS Móvil", "OK");
             //alert("Bienvenido " + data.nombre);
             bmsUser = data.codigo; //Variable Global BMS
             console.log('***DEBUGGING LOG - [Page: Login] Codigo usuario guardado: ' + data.codigo);
             $.mobile.changePage($('#selector_estab'), {
                 transition: "slide",
                 changeHash: false
             });
             llenaSelect(data.codigo);
             //$('#establecimientos').css('visibility','visible');
         }

     };
     console.log('***DEBUGGING LOG - [Page: Login] [Data: username = ' + username +
         '] [Data: password = ' + password +   '\n' +
         '] [Data: estab = ' + estab +         '\n' +
         '] [Data: url = ' + url);             
     
     //Llamada al web service GetUsuario 
     $.ajax({
         type: 'get',
         url: url,
         data: {
             "usuario": username,
             "clave": password
         },
         dataType: "jsonp",
         crossDomain: true,
         cache: false,
         success: success,
         error: function(jqXHR, textStatus, errorThrown) {
             alert(errorThrown);
         }
     });
 });
 $('#config_btnProbar').click(function(){
    bmsServer = $('#config_servidor').val();
    if (bmsServer == ""){
        alertBox("Para probar la conexión ingrese un servidor válido.", "cbDefault()", "BMS Móvil", "OK");
        //alert("Para probar la conexión ingrese un servidor válido.");
        return;
    }
     var url = bmsServer+"/api/General/GetProbarConexion",
     
     success = function(data) {
         if (data == true) {
             alertBox("La conexión se estableció correctamente.", "cbDefault()", "BMS Móvil", "OK");
             //alert("La conexión se estableció correctamente.");
         }
     };

     //Llamada al web service 
     $.ajax({
         type: 'get',
         url: url,
         data: {},
         dataType: "jsonp",
         crossDomain: true,
         cache: false,
         success: success,
         error: function(jqXHR, textStatus, errorThrown) {
             alert(errorThrown);
         }
     });

 });
    //Continuar después de seleccionar un establecimiento
 $('#BtnContinuar').click(function() {
     if (bmsEstab == -1 || bmsEstab == null || bmsEstab == "") {
         alertBox("Seleccione un establecimiento para continuar", "cbDefault()", "BMS Móvil", "OK");
         //alert("Seleccione un establecimiento para continuar");
         return;
     }
     $.mobile.changePage($('#selectorTipo'), {
         transition: "slide",
         changeHash: false
     });
 });
    //Tipo de documento: Pedido o Crobranza
 $('#listaTipo').children('li').click(function() {
     bmsTipo = $(this).attr('data-name');
     event.stopPropagation();
     iniciaPedido();             
     console.log('***DEBUGGING LOG - [Page: selectorTipo] [Data: bmsTipo = ' + bmsTipo +
         ']');
 });

 $('#selector_estabBtnSalir').click(function() {
     salir();     
 });

 $("#pedido_btnDetalle").click(function() {
        if (bmsLineaDetalle.length === 0) {
            alertBox("No se han agregado productos", "cbDefault()", "BMS Móvil", "OK");
            //alert("No se han agregado productos"); 
            return;
        }
        $.mobile.changePage($('#pedidoDetalle'), {
        transition: "slide",
        changeHash: false
        });
 });
 $('#Pedido_btnAgregarProducto').click(function() {
    
    if (bmsCliente !== "") {
        $.mobile.changePage($('#productos'), {
        transition: "slide",
        changeHash: false
        });
    }
    if (bmsCliente == ""){
        navigator.notification.confirm(
        "Primero debe seleccionar un cliente. Desea hacerlo ahora?",  // message
        onConfirmSeleccionarCliente,            // callback to invoke with index of button pressed
        "Confirmar acción.",  // title
        "Cancelar,OK");       // buttonLabels
        //selectCte = confirm("Primero debe seleccionar un cliente. Desea hacerlo ahora?");
    }
 });

 $('#Pedido_btnGuardaPedido').click(function() {
      navigator.notification.confirm(
        "Está a punto de guardar el pedido, desea continuar?",  // message
        onConfirmGuardaPedido,            // callback to invoke with index of button pressed
        "Confirmar acción.",  // title
        "Cancelar,OK");       // buttonLabels
     //var guardar = confirm("Está a punto de guardar el pedido, desea continuar?"),
 });
 $('#pedido_btnAtras').click(function() {
     navigator.notification.confirm(
        "Está a punto de salir, desea continuar? Se perderán los datos no guardados.",  // message
        onConfirmBtnAtras,            // callback to invoke with index of button pressed
        "Confirmar acción.",  // title
        "Cancelar,OK");       // buttonLabels
     //var guardar = confirm("Está a punto de salir, desea continuar? Se perderán los datos no guardados.");
 });

 $('#Pedido_btnCancelaPedido').click(function() {
     navigator.notification.confirm(
        "Está a punto de cancelar el pedido, desea continuar?",  // message
        onConfirmBtnCancelaPedido,            // callback to invoke with index of button pressed
        "Confirmar acción.",  // title
        "Cancelar,OK");       // buttonLabels
     //var guardar = confirm("Está a punto de cancelar el pedido, desea continuar?");
 });
//TAPHOLD List detalle producto
 $(document).on( 'taphold', 'li.item', tapholdHandler );
    
            function tapholdHandler( event ){
            var i = $(this).index();
              $.mobile.changePage($('#productosEditar'), {
                transition: "slide",
                changeHash: false});
                
                modificaProducto(i);
            }
 
 //Agregar producto al detalle: Se crea el Objeto producto, se añade al arreglo de objectos y se limpia la pagina de producto. 
 $('#productos_btnAgregaProducto').click(function() {
    if ($('#productos_txtProducto').val() == "") {
        alertBox("No ha seleccionador un producto.", "cbDefault()", "BMS Móvil", "OK");
        //alert("No ha seleccionador un producto.");
        $('#productos_btnAgregaProducto').focus();
        return;}
    if (document.getElementById("productos_txtCantidad").value == "") {
        alertBox("Especifique una cantidad válida.", "cbDefault()", "BMS Móvil", "OK");
        //alert("Especifique una cantidad válida.");
        $('#productos_txtCantidad').focus();
        return;
    }
                          //producto(codigo        ,         descripcion,    unidad, unidadAbrev,       cantidad,    peso,    volumen,    precio,        importe,        iva, total)
    var productoNuevo = new producto(prodObj.codigo, prodObj.descripcion, bmsUnidad, bmsUnidadAbrev, bmsCantidad, bmsPeso, bmsVolumen, bmsPrecio, bmsProdImporte, bmsProdIva, bmsProdTotal);
    bmsLineaDetalle.push(productoNuevo);
    
    logGlobal();

    actualizaTotalesPedido();
    limpiaProducto();
    alertBox("Producto agregado correctamente.", "cbDefault()", "BMS Móvil", "OK");
    $('#productos_txtProducto').focus();
    //alert("Producto agregado correctamente.");

    /*$.mobile.changePage($('#productos'), {
    transition: "slide",
    changeHash: false});*/
    
 });
//Agrega producto modificado al detalle: Se utiliza el prodObjModif para actualizar los valores de prodObj en bmsLineaDetalle[], despues de actualizar se limpia la pagina de ProductosEditar.
//Regresa a la pagina de pedidoDetalle
 $('#productosEditar_btnAgregaProducto').click(function() {
    if ($('#productosEditar_txtProducto').val() == "") {
        alertBox("No hay producto seleccionado para editar.", "cbDefault()", "BMS Móvil", "OK");
        //alert("No hay producto seleccionado para editar.");
        return;}
    if (document.getElementById("productosEditar_txtCantidad").value == "") {
        alertBox("Especifique una cantidad válida.", "cbDefault()", "BMS Móvil", "OK");
        //alert("Especifique una cantidad válida.");
        $('#productosEditar_txtCantidad').focus();
        return;
    }
    //Llamar método booleano modificaDetalle

    if (modificaDetalle()) {
      actualizaTotalesPedido();
      limpiaProducto();
      alertBox("Producto modificado correctamente.", "cbDefault()", "BMS Móvil", "OK");
      //alert("Producto modificado correctamente.");

      $.mobile.changePage($('#pedidoDetalle'), {
      transition: "slide",
      changeHash: false});
    } else {
      alertBox("No se ha modificado el producto.", "cbDefault()", "BMS Móvil", "OK");
      //alert("No se ha modificado el producto.");
    }
 });
/*
 $('#productos_txtCantidad').on('input propertychange', function(){ 
    bmsCantidad = $(this).val();
    if (bmsCantidad == "") {return;}

    if ($.isNumeric($('#productos_txtCantidad').val())){
        actualizaTotalesProducto(bmsCantidad);
    }else{
        document.getElementById("productos_txtCantidad").value = "";
        alert("Teclee la cantidad en numeros.");       
        $('#productos_txtCantidad').focus();
    }               
 });
*/
 $('#productos_btnCancelaProducto').click(function() {
    navigator.notification.confirm(
        "Desea limpiar el formulario? Se limpiaran todos los campos.",  // message
        onConfirmBtnCancelaProducto,            // callback to invoke with index of button pressed
        "Confirmar acción.",  // title
        "Cancelar,OK");       // buttonLabels
    //var limpiar = confirm("Desea limpiar el formulario? Se limpiaran todos los campos.");    
 });
 //Al cambiar el valor de la cantidad actualizar importe, iva y total del producto
 $('#productos_txtCantidad').on('input propertychange', function(){ 
    bmsCantidad = $(this).val();
    if (bmsCantidad == "") {return;}

    if ($.isNumeric($('#productos_txtCantidad').val())){
        actualizaTotalesProducto(bmsCantidad, bmsPrecio);
    }else{
        document.getElementById("productos_txtCantidad").value = "";
        alertBox("Teclee la cantidad en números.", "cbDefault()", "BMS Móvil", "OK");
        //alert("Teclee la cantidad en números.");       
        $('#productos_txtCantidad').focus();
    }                
 });
 //Al cambiar el valor de la cantidad actualizar importe, iva y total del productosEditar
 $('#productosEditar_txtCantidad').on('input propertychange', function(){ 
    bmsCantidad = $(this).val();
    if (bmsCantidad == "") {return;}

    if ($.isNumeric($('#productosEditar_txtCantidad').val())){
        actualizaTotalesProductosEditar(bmsCantidad, prodObjModif.precio);
    }else{
        document.getElementById("productosEditar_txtCantidad").value = "";
        alertBox("Teclee la cantidad en números.", "cbDefault()", "BMS Móvil", "OK");
        //alert("Teclee la cantidad en números.");       
        $('#productosEditar_txtCantidad').focus();
    }                
 });
 
 $('#productos_txtCantidad').on('focus', function(){
    this.select();
 })
 $('#productosEditar_txtCantidad').on('focus', function(){
    this.select();
 })
  //Al cambiar el valor del precio/u actualizar importe, iva y total del producto
 $('#productos_txtPrecioUni').on('focus', function(){
    this.select();
 })
 $('#productos_txtPrecioUni').on('input propertychange', function(){
    bmsPrecio = numeral().unformat($(this).val());
    actualizaTotalesProducto(bmsCantidad, bmsPrecio);              
 });
   //Al cambiar el valor del precio/u actualizar importe, iva y total del producto
 $('#productosEditar_txtPrecioUni').on('focus', function(){
    this.select();
 })
 $('#productosEditar_txtPrecioUni').on('input propertychange', function(){
    bmsPrecio = numeral().unformat($(this).val());
    actualizaTotalesProductosEditar(bmsCantidad, bmsPrecio);              
 });
 $('#productos_txtPrecioUni').on('keypress', function(e){ 
    var precioInput = $(this).val();
    if (e.keyCode === 13) {
        if (precioInput !== "") {
            //añadir
            if ($('#productos_txtProducto').val() == "") {
                alertBox("No ha seleccionador un producto.", "cbDefault()", "BMS Móvil", "OK");
                //alert("No ha seleccionador un producto.");
                $('#productos_btnAgregaProducto').focus();
                return;}
            if (document.getElementById("productos_txtCantidad").value == "") {
                alertBox("Especifique una cantidad válida.", "cbDefault()", "BMS Móvil", "OK");
                //alert("Especifique una cantidad válida.");
                $('#productos_txtCantidad').focus();
                return;}
                                      //producto(codigo        ,         descripcion,    unidad, unidadAbrev,       cantidad,    peso,    volumen,    precio,        importe,        iva, total)
                var productoNuevo = new producto(prodObj.codigo, prodObj.descripcion, bmsUnidad, bmsUnidadAbrev, bmsCantidad, bmsPeso, bmsVolumen, bmsPrecio, bmsProdImporte, bmsProdIva, bmsProdTotal);
                bmsLineaDetalle.push(productoNuevo);
                
                logGlobal();

                actualizaTotalesPedido();
                limpiaProducto();
                alertBox("Producto agregado correctamente.", "cbDefault()", "BMS Móvil", "OK");
                $('#productos_txtProducto').focus();
        };
    };               
 });
 $('#productos_txtCantidad').on('keypress', function(e){ 
    var cantInput = $(this).val();
    if (e.keyCode === 13) {
        if (cantInput !== "") {
            $('#productos_txtPrecioUni').focus();
        };
    };               
 });
 //Buscar producto por código
 $('#productos_txtProducto').on('keypress', function(e){ 
    var prodInput = $(this).val();
    if (e.keyCode === 13) {
        if (prodInput !== "") {
            addProducto(prodInput);
            $('#productos_txtCantidad').focus();
        };
    };               
 });

 $('#clienteDetalle_btnAceptar').click(function() {
                
 });
 

 $('#pedidoDetalle_btnBorraTodos').click(function() {
    var length = bmsLineaDetalle.length,
    eliminado,
    i;

    if (length !== 0) {
        //for (i = 0; i < length; i++) {
        //  eliminado = bmsLineaDetalle.splice(i,1);
        navigator.notification.confirm(
        "Está seguro de borrar todos los productos del pedido?.",  // message
        onConfirmBtnBorraTodos,            // callback to invoke with index of button pressed
        "Confirmar acción.",  // title
        "Cancelar,OK");       // buttonLabels
        //var confirma = confirm("Está seguro de borrar todos los productos del pedido?."); 
        
    }
                   
 });

});

     

    

     $.fn.clearForm = function() { 
         return this.each(function() {  
             var type = this.type,
                 tag = this.tagName.toLowerCase();  
             if (tag == 'form')    return $(':input', this).clearForm();  
             if (type == 'text' || type == 'password' || tag == 'textarea')    this.value = '';  
             else if (type == 'checkbox' || type == 'radio')    this.checked = false;  
             else if (tag == 'select')    this.selectedIndex = -1; 
         });
     };


     $(document).ready("pageinit", "#config", function() {
         queryDB();
     });

    
     //Busca Producto
     $(document).on("pageinit", "#buscaProducto", function() {
         $("#autocompleteProds").on("listviewbeforefilter", function(e, data) {
             var $ul = $(this),
                 $input = $(data.input),
                 value = $input.val(),
                 html = "";
             $ul.html("");
             if (value && value.length > 2) {
                 $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
                 $ul.listview("refresh");
                 $.ajax({
                     url: bmsServer+"/api/Productos/GetBuscarProductos",
                     type: "GET",
                     dataType: "jsonp",
                     crossDomain: true,
                     data: {
                         estab: "1",
                         filtro: $input.val()
                     }
                 })
                     .then(function(response) {
                         $.each(response, function(i, val) {
                             html += "<li data-icon=" + "plus" + " onclick=" + "'addProducto(" + val.codigo + ")'>" + "<a href=" + "#productos" + "><h2 class='ui-li-heading'>" + val.descripcion + "</h2><p class=" + "ui-li-desc" + "> Exist: " + val.existenciaEstablecimiento + "</p> <p class=" + "ui-li-desc" + "> Exist Global: " + val.existenciaGlobal + "</p></a></li>";
                         });
                         $ul.html(html);
                         $ul.listview("refresh");
                         $ul.trigger("updatelayout");
                     });
             }
         });
     });

      function addProducto(val) {
         bmsProducto = val;
         console.log('***DEBUGGING LOG - [Page: buscaProducto function addProducto()] [Data: codProducto = ' + val +
             ']');
         document.getElementById("productos_txtProducto").value = val;
         $('input[data-type="search"]').val("");
         $('#autocompleteProds').empty();

         var url = bmsServer+"/api/Productos/GetProducto";
         var data = {};
         var html; //= '<option value="' + '' + '">' + "Seleccione..." + '</option>';
         
         var success = function(data) {
             if (data.codigo !== "") {

                 $('#productos_listaUnidad').empty();
                  
                 bmsUnidad = "U";
                 bmsUnidadAbrev = data.unidades[0].abreviatura;
                 bmsUnidadNombre = data.unidades[0].nombre;
                 bmsCantidad = 1;
                 bmsPeso = data.peso;
                 bmsVolumen = data.volumen;
                 bmsPrecio = data.precioUC;
                 document.getElementById("productos_txtProducto").value = data.descripcion;
                 
                 document.getElementById("productos_txtPeso").value = numeral(data.peso).format('0.000');
                 document.getElementById("productos_txtVolumen").value = numeral(data.volumen).format('0.000');
                 document.getElementById("productos_txtPrecioUni").value = numeral(data.precioUC).format('$0,0.00');
                 
                 document.getElementById("productos_txtCantidad").value = bmsCantidad;
                 prodObj = data;
                 actualizaTotalesProducto(1, 0);                 
                 
                 $.each(data.unidades, function(i, val) {
                    html += '<option value="' + val.tipo + '">' + val.nombre + '</option>';                    
                 });
                                            
                
                 $('#productos_listaUnidad').append(html);
                 $("#productos_listaUnidad").val(bmsUnidad);
                 $("#productos_listaUnidad").selectmenu('refresh', true);

             }

         };
 
         $.ajax({
             type: 'get',
             url: url,
             data: {
                 "cliente": bmsCliente,
                 "estab"  : bmsEstab,
                 "producto": bmsProducto
             },
             dataType: "jsonp",
             crossDomain: true,
             cache: false,
             success: success,
             error: function(jqXHR, textStatus, errorThrown) {
                 alert(errorThrown);
             }
         });

     }

     function modificaProducto(val) {
         iProdObjModif = val;                 //Recibo el indice del producto a modificar
         prodObjModif = bmsLineaDetalle[val]; //Hago una copia del objeto a modificar
         var codProd = prodObjModif.codigo;
         console.log('***DEBUGGING LOG - [Page: modificaProducto function modificaProducto()] [Data: codProducto = ' + codProd +']');
         document.getElementById("productosEditar_txtProducto").value = codProd;
         var url = bmsServer+"/api/Productos/GetProducto";
         var data = {};
         var html;
         
         var success = function(data) {
             if (data.codigo !== "") {

                 $('#productosEditar_listaUnidad').empty();
                 
                 prodObj = data; 
                 bmsUnidad = "U";
                 bmsUnidadAbrev = data.unidades[0].abreviatura;
                 bmsUnidadNombre = data.unidades[0].nombre;
                 bmsCantidad = prodObjModif.cantidad;
                 bmsPeso = data.peso;
                 bmsVolumen = data.volumen;
                 bmsPrecio = prodObjModif.precio;
                 bmsProdImporte = prodObjModif.importe;
                 bmsProdIva = prodObjModif.iva;
                 bmsProdTotal = prodObjModif.total;
                 document.getElementById("productosEditar_txtProducto").value = data.descripcion;
                 
                 document.getElementById("productosEditar_txtPeso").value = numeral(data.peso).format('0.000');
                 document.getElementById("productosEditar_txtVolumen").value = numeral(data.volumen).format('0.000');
                 document.getElementById("productosEditar_txtPrecioUni").value = numeral(prodObjModif.precio).format('$0,0.00');
                 
                 document.getElementById("productosEditar_txtCantidad").value = prodObjModif.cantidad;

                 document.getElementById("productosEditar_txtImporte").value = numeral(prodObjModif.importe).format('$0,0.00'); 
                 document.getElementById("productosEditar_txtIva").value = numeral(prodObjModif.iva).format('$0,0.00');
                 document.getElementById("productosEditar_txtTotal").value = numeral(prodObjModif.total).format('$0,0.00');

                 
                 $.each(data.unidades, function(i, val) {
                    html += '<option value="' + val.tipo + '">' + val.nombre + '</option>';                    
                 });
                                            
                
                 $('#productosEditar_listaUnidad').append(html);
                 $("#productosEditar_listaUnidad").val(bmsUnidad);
                 $("#productosEditar_listaUnidad").selectmenu('refresh', true);

             }

         };
 
         $.ajax({
             type: 'get',
             url: url,
             data: {
                 "cliente": bmsCliente,
                 "estab"  : bmsEstab,
                 "producto": codProd
             },
             dataType: "jsonp",
             crossDomain: true,
             cache: false,
             success: success,
             error: function(jqXHR, textStatus, errorThrown) {
                 alert(errorThrown);
             }
         });

     }

      //Busca Cliente
     $(document).on("pageinit", "#buscaCliente", function() {
         $("#autocompleteCtes").on("listviewbeforefilter", function(e, data) {
             var $ul = $(this),
                 $input = $(data.input),
                 value = $input.val(),
                 html = "";
             $ul.html("");
             if (value && value.length > 2) {
                 $ul.html("<li ><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
                 $ul.listview("refresh");
                 $.ajax({
                     url: bmsServer+"/api/Clientes/GetBuscarClientes",
                     type: "GET",
                     dataType: "jsonp",
                     crossDomain: true,
                     data: {
                         estab: "1",
                         filtro: $input.val()
                     }
                 })
                     .then(function(response) {
                         $.each(response, function(i, val) {
                             html += "<li " + "data-icon=" + "plus" + " data-liCtesCod= '" + val.codigo + "' data-liCtesNom='" + val.nombre + "' onclick=" + "'addCliente(" + val.codigo + ")'" + "><a href=" + "#clienteDetalle" + "><h2 class='ui-li-heading'>" + val.nombre + "</h2><p class=" + "ui-li-desc" + "> Código: " + val.codigo + "</p> </a></li>";
                         });
                         $ul.html(html);
                         $ul.listview("refresh");
                         $ul.trigger("updatelayout");
                     });
             }
         });
     });

     
      //Llama al webservice que se trae el detalle del cliente mandandole el codigoCte 
     function addCliente(val) {
         bmsCliente = val;
         console.log('***DEBUGGING LOG - [Page: buscaCliente function addCliente()] [Data: codCte = ' + val +
             ']');
         document.getElementById("clienteDetalle_txtCliente").value = val;
         $('input[data-type="search"]').val("");
         $('#autocompleteCtes').empty();
         //$('input[data-type="search"]').trigger("change");

         var url = bmsServer+"/api/Clientes/GetCliente";
         var data = {};
         var html = '<option value="' + '' + '">' + "Seleccione..." + '</option>';
         var success = function(data) {
             if (data.codigo !== "") {
                 $('#listaSucursales').empty();
                 //alert("Llenar combo.");
                 //console.log(data);
                 bmsSucursal = "";
                 document.getElementById("pedido_txtCliente").value = data.razonSocial;
                 document.getElementById("clienteDetalle_txtCliente").value = data.razonSocial;
                 bmsCliente = data.codigo;
                 document.getElementById("clienteDetalle_txtLPV").value = data.listaPrecios;
                 bmsLPV = data.idListaPrecios;
                 document.getElementById("clienteDetalle_txtCondPago").value = data.condicionPago;
                 bmsCondPago = data.idCondicionPago;
                 document.getElementById("clienteDetalle_txtSaldo").value = numeral(data.saldo).format('$0,0.00');
                 bmsSaldo = data.saldo;
                 
                 $.each(data.sucursales, function(i, val) {
                    html += '<option value="' + val.codigo + '">' + val.nombre + '</option>';
                 });
                 $('#listaSucursales').append(html);
                 $("#listaSucursales").selectmenu('refresh', true);
             }

         };

         //Llamada al web service GetEstabs 
         $.ajax({
             type: 'get',
             url: url,
             data: {
                 "cliente": val
             },
             dataType: "jsonp",
             crossDomain: true,
             cache: false,
             success: success,
             error: function(jqXHR, textStatus, errorThrown) {
                 alert(errorThrown);
             }
         });
     }

     

     function seleccionaEstab() {
         bmsEstab = document.getElementById("listaEstab").value
         console.log('***DEBUGGING LOG - [Page: selector_estab] [Data: bmsEstab = ' + bmsEstab +
             ']');
         //showNotificationBar("Acciones al seleccionar un elemento");
     }
     function seleccionaSucursal() {
         bmsSucursal = document.getElementById("listaSucursales").value
         console.log('***DEBUGGING LOG - [Page: selector_sucursales] [Data: bmsSucursal = ' + bmsSucursal +
             ']');
         //showNotificationBar("Acciones al seleccionar un elemento");
     }

     function seleccionaPedido() {
         bmsTipo = $(this).attr('data-name');
         bmsTipo = document.getElementById("listaTipo").index;
         console.log('***DEBUGGING LOG - [Page: selectorTipo] [Data: bmsTipo = ' + bmsTipo +
             ']');
     }
     function seleccionaUnidad(modif) {
        if (modif) {
          bmsUnidad = document.getElementById("productosEditar_listaUnidad").value;
          actualizaTotalesProductosEditar(bmsCantidad, 0);
          console.log('***DEBUGGING LOG - [Page: ProductosEditar_selectorUnidad] [Data: bmsUnidad = ' + bmsUnidad +
             ']');
          return;
        }
         bmsUnidad = document.getElementById("productos_listaUnidad").value;
         actualizaTotalesProducto(bmsCantidad, 0);
         console.log('***DEBUGGING LOG - [Page: Productos_selectorUnidad] [Data: bmsUnidad = ' + bmsUnidad +
             ']');
     } 

     function onConfirmSalir(button) {
  if (button == 2) {
    console.log("Botón presionado index: " + button);
    inicio();
         $.mobile.changePage($('#Login'), {
             transition: "slide",
             changeHash: false
         });
  }
}
function salir(){
  navigator.notification.confirm(
    "Está a punto de terminar su sesión, desea continuar?",  // message
    onConfirmSalir,            // callback to invoke with index of button pressed
    "Confirmar acción.",  // title
    "Cancelar,OK");       // buttonLabels
    
    //var answer = confirm("Está a punto de terminar su sesión, desea continuar?");
}
function onConfirmSeleccionarCliente(button) {
  if (button == 2) {
    console.log("Botón presionado index: " + button);
    inicio();
         $.mobile.changePage($('#clienteDetalle'), {
             transition: "slide",
             changeHash: false
         });
  }
}

function onConfirmGuardaPedido(button) {
  if (button == 2) {
    if (validaCabeceroDoc()) {
             if (bmsLineaDetalle.length === 0) { //Se valida el detalle
              alertBox("El pedido está vacío. Necesita añadir productos para guardar un pedido.", "cbDefault()", "BMS Móvil", "OK");
              return;
             }
             if (guardaPedido()) {
             alertBox("El pedido se ha guardado con éxito.", "cbDefault()", "BMS Móvil", "OK");
             //alert("El pedido se ha guardado con éxito.");
             nuevoPedido();
               $.mobile.changePage($('#selectorTipo'), {
                   transition: "slide",
                   changeHash: false
               });
            }
         }
  }
}

function onConfirmBtnAtras(button) {
  if (button == 2) {
    nuevoPedido();         
         logGlobal();
         $.mobile.changePage($('#selectorTipo'), {
             transition: "slide",
             changeHash: false
         });
  }
}
function onConfirmBtnCancelaPedido(button) {
  if (button == 2) {
    nuevoPedido();         
         logGlobal();
         $.mobile.changePage($('#selectorTipo'), {
             transition: "slide",
             changeHash: false
         });
  }
}
function onConfirmBtnCancelaProducto(button) {
  if (button == 2) {
    limpiaProducto();
  }
}
function onConfirmBtnBorraTodos(button) {
  if (button == 2) {
    bmsLineaDetalle = [];

    $('#list').empty();
    $( "#list" ).listview( "refresh" );
    actualizaTotalesPedido();

    alertBox("Se han eliminado todos los productos del pedido.", "cbDefault()", "BMS Móvil", "OK")
    $.mobile.changePage($('#pedido'), {
             transition: "slide",
             changeHash: false
         });
  }
}

     function showNotificationBar(message, duration, bgColor, txtColor, height) {

         /*set default values*/
         duration = typeof duration !== 'undefined' ? duration : 2500;
         bgColor = typeof bgColor !== 'undefined' ? bgColor : "#5CFF7C";
         txtColor = typeof txtColor !== 'undefined' ? txtColor : "#262425";
         height = typeof height !== 'undefined' ? height : 100;
         /*create the notification bar div if it doesn't exist*/
         if ($('#notification-bar').size() == 0) {
             var HTMLmessage = "<div class='notification-message' style='text-align:center; line-height: " + height + "px;'> " + message + " </div>";
             $('body').prepend("<div id='notification-bar' style='display:none; width:100%; height:" + height + "px; background-color: " + bgColor + "; position: fixed; z-index: 100; color: " + txtColor + ";border-bottom: 1px solid " + txtColor + ";'>" + HTMLmessage + "</div>");
         }
         /*animate the bar*/
         $('#notification-bar').slideDown(function() {
             setTimeout(function() {
                 $('#notification-bar').slideUp(function() {});
             }, duration);
         });
     }








     /*     function submit_form()
            {
                if (!validateForm()){return}
                var username=$("#text1").val();
                var password=$("#text2").val(); 
                var estab="1";
                var data = { user: username, cve:password, estab:estab };
                $.ajax( {
                    type: "POST",
                    url:"http://bmsystems.myvnc.com:8888/WSAndroid/bms/BMS/Sesion/",
                    data: JSON.stringify(data),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                    success: function(data){
                        var value = data.d; 
                        if(value.usuario !== 0){ 
                            alert('Success ' + data);
                        }
                    },
                    error: function (e) {
                        alert('Failed ' + data);
                    }
                });  
            }
        */
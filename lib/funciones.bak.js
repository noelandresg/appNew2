            function validateForm()
            {
                var x=document.forms["Login"]["text1"].value;
                var y=document.forms["Login"]["text2"].value;
                var band = true;
                if (x==null || x=="")
                {
                    alert("Por favor indique su nombre de usuario.");                           
                    band = false;        
                    return band;
                }
                else if (y==null || y=="")
                {
                    alert("Por favor indique su contraseña.");      
                    band = false;        
                    return band;
                }
                return true
                
            }
            function submit_form()
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
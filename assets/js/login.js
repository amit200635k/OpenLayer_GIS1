$(function () {
    $("#login_frm").on("submit", function (e) {
        e.preventDefault();
        let formData = $(this).serializeArray();
        console.log(formData);
        const json = {};
        $.each(formData, function () { 
                json[this.name] = this.value || false; 
        });
        //return JSON.stringify(json);

        if(json.txtmobile ==='admin' && json.txtpassword==='admin'){
            sessionStorage.setItem("accessTokenAccident","sdassadasdaasdasdadad35434345343");
            location.replace('map.html');
        }
        else{
            alert("Unauthorized User, Contact Admin !!")
        }
    })
})
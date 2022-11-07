function genotp(){
    let Username = document.getElementById("name").value;
    let Email = document.getElementById("email").value;
    let Password = document.getElementById("password").value;
    let Otp = document.getElementById("otp").value;

          
      if((Username == '')){
        alert('Enter your Name');
        document.getElementById('name').focus();
        return ;
      }

      if((Email == '')){
        alert('Enter your email');
        document.getElementById('email').focus();
        return ;
      }

      if((Password == '')){
        alert('Enter your password');
        document.getElementById('password').focus();
        return ;
      }
     
     
    $.post("/addUsers", { Username :Username , Email:Email, Password:Password, Otp:Otp}, 

    function(data, status){
        alert("DATA : "+ JSON.stringify(data));
        console.log(data.uid);
        sessionStorage.setItem("userId",data.uid);
    })


    .fail(function (xhr) {
        switch (xhr.status) {
            case 500:
                alert('User not registered'); // User not registered
                break;
            case 501:
                alert('Invalid credentials!'); // Invalid Password
                break;
            case 502:
                alert('duplicate user');
                break;
            default:
                alert('Default Error!');
                break;
        }
    })
}


function register(){
  let gotp = document.getElementById("otp").value;
  let sid = sessionStorage.getItem("userId")
  console.log(gotp,sid);
  $.post("/genotp",{gotp:gotp,sid:sid},function(data, status){
    alert("DATA : "+ JSON.stringify(data));
    window.location="/login"

  })
  
  .fail(function (xhr) {
    switch (xhr.status) {
        case 500:
            alert('User not registered'); // User not registered
            break;
        case 501:
            alert('Invalid otp'); // Invalid Password
            break;
        case 502:
            alert('duplicate user');
            break;
        default:
            alert('Default Error!');
            break;
    }
  })
};

//***login***/

function loginotp(){
  let Email = document.getElementById("email").value;
  let Password = document.getElementById("password").value;

    $.post("/users", { Email:Email, Password:Password}, 

    function(data, status){
        alert("DATA : "+ JSON.stringify(data));
    })

    .fail(function (xhr) {
        switch (xhr.status) {
            case 500:
                alert('User not registered'); // User not registered
                break;
            case 501:
                alert('Invalid credentials!'); // Invalid Password
                break;
            case 502:
                alert('duplicate user');
                break;
            default:
                alert('Default Error!');
                break;
        }
    })
}


function login(){
  let gotp = document.getElementById("otp").value;
  let Email =document.getElementById("email").value
  console.log(gotp);

  $.post("/logotp",{gotp:gotp, email: Email},function(data, status){
    alert("DATA : "+ JSON.stringify(data));
    sessionStorage.setItem("sees_id",data.usersess)
    console.log(data.usersess)
    window.location="/home"
  })
  
  .fail(function (xhr) {
    switch (xhr.status) {
        case 500:
            alert('User not registered'); // User not registered
            break;
        case 501:
            alert('Invalid otp'); // Invalid Password
            break;
        case 502:
            alert('duplicate user');
            break;
        default:
            alert('Default Error!');
            break;
    }
  })
};

function home(){
  let sessid = sessionStorage.getItem("sees_id")

  $.post("/submit",{sessid:sessid},function(data, status){
    alert("DATA : "+ JSON.stringify(data));
    sessionStorage.setItem("useid", data.userid)
    window.location="/page2"
})
}

function page2(){
let user = sessionStorage.getItem("useid")

  $.post("/page",{user:user},function(data, status){
    alert("DATA : "+ JSON.stringify(data));
    
    let x="";

    x+= 'welcom to home "'+ data.name+ '" '

    document.getElementById("hom").innerHTML= x;

   
})
}


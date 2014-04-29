function LoginCtrl($scope, $http, $rootScope){
    $scope.newUser = {};
    $scope.newUser["gender"] = "M";
    $scope.user= {};
    $rootScope.totalNotification = 0;
    $scope.showLoader = false;
    $( "#loginButton" ).focus(function() {
        $('#loginButton').popover('destroy');
    });
    $('body').on("click",function(){
        setTimeout(function(){$('#signup').popover('destroy');},5000);
    })
    $scope.login = function(user){
        // han hmne lagaya tha
        $scope.showLoader = true;
        if(user.user && user.password){
            $scope.showLoader = true;
            $http.post('/login',user)
                .success(function(data){
                    if(data!="false"){
                        $scope.showLoader = false
                        $('#loginButton').popover('hide');
                        window.location.href = data;
                    }
                    else{
                        $scope.showLoader = false;

                        console.log("ERROR");
                        $('#loginButton').popover('show');
                    }
                })
                .error(function(err){
                    console.log("ERROR");
                })
        }
    }
    $scope.showNotiPanel = function(){
        ShowCrystalNotificationPanel()
    }
    $scope.message = "Sign-in into dbevent";

    $scope.signUp = function(newUser, signupForm){
        newUser.DOB = newUser.bYear+"-"+newUser.bMonth+"-"+newUser.bDay;
        console.log(newUser);
        console.log(signupForm.$valid);
        if (signupForm.$valid){
            if(newUser.pass == newUser.rePass){
                console.log("Password Matched");
                $http.post('/signup',newUser)
                    .success(function(data){
                        console.log("login was here");
                        console.log("from server",data);
                        if(data == "error1"){
                            console.log("error1");

                            $('#signup').popover({content :'<span class="glyphicon glyphicon-warning-sign"></span> Username already exist' });
                            $('#signup').popover('show');

                        }

                        else if(data == "error2"){
                            console.log("error2");

                            $('#signup').popover({content :'<span class="glyphicon glyphicon-warning-sign"></span> Email already exist' });
                            $('#signup').popover('show');

                        }

                        else if(data == "error3"){
                            console.log("error2");

                            $('#signup').popover({content :'<span class="glyphicon glyphicon-warning-sign"></span> Error in signup' });
                            $('#signup').popover('show');

                        }

                        else{

                            console.log("done");
                            window.location.href = data;
                        }
                    })
                    .error(function(err){
                        console.log("ERROR");
                    })
            }
            else{
                console.log("password mismatch");
                $('#signup').popover({content :'<span class="glyphicon glyphicon-warning-sign"></span> Password mismatch' });
                $('#signup').popover('show');
            }
        }
    }
    //check password

};
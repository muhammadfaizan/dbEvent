dbevent.controller('homeCtrl',function homeCtrl($scope, eventData, $rootScope, userData,socket, $http){
    $scope.message = "Hello there! I am Main Page..";

    $scope.allUserEvents = [];
    $rootScope.userData = {};

    eventData.getAllUserEvents()
        .then(function(data){
            console.log("reply from backend:",data);
            $scope.allUserEvents = data;
            $rootScope.allEvents = data;
        },function(err){
            console.log(err);
        })

    userData.getUserData()
        .then(function(rep){
            var data = rep[0];
            $rootScope.userData["userName"] = data.userName;
            $rootScope.userData["fName"] = data.fName;
            $rootScope.userData["lName"] = data.lName;
            $rootScope.userData["fullName"] = data.fName+ " "+data.lName;
            $rootScope.userData["gender"] = data.gender;
            $rootScope.userData["email"] = data.email;
            $rootScope.userData["userId"] = data.userId;
            $rootScope.userData["mobileNumber"] = data.mobileNumber;
            $rootScope.userData["fbProfile"] = data.fbProfile;
            $rootScope.userData["DOB"] = data.DOB;
            $rootScope.userData["imgUrl"] = data.imgUrl;

            socket.emit("login",$rootScope.userData.userId);
        },function(err){
            console.log("Error occured while fetching user data: ",err);
        });

    $http.post('/getnoti',"")
        .success(function(data){
            if(data!="false"){
                $rootScope.totalNotification = data.length;
                for(var i=0;i<data.length;i++){
                    $.CrystalNotificationPanel({
                        title: data[i].title,
                        image: "",
                        panelbutton: true,
                        content: data[i].text
                    })
                }
            }
            else{

            }
        })
        .error(function(err){
            console.log("ERROR");
        })

        var DropCount = 1;

    $("#noti").on("click", function () {
        ShowCrystalNotificationPanel();
    });

    socket.on('getnoti',function(data){
        console.log(data);
        $.CrystalNotification({
            title: data.title,
            image: "",
            content: data.text,
            panelbutton: true,
            timeout: 3500
        });
    })
})
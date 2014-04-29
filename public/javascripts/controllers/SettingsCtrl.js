dbevent.controller('SettingsCtrl',function SettingsCtrl($scope, $rootScope, userData){
    $scope.message = "You may set me..";

    $scope.image = "";
    $scope.newData = {};
    $scope.bIDone = "";
    $scope.pass = {};
    $scope.passError = "false";
    $scope.passDone = "";

    $scope.newData["fName"] = $rootScope.userData.fName;
    $scope.newData["lName"] = $rootScope.userData.lName;
    $scope.newData["mobileNumber"] = $rootScope.userData.mobileNumber;
    $scope.newData["fbProfile"] = $rootScope.userData.fbProfile;
    $scope.newData["gender"]=$rootScope.userData.gender;
    $scope.imgUrl = $rootScope.userData.imgUrl;

    var DOB = $rootScope.userData.DOB.split("-");
    var DOBDay = DOB[2].split("T");
    $scope.newData["bYear"] = DOB[0];
    $scope.newData["bMonth"] = DOB[1];
    $scope.newData["bDay"] = DOBDay[0];
    console.log(DOB[0],DOB[1],DOBDay[0]);

    $scope.changeBasicInfo= function(newUserData, basicInfoForm){
        newUserData.DOB = newUserData.bYear+"-"+newUserData.bMonth+"-"+newUserData.bDay;
        if(basicInfoForm.$valid){
        userData.changeBasicInfo(newUserData)
            .then(function(data){

                    console.log("Data received form server",data);
                    $rootScope.userData["fName"] = data.fName;
                    $rootScope.userData["lName"] = data.lName;
                    $rootScope.userData["gender"] = data.gender;
                    $rootScope.userData["mobileNumber"] = data.mobileNumber;
                    $rootScope.userData["fbProfile"] = data.fbProfile;
                    $rootScope.userData["DOB"] = data.DOB;
                    $scope.bIDone= "true";

            }

            ,function(err){
                console.log(err);
                $scope.bIDone = "false";
            })
        }
        else {
            $scope.bIDone = "false";

        }
    }
    $scope.changePassword = function(userPass, passChangeForm){
        if(userPass.newPass==userPass.rePass && passChangeForm.$valid){
            $scope.passError = "false";
            userData.changePassword(userPass)
                .then(function(data){
                    console.log(data);
                    if(data!="false"){
                        $scope.passDone = "true";
                    }
                    else{
                        $scope.passDone = "false";
                    }
                },function(err){
                    console.log(err);
                    $scope.passDone = "false";
                })
        }
        else{
            $scope.passError = "true";
        }
    };

})
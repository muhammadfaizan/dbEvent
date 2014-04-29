dbevent.controller('CircleCtrl',function CircleCtrl($scope,friendsData,socket,$rootScope){
    $scope.message = "This is your circle zone";

    $scope.friends = {};
    $scope.sortOrder="userName";
    $scope.otherUsers = {};

    friendsData.getFriendList()
        .then(function(data){
            console.log("data received from backend: "+data);
            $scope.friends = data;
            friendsData.getOtherUsers($scope.friends)
                .then(function(data2){
                    console.log("others friends received: ",data2);
                    $scope.otherUsers = data2;
                },function(err){
                    console.log("error",err);
                })
        },function(data){
            console.log("error: "+data);
        })

    $scope.addNewFriend = function(data){
        console.log(data);
        var obj = {"userId":$rootScope.userData.userId,"userName":$rootScope.userData.userName,"friendId":data};
        socket.emit('addNewFriend',obj);
    }

   /* socket.on('getnoti',function(data){
        console.log(data);
        $.CrystalNotification({
            title: data.title,
            image: "",
            content: data.text,
            panelbutton: true,
            timeout: 3500
        });


    })*/

})
dbevent.controller('showEventCtrl',function showEventCtrl($scope, $rootScope, $routeParams, eventData, socket){

    for(var i=0;i<$rootScope.allEvents.length;i++){
        if($rootScope.allEvents[i].eventId==$routeParams.eventId)
        $scope.eventToShow = $rootScope.allEvents[i];
    }
    console.log($scope.eventToShow);
    $scope.comments = [];
    $scope.commentBody = "";


    /*$scope.postComment = function(body){
        var obj = {"eventId":$scope.eventToShow.eventId,"commentBody":body};
        console.log(obj);
        eventData.postComment(obj)
            .then(function(data){
                console.log("Reply from backend: "+data);
                $scope.comments.push(data);

            },function(err){
                console.log("Error from backend: "+err);
            })
    }*/
    $scope.postComment = function(body){
        if(body!=""){
            var toPost = $rootScope.userData;
            toPost["commentBody"] = body;
            toPost["eventId"] = $scope.eventToShow.eventId;
            toPost["eventName"] = $scope.eventToShow.name;

            socket.emit('postComment',toPost);
        }
    }
    $scope.getComments = function(event){
        console.log("Sending: "+event);
        eventData.getComments(event)
            .then(function(data){
                console.log(data);
                for(var i=0;i<data.length;i++){
                    $scope.comments.push(data[i]);
                }
            },function(err){
                console.log("Error from backend: "+err);
            })
    }
    socket.on('getComment',function(data){
        if(data.eventId==$scope.eventToShow.eventId){
        $scope.comments.push(data);
        console.log("Comments array: ",$scope.comments);
        }

    })

    $scope.getComments({"eventId":$scope.eventToShow.eventId});


})
dbevent.factory('friendsData', function($http,$q){
    var deffered = $q.defer();

    return {
        getFriendList:function(){
            deffered = $q.defer();
            $http.get('/getFriendList')
                .success(function(data){
                    console.log(data);
                    deffered.resolve(data);
                })
                .error(function(err){
                    console.log(err);
                    deffered.reject(err);
                });
            return deffered.promise;
        },
        getOtherUsers:function(myFriends){
            deffered = $q.defer();
            $http.post('/getOtherUsers',myFriends)
                .success(function(data){
                    console.log(data);
                    deffered.resolve(data);
                }) .error(function(err){
                    console.log(err);
                    deffered.reject(err);
                });
            return deffered.promise;
        }
    }
})
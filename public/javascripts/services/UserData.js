dbevent.factory('userData',function($q,$http){
    var deffered = $q.defer();
    return {
        getUserData: function(){
            deffered = $q.defer();
            $http.post('/getUserData')
                .success(function(data){
                    console.log(data);
                    deffered.resolve(data);
                })
                .error(function(data,status,headers,config){
                    console.log("error",status);
                    deffered.reject(data);
                });
            return deffered.promise;
        },
        changeBasicInfo: function(userInfo){
            deffered = $q.defer();
            $http.post('/changeBasicInfo',userInfo)
                .success(function(data){
                    deffered.resolve(data);
                })
                .error(function(data,status,headers,config){
                    console.log("error",status);
                    deffered.reject(data);
                });
            return deffered.promise;
        },
        changePassword: function(userPass){
            deffered = $q.defer();
            $http.post('/changePassword')
                .success(function(data){
                    console.log(data);
                    deffered.resolve(data);
                })
                .error(function(data,status,headers,config){
                    console.log("error",status);
                    deffered.reject(data);
                });
            return deffered.promise;
        },
        changeImage: function(fileData){
            deffered = $q.defer();
            $http.post('/changeImage',data)
                .success(function(data){
                    console.log(data);
                    deffered.resolve(data);
                })
                .error(function(data,status,headers,config){
                    console.log("error",status);
                    deffered.reject(data);
                });
            return deffered.promise;
        }
        /*,
        getAllNotifications:function(){
            deffered = $q.defer();
            $http.post('/getnoti',"")
                .success(function(data){
                    console.log(data);
                    deffered.resolve(data);
                })
                .error(function(data,status,headers,config){
                    console.log("error:",status);
                    deffered.reject(data);
                })
            return deffered.promise;
        }*/
    }
})
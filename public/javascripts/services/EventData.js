dbevent.factory('eventData',function($resource,$q,$http){
    var deffered = $q.defer();
    return {
        getEvent: function(){
            deffered = $q.defer();
            $http.get('/getEvents')
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
        getAllUserEvents: function(){
            deffered = $q.defer();
            $http.get('/getAllUserEvents')
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
        postEvent: function(event){
            deffered = $q.defer();
            $http.post('/saveEvent',event)
                .success(function(data){
                    console.log("Service reply"+data);
                    deffered.resolve(data);
                })
                .error(function(data,status,headers,config){
                    console.log("error",status);
                    deffered.reject(data);
                })
            return deffered.promise;
        },
        postComment: function(commentData){
            deffered = $q.defer();
            $http.post('/postComment',commentData)
                .success(function(data){
                    console.log("Service reply"+data);
                    deffered.resolve(data);
                })
                .error(function(data,status,headers,config){
                    console.log("error",status);
                    deffered.reject(data);
                })
            return deffered.promise;
        },
        getComments: function(event){
            deffered = $q.defer();
            $http.post('/getComments',event)
                .success(function(data){
                    console.log("Service reply"+data);
                    deffered.resolve(data);
                })
                .error(function(data,status,headers,config){
                    console.log("error",status);
                    deffered.reject(data);
                });
            return deffered.promise;
        }
    }
})
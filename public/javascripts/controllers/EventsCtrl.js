dbevent.controller('EventsCtrl',function EventsCtrl($scope, $rootScope, eventData,$modal,$log,$timeout){
    $scope.message = "All events will display here..";
    $scope.event={};
    $scope.event["hour"]=1;
    $scope.event["minute"]=0;
    $scope.event["meridian"]=0;
    $rootScope.allEvents = [];
    //event.time = parseInt(event.hour)+parseInt(event.meridian)+":"+event.minute+":"+"00";
    eventData.getEvent()
        .then(function(data){
            console.log("All events from backend: ",data);
            $rootScope.allEvents = data;
        },function(err){
            console.log("error while getting all events: ",err);
        })

    /*
    ---------------------------MODAL WORK--------------------------------------
    */
    $scope.items = ['item1', 'item2', 'item3'];

    $scope.open = function () {

        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrl,
            resolve: {
                items: function () {
                    return $scope;
                },
                fl : {name:"Hasham", name:"Amin", name:"Hamza"}
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });

    };

//datepicker

    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
        $scope.showWeeks = ! $scope.showWeeks;
    };

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = ( $scope.minDate ) ? null : new Date();
    };
    $scope.toggleMin();

    $scope.openDatePicker = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[1];

    //end


    //timepicker
   // $scope.event.time = 8;

   // $scope.hstep = 1;
    //$scope.mstep = 30;
    //$scope.ismeridian = true;
    //end

    //edit end
})

//modal controller
var ModalInstanceCtrl = function ($scope, $rootScope, $modalInstance, items, fl, eventData) {

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };
    $scope.FL = fl;

    $scope.ok = function (event) {
        event.time = parseInt(event.hour)+parseInt(event.meridian)+":"+event.minute+":"+"00";
        console.log("Sending this event: ",event);
        eventData.postEvent(event)
            .then(function(res){
                console.log("reply from back: ",res);
                if(res=="true"){
                    eventData.getEvent()
                        .then(function(data){
                            console.log("All events from backend: ",data);
                            $rootScope.allEvents = data;
                        },function(err){
                            console.log("error while getting all events: ",err);
                        });
                }
                else{
                    console.log("something wrong");
                }

            },function(err){
                console.log("error: ",err);
            })
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

};

"use strict";
/* Define our customer app*/
angular.module("customersApp", [
    "ui.router",
    "toaster"
]);

/* add required routes to our customer app*/
angular.module('customersApp').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/list');
    $stateProvider
        .state('list', {
            url: '/list',
            templateUrl: 'views/list.html',
            controller: "listController"
        })
        .state('add', {
            url: '/add',
            templateUrl: 'views/add.html',
            controller: "addController"
        })
        .state('edit', {
            url: '/edit',
            templateUrl: 'views/edit.html',
            controller: "editController"
        });
}]);

/* Add list controler to our customer app*/
angular.module('customersApp').controller("listController", ["$scope", "customerService", "$state", function ($scope, customerService, $state) {

    $scope.customers = customerService.getCustomers();

    $scope.edit = function (cst) {
        customerService.setCurrentUser(cst);
    };
    $scope.$on("userUpdated", function () {
        $state.go("edit");
    });
    $scope.$on("userDeleted", function () {
        $scope.customers = customerService.getCustomers();
    });
    $scope.delete = function (ind) {
        if (window.confirm('Are you sure to delete')) {
            customerService.deleteCustomer(ind);
        }
    };
}]);

/* Add add controller to our customer app*/
angular.module('customersApp').controller("addController", ["$scope", "customerService", "toaster", "$state", function ($scope, customerService, toaster, $state) {
    $scope.userData = {};
    $scope.add = function () {
        customerService.addCustomer($scope.userData);
        toaster.pop({type: 'success', title: 'Success', body: "Customer added successfully"});
    };
    $scope.$on("userUpdated", function () {
        $state.go("list");
    });
}]);
/* Edit controller to our customer app, we can re use this with add controller */
angular.module('customersApp').controller("editController", ["$scope", "customerService", "$state", "toaster", function ($scope, customerService, $state, toaster) {
    $scope.userData = customerService.getCurrentUser();
    $scope.update = function () {
        customerService.updateCustomer($scope.userData);
        toaster.pop({type: 'success', title: 'Success', body: "Customer updated successfully"});
    };
    $scope.$on("userUpdated", function () {
        $state.go("list");
    });
}]);
/* Define  service to our customer app*/
angular.module('customersApp').factory("customerService", function ($rootScope) {
    var customersArr = [];
    var currentUser;

    function addCustomer(cst) {
        customersArr = JSON.parse(localStorage.getItem("customers")) || [];

        customersArr.push(cst);
        localStorage.setItem("customers", JSON.stringify(customersArr));
        $rootScope.$broadcast("userUpdated");
    }

    function deleteCustomer(cst) {
        var index = customersArr.findIndex(function (el) {
            return el.email === cst.email
        });
        customersArr.splice(index, 1);
        localStorage.setItem("customers", JSON.stringify(customersArr));
        $rootScope.$broadcast("userDeleted");
    }

    function getCustomers() {
        var arr = localStorage.getItem("customers");
        if (arr) {
            return JSON.parse(arr);
        }
        return [];
    }

    function updateCustomer(cst) {
        customersArr = JSON.parse(localStorage.getItem("customers"));
        var index = customersArr.findIndex(function (el) {
            return el.email === cst.email
        });
        customersArr[index] = cst;
        localStorage.setItem("customers", JSON.stringify(customersArr));
        $rootScope.$broadcast("userUpdated");
    }

    function getCurrentUser() {
        var user = localStorage.getItem("currentUser");
        return JSON.parse(user);

    }

    function setCurrentUser(user) {
        currentUser = user;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        $rootScope.$broadcast("userUpdated");
    }
    return {
        addCustomer: addCustomer,
        deleteCustomer: deleteCustomer,
        getCustomers: getCustomers,
        updateCustomer: updateCustomer,
        getCurrentUser: getCurrentUser,
        setCurrentUser: setCurrentUser
    };
});

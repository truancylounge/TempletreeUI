templetreeApp.controller('InvoiceUploadController', ['$scope', 'FileUploader', 'envService', '$sessionStorage', '$location', function($scope, FileUploader, envService, $sessionStorage, $location) {
    
    var uploader = $scope.uploader = new FileUploader({
        url: envService.read('invoiceUploadUrl'),
        alias: 'uploadFile',        
        headers: {
            'Authorization': $sessionStorage.token
        },
        //queueLimit: 1,
        removeAfterUpload : true        
    });



    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
        
        if($sessionStorage.token === undefined) {
            console.log("Undefined token, redirecting to login");
            $location.path('/login');;
        };
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);

        if(response.status === 403) {
            console.log("Forbidden Acces, redirecting to login");
            $location.path('/login');;
        };
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

}]);
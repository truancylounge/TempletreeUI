// ROUTES
templetreeApp.config(function ($routeProvider) {
	$routeProvider

	.when('/', {
		templateUrl: 'html/home.html',
		controller: 'homeController'
	})

	.when('/itemList', {
		templateUrl: 'html/items/itemList.html',
		controller: 'ItemListController'
	})

	.when('/addItems', {
		templateUrl: 'html/items/addItems.html',
		controller: 'AddItemController'
	})

	.when('/uploadItems', {
		templateUrl: 'html/items/uploadItems.html',
		controller: 'ItemUploadController'
	})
	
	.when('/invoiceList', {
		templateUrl: 'html/invoices/invoicesList.html',
		controller: 'InvoiceListController'
	})

	.when('/uploadInvoices', {
		templateUrl: 'html/invoices/uploadInvoices.html',
		controller: 'InvoiceUploadController'
	})

	.when('/billingList', {
		templateUrl: 'html/billings/billingInvoicesList.html',
		controller: 'BillingListController'
	})

	.when('/addBillingInvoice', {
		templateUrl: 'html/billings/addBillingInvoice.html',
		controller: 'AddBillingController'
	})

	.when('/addCustomers', {
		templateUrl: 'html/customers/addCustomers.html',
		controller: 'AddCustomerController'
	})

	.when('/customerList', {
		templateUrl: 'html/customers/customerList.html',
		controller: 'CustomerListController'
	})

	.when('/addUsers', {
		templateUrl: 'html/users/addUsers.html',
		controller: 'AddUserController'
	})

	.when('/userList', {
		templateUrl: 'html/users/userList.html',
		controller: 'UserListController'
	})

	.when('/login', {
		templateUrl: 'html/sign_in.html',
		controller: 'LoginController'
	})
});


templetreeApp.config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('tokenHttpInterceptor');
}]);

templetreeApp.config(function(envServiceProvider) {
	// set the domains and variables for each environment
	envServiceProvider.config({
		domains: {
			local: ['local'],
			development: ['dev'],
			production: ['prod']

		},
		vars: {
			local: {
				itemlistUrl: 'http://localhost:8080/Templetree/rest/items',
				invoiceUrl: 'http://localhost:8080/Templetree/rest/invoices',
				customerlistUrl: 'http://localhost:8080/Templetree/rest/customers',
				billingInvoicelistUrl: 'http://localhost:8080/Templetree/rest/billingInvoices',
				loginUrl: 'http://localhost:8080/Templetree/rest/login',
				rolesUrl: 'http://localhost:8080/Templetree/rest/login/roles',
				authenticateUrl: 'http://localhost:8080/Templetree/rest/login/authenticate',
				itemlistUploadUrl:  'http://localhost:8080/Templetree/rest/fileservice/upload/itemlist',	
				invoiceUploadUrl: 'http://localhost:8080/Templetree/rest/fileservice/upload/invoices',
				currentPage: 1,
				itemsPerPage: 10,
				maxSize: 10


			},
			development: {
				itemlistUrl: 'http://ec2-52-77-220-46.ap-southeast-1.compute.amazonaws.com:8080/TempletreeSystem/rest/items',
				invoiceUrl: 'http://ec2-52-77-220-46.ap-southeast-1.compute.amazonaws.com:8080/TempletreeSystem/rest/invoices',
				customerlistUrl: 'http://ec2-52-77-220-46.ap-southeast-1.compute.amazonaws.com:8080/TempletreeSystem/rest/customers',
				billingInvoicelistUrl: 'http://ec2-52-77-220-46.ap-southeast-1.compute.amazonaws.com:8080/TempletreeSystem/rest/billingInvoices',
				loginUrl: 'http://ec2-52-77-220-46.ap-southeast-1.compute.amazonaws.com:8080/TempletreeSystem/rest/login',
				rolesUrl: 'http://ec2-52-77-220-46.ap-southeast-1.compute.amazonaws.com:8080/TempletreeSystem/rest/login/roles',
				authenticateUrl: 'http://ec2-52-77-220-46.ap-southeast-1.compute.amazonaws.com:8080/TempletreeSystem/rest/login/authenticate',
				itemlistUploadUrl:  'http://ec2-52-77-220-46.ap-southeast-1.compute.amazonaws.com:8080/TempletreeSystem/rest/fileservice/upload/itemlist',	
				invoiceUploadUrl: 'http://ec2-52-77-220-46.ap-southeast-1.compute.amazonaws.com:8080/TempletreeSystem/rest/fileservice/upload/invoices',
				currentPage: 1,
				itemsPerPage: 10,
				maxSize: 10

			},
			productions: {
				itemlistUrl: 'http://localhost:8080/Templetree/rest/items',
				invoiceUrl: 'http://localhost:8080/Templetree/rest/invoices',
				customerlistUrl: 'http://localhost:8080/Templetree/rest/customers',
				billingInvoicelistUrl: 'http://localhost:8080/Templetree/rest/billingInvoices',
				loginUrl: 'http://localhost:8080/Templetree/rest/login',
				rolesUrl: 'http://localhost:8080/Templetree/rest/login/roles',
				authenticateUrl: 'http://localhost:8080/Templetree/rest/login/authenticate',
				currentPage: 1,
				itemsPerPage: 10,
				maxSize: 10

			}

		}
	});

	envServiceProvider.check();
});
/**
ccwgApp.run(['$rootScope', '$location', 'authService', 'roleService', 'serviceRest', '$window', function ($rootScope, $location, authService, roleService, serviceRest, $window) {
	authService.init();


    // Retrieve role entities which can be used later to create privileges 
    roleService.getRoles()
      .then(
        function(response) {
          $rootScope.roleEntities = response.data;
        },
        function(response) {
          alert( "failure message: " + JSON.stringify({data: response.data}));
        }
      );
}]);


*/


(function(){
    /*global angular*/
    'use strict';
    
    var controllers = angular.module('maxicreditoControllers', ['maxicreditoServices']);
    
    controllers.controller('MainController', ['$scope', '$http', 'Products', function($scope, $http, Products){
        $http.defaults.useXDomain = true;
        
        $scope.products = Products.get();
        
        //filter initialization
        (function(){
            $scope.term = 12;
            $scope.isEmployee = true;
        }());
        
        
        $scope.compareCredits = function(){
			$scope.errorsCount = 0;
			//$scope.validate();

			if($scope.errorsCount === 0){
				var products = $scope.products.list;
				$scope.validProducts = [];

				angular.forEach(products, function(product){
					var validRate = filterTerm(product.rates, $scope.term);
					if(!!validRate && validateSalary(product, $scope.salary)){
						product.selectedRate = validRate;
						product.monthlyPayment = getMonthlyPayment($scope.amount, $scope.term, validRate);
						product.totalPayment = getTotalPayment(product.monthlyPayment, $scope.term);
						product.monthlyRate = getMonthlyRate(validRate.value);
						product.totalRatePayment = product.totalPayment - parseFloat($scope.amount);

						$scope.validProducts.push(product);
					}
				});
			}
			
			document.location = '#getApp';
		};
		
		
		$scope.viewProductDetails = function(productId){
		    alert(productId);
		}
    }]);
    
    //Validate if a term apply in a product
	var filterTerm = function(rates, term){
		var validRate = undefined;
		var intTerm = parseInt(term, 10);
		angular.forEach(rates, function(rate){
			if(rate.minMonths <= intTerm && rate.maxMonths >= intTerm){
				validRate = rate;
			}
		});
		return validRate;
	};

	var getMonthlyPayment = function(value, term, rate){
		var xValue = parseFloat(value);
		var xTerm = parseInt(term);
		var xRate = parseFloat(rate.value);

		var mRate = getMonthlyRate(xRate);
		var mRateFactor = mRate / 100;
		var payment = xValue * ((Math.pow((1 + mRateFactor), xTerm) * mRateFactor) / (Math.pow(1 + mRateFactor, xTerm) - 1));

		return payment;
	};

	var getMonthlyRate = function(anualRate){
		return ((Math.pow((1 + parseFloat(anualRate) / 100), (30/360)))-1) * 100;
	};

	var getTotalPayment = function(monthlyPayment, term){
		return parseFloat(monthlyPayment) * parseInt(term);
	};

	var validateSalary = function(product, salary){
		var xSalary = parseInt(salary);
		if(xSalary === 0) return true;

		var minSalary = parseFloat(product.restrictions[0].minSalary);
		return minSalary <= xSalary;
	};
}());
(function(){
    /*global angular*/
    /*global $*/
    /*global _*/
    'use strict';
    
    var controllers = angular.module('maxicreditoControllers', ['maxicreditoServices']);
    
    controllers.controller('MainController', ['$scope', '$http', 'Products', 'need', function($scope, $http, Products, need){
        $http.defaults.useXDomain = true;
        $scope.need = need;
        $scope.products = Products.get();
        
        //filter initialization
        (function(){
            $scope.need.term = 12;
            $scope.need.isEmployee = true;
        }());
        
        
        $scope.compareCredits = function(){
			$scope.errorsCount = 0;
			//$scope.validate();

			if($scope.errorsCount === 0){
				var products = $scope.products.list;
				$scope.validProducts = [];

				angular.forEach(products, function(product){
					var validRate = filterTerm(product.rates, $scope.need.term);
					if(!!validRate && validateSalary(product, $scope.need.salary)){
						product.selectedRate = validRate;
						product.monthlyPayment = getMonthlyPayment($scope.need.amount, $scope.need.term, validRate);
						product.totalPayment = getTotalPayment(product.monthlyPayment, $scope.need.term);
						product.monthlyRate = getMonthlyRate(validRate.value);
						product.totalRatePayment = product.totalPayment - parseFloat($scope.need.amount);

						$scope.validProducts.push(product);
					}
				});
			}
			
			document.location = '#getApp';
			//updateComparativeOptions($scope.validProducts);

			setTimeout(function(){
				setSelectorWidgets();
			}, 500);
			
		};
		
		
		$scope.viewProductDetails = function(productId, e){
		    $scope.selectedProduct = _.find($scope.validProducts, function(product){
		        return product.id === productId;
		    });
		    
		    //Abrir ventana de detalles
		    //obtener el scroll actual para volverlo a posicionar al cerrar la ventana
		    var currentScroll = $(window).scrollTop();
		    Custombox.open({
                target: '#modalDetalle',
                effect: 'swell',
                overlayClose: true,
                overlayColor: '#fff',
                close: function(){
                    //posicionar la ventana donde se encontraba al abrir los detalles
                    window.moveTo(currentScroll, $(window).scrollLeft());
                }
            });
            e.preventDefault();
		}
		
		$scope.$watch('product1', function(newVal, oldVal){			
		    if(!!newVal && !!$scope.product2){
		        $scope.compareSelectedProducts();
		    }else if(!!$scope.product1){
		    	$scope.product1.statusClass = 'price-plan';
		    }
		});
		
		$scope.$watch('product2', function(newVal, oldVal){
		    if(!!newVal && !!$scope.product1){
		        $scope.compareSelectedProducts();
		    }else if(!!$scope.product2){
		    	$scope.product2.statusClass = 'price-plan';
		    }
		});
		
		$scope.compareSelectedProducts = function(){
		    if(!$scope.product1 || !$scope.product2) return;
		    if($scope.product1.monthlyRate < $scope.product2.monthlyRate){
		        $scope.product1.statusClass = 'price-plan-good';
		        $scope.product2.statusClass = 'price-plan-bad';
		        
		        $scope.product1.img = 'check';
		        $scope.product2.img = 'bad';
		    }else{
		        $scope.product1.statusClass = 'price-plan-bad';
		        $scope.product2.statusClass = 'price-plan-good';
		        
		        $scope.product1.img = 'bad';
		        $scope.product2.img = 'check';
		    }
		    
		    //price-plan-bad
		    //price-plan-good
		    //bad.png
		    //check.png
		}
		
		$scope.setProduct = function(productId){
			if(!!$scope.product1){
				if(!!$scope.product2){
					return;
				}else{
					$scope.product2 = _.find($scope.validProducts, function(prod){
						return prod.id === parseInt(productId);	
					});
				}
			}else{
				$scope.product1 = _.find($scope.validProducts, function(prod){
					return prod.id === parseInt(productId);	
				});
			}
			$scope.compareSelectedProducts();
		}
		
		$scope.releaseProduct = function(productId){
			if(!!$scope.product1 && $scope.product1.id === parseInt(productId)){
				$scope.product1 = undefined;
			}else if(!!$scope.product2 && $scope.product2.id === parseInt(productId)){
				$scope.product2 = undefined;
			}
		}
    }]);
    
    controllers.controller('ScannerController', ['$scope', 'need', function($scope, need){
    	$scope.need = need;
    }]);
   
}());
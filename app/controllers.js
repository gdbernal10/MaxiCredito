(function(){
    /*global angular*/
    /*global $*/
    /*global _*/
    /*global Custombox*/
    'use strict';
    
    var controllers = angular.module('maxicreditoControllers', ['maxicreditoServices']);
    
    controllers.controller('MainController', ['$scope', '$http', '$cookies', 'Products', 'need', function($scope, $http, $cookies, Products, need){
        $http.defaults.useXDomain = true;
        $scope.need = need;
        $scope.products = Products.get();
        
        $scope.errors = {};
		$scope.errors.amount = {};
		$scope.errors.term = {};
		$scope.errors.salary = {};
        
        //filter initialization
        (function(){
            $scope.need.term = 12;
            $scope.need.isEmployee = true;
            $scope.need.amount = 1000000;
        }());
        
        $scope.validate = function(){

			if(!$scope.need.amount){
				$scope.errors.amount.status = true;
				$scope.errors.amount.message = 'Debe diligenciar el valor del monto';
				$scope.errorsCount++;
			}

			if(!$scope.need.term){
				$scope.errors.term.status = true;
				$scope.errors.term.message = 'Debe diligenciar el plazo';
				$scope.errorsCount++;
			}
			
			if(!$scope.need.salary){
				$scope.errors.salary.status = true;
				$scope.errors.salary.message = 'Debe diligenciar el salario';
				$scope.errorsCount++;
			}
		}
        
        $scope.compareCredits = function(){
			$scope.errorsCount = 0;
			$scope.validate();

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
				document.location = '#getApp';
				//updateComparativeOptions($scope.validProducts);
	
				setTimeout(function(){
					setSelectorWidgets();
				}, 500);
			}
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
		
		$scope.manageSubscriptions = function(e){
    		var currentScroll = $(window).scrollTop();
    		
    		if(!!$cookies.get('userEmail')){
    			 $scope.$broadcast('manageSubscriptions');
    		}
    		
		    Custombox.open({
                target: '#subscriptions',
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
    }]);
    
    controllers.controller('ScannerController', ['$scope', 'need', 'scanners', function($scope, need, scanners){
    	$scope.need = need;
    	$scope.subscription = {};
    	
    	$scope.sendSubscription = function(){
    		var subs = {
    			salary: $scope.need.salary,
    			term: $scope.need.term,
    			amount: $scope.need.amount,
    			employee: $scope.need.isEmployee,
    			active: 1,
    			tn_name: $scope.subscription.name,
    			email: $scope.subscription.email,
    			tn_email: 1
    		}
    		scanners.save(subs, function(){
    			Custombox.close();
    		});
    	}
    }]);
    
    controllers.controller('SubscriptionsController', ['$scope', '$cookies', '$http', 'myConfig', 'subscriptions', 'scanners', function($scope, $cookies, $http, myConfig, subscriptions, scanners){
    	$scope.subscriptions = [];
    	$scope.user = {};
    	$scope.authenticated = false;
    	
    	$scope.identify = function(){
    		if(!$scope.user.email) return;
    		$scope.subscriptions = subscriptions.search({email: $scope.user.email}, function(values){
    			$cookies.put('userEmail', $scope.user.email);
    			$scope.authenticated = true;
    		});
    	}
    	
    	$scope.isAuthenticated = function(){
    		return !!$cookies.get('userEmail');
    	}
    	
    	if(!!$cookies.get('userEmail')){
    		$scope.user.email = $cookies.get('userEmail');
    		$scope.identify();
    		
    	}
    	
    	$scope.deleteSubscription = function(id){
    		
    		scanners.delete({id: id}, function(){
    			var i = _.findIndex($scope.subscriptions, function(item){
    				return item.id === id;	
    			});
    			delete $scope.subscriptions[i];
    		});
    	}
    	
    	$scope.$on('manageSubscriptions', function (evnt, data) {
			$scope.identify();
		});
    	
    }]);
   
}());
(function() {
  'use strict'

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .constant('ApiBasePath', "http://davids-restaurant.herokuapp.com")
  .directive('foundItems', FoundItemsDirective);

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var menu = this;
    menu.searchTerm = "";
    menu.foundItems = "";
    menu.message = "";

    menu.search = function() {
      menu.message = "";
      var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm);

      promise.then(function (foundItems) {
        menu.foundItems = foundItems;
        if (foundItems.length == 0) {
          menu.message = "Nothing found";
        }
      });
    }

    menu.removeItem = function (itemIndex) {
      menu.foundItems.splice(itemIndex, 1);
    }
  }

  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function(searchTerm) {
      var response = $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      });

      return response.then(function(result) {
        var dl = result.data;
        var foundItems = [];

        dl.menu_items.forEach(function(item) {
          if (item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1) {
            foundItems.push(item);
          }
        });

        return foundItems;
      });
    };
  }

  function FoundItemsDirectiveController() {
    var menu = this;
  }

  function FoundItemsDirective() {
    var ddo = {
      scope: {
        items: '<',
        onRemove: '&'
      },
      controller: NarrowItDownController,
      controllerAs: 'menu',
      bindToController: true,
      templateUrl: 'template.html'
    };

    return ddo;
  }


})();

(function(){
  var module = angular.module('smart.service', []);

  module.constant('exceptionHandlerUrl', '/error/js');

  module.factory('$exceptionHandler', function($injector, $log, exceptionHandlerUrl){
    return function(e, cause){
      $log.error(e, cause);
      if(!e.$exceptionHandler){
        if(!(e instanceof Error))
          e = new Error(e);
        e.$exceptionHandler = true;
        var http = $injector.get('http');
        var param = {
          message: e.message,
          stack: e.stack
        };
        if(cause)
          param.cause = cause;
        http.post(exceptionHandlerUrl, param);
        var $rootScope = $injector.get('$rootScope');
        $rootScope.error = param;
      }
    };
  });

  //TODO: check if the returned value is promise and call then with error posted to exception url.
  module.service('errorHandler', function($exceptionHandler){
    return {
      handle: function(f){
        return function(){
          try{
            return f.apply(null, arguments);
          }catch(e){
            $exceptionHandler(e);
            return e;
          }
        };
      }
    };
  });

  //TODO: test
  module.service('cookieService', function($window){
    var doc = $window.document;
    function save(name, value, expires) {
      var date = new Date(expires);
      var expiresString = "; expires=" + date.toGMTString();
      doc.cookie = name + "=" + value + expiresString +"; path=/";
    }

    function get(name) {
      var nameEQ = name + "=";
      var ca = doc.cookie.split(';');
      for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
          c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
          return c.substring(nameEQ.length, c.length);
      }
      return undefined;
    }

    function remove(name) {
      save(name, "", -1);
    }

    return {
      save: save,
      get: get,
      remove: remove
    };
  });

  module.service('paramService', function(){
    return {
      param: function(data){
        return $.param(data, true);
      }
    }
  });

  //TODO: test
  module.service('http', function($http, paramService){
    function param(data){
      return data ? paramService.param(data, true) : undefined;
    }

    function post(url, data){
      return $http.post(url, param(data), {headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}});
    }

    function get(url, params){
      return $http.get(url, {params: params, headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}});
    }

    return {
      post: post,
      get: get
    };
  });

})();


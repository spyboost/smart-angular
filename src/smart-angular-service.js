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
        var http = $injector.get('$http');
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
})();
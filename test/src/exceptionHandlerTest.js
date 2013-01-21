describe('$exceptionHandler', function(){
  var $_scope;
  var $_http;
  var $_httpBackend;
  var $_exceptionHandler;
  var $_log;
  var _exceptionHandlerUrl;
  var error;
  var cause;

  function doExpect(){
    expect($_scope.$root.error.message).toBe(error.message);
    expect($_scope.$root.error.stack).toBe(error.stack);
    expect($_scope.$root.error.cause).toBe(cause);
    expect($_log.error.logs.length).toBe(1);
    expect($_log.error.logs[0][0].$exceptionHandler).toBe(true);
    expect($_log.error.logs[0][0].message).toBe(error.message);
    expect($_log.error.logs[0][0].stack).toBe(error.stack);
    expect($_log.error.logs[0][1]).toBe(cause);
  }

  beforeEach(function(){
    module('smart.service', function($provide){
      $provide.value('paramService', {
        param: function(data){
          return angular.toJson(data);
        }
      });
    });
    inject(function($rootScope, $http, $httpBackend, $exceptionHandler, $log, exceptionHandlerUrl){
      $_scope = $rootScope.$new();
      $_http = $http;
      $_httpBackend = $httpBackend;
      $_exceptionHandler = $exceptionHandler;
      $_log = $log;
      _exceptionHandlerUrl = exceptionHandlerUrl;
    });
    error = new Error('bum');
    $_httpBackend.expectPOST(_exceptionHandlerUrl).respond(function(method, url, data, headers){
      var o = angular.fromJson(data);
      expect(o.message).toEqual(error.message);
      expect(o.stack).toEqual(error.stack);
      expect(o.cause).toBe(cause);
      return [200, data, headers];
    });
    $_log.assertEmpty();
  });
  it('$exceptionHandler is called with error and without cause', function(){
    $_exceptionHandler(error, cause);
    $_httpBackend.flush();
    doExpect();
  });
  it('$exceptionHandler is called with error and with cause', function(){
    cause = 'Test cause';
    $_exceptionHandler(error, cause);
    $_httpBackend.flush();
    doExpect();
  });
});
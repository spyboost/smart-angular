describe('errorHandler', function(){
  var $_log;
  var _exceptionHandler;
  var _errorHandler;

  beforeEach(function(){
    module('smart.service', function($provide){
      _exceptionHandler = jasmine.createSpy();
      $provide.value('$exceptionHandler', _exceptionHandler);
    });
    inject(function($log, errorHandler){
       _errorHandler = errorHandler;
    });
  });
  it("must call exception handler in case of exception", function(){
    var error = new Error('test error');
    var result = _errorHandler.handle(function(){
      throw error;
    })();
    expect(_exceptionHandler.callCount).toBe(1);
    expect(result).toBe(error);
  });
  it("must return value for correct method", function(){
    var expected = 'Test';
    var result = _errorHandler.handle(function(){
      return expected;
    })();
    expect(_exceptionHandler.callCount).toBe(0);
    expect(result).toBe(expected);
  });
  it("must work with arguments", function(){
    var result = _errorHandler.handle(function(a, b, c){
      return a + b + c;
    })(1, 2, 3);
    expect(_exceptionHandler.callCount).toBe(0);
    expect(result).toBe(6);
  });
});

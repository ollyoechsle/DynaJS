KeyboardTest = TestCase("KeyboardTest");

KeyboardTest.prototype.testKeyDown = function() {

    var keyboard = new Keyboard(), listener = sinon.stub();

    keyboard.on("event", listener);

    assertEquals(0, listener.callCount);
    
};
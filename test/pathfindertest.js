PathFinderTest = TestCase("PathFinderTest");

PathFinderTest.prototype.setUp = function() {

    this.map = new Dyna.model.Map(11, 11, {
        blocks: 0.75,
        powerups: 0.10
    });

};

PathFinderTest.prototype.testKeyDown = function() {

    var pathFinder = new Dyna.util.PathFinder(this.map, 0, 0);

    var path = pathFinder.getPathTo(2,2);

};
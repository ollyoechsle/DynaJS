/**
 * Returns a Gaussian Random Number with mean 0.0 and std deviation 1.0;
 * @param {Number} mean The mean value, default 0.0
 * @param {Number} standardDeviation The standard deviation, default 1.0
 */
Math.randomGaussian = function(mean, standardDeviation) {

    mean = mean || 0.0;
    standardDeviation = isNaN(standardDeviation) ? 1.0 : standardDeviation;

    if (this.hasAnotherGaussian) {
        this.hasAnotherGaussian = false;
        return (this.nextGaussian * standardDeviation) + mean;
    } else {
        var v1, v2, s, multiplier;
        do {
            v1 = 2 * Math.random() - 1; // between -1 and 1
            v2 = 2 * Math.random() - 1; // between -1 and 1
            s = v1 * v1 + v2 * v2;
        } while (s >= 1 || s == 0);
        multiplier = Math.sqrt(-2 * Math.log(s) / s);
        this.nextGaussian = v2 * multiplier;
        this.hasAnotherGaussian = true;
        return (v1 * multiplier * standardDeviation) + mean;
    }

};
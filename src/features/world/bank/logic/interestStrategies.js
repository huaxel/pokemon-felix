/**
 * Bank Interest Strategy Pattern
 * Encapsulates the logic for calculating interest.
 */

export class InterestStrategy {
    calculate(_balance) {
        throw new Error("Method 'calculate' must be implemented.");
    }

    getRate() {
        throw new Error("Method 'getRate' must be implemented.");
    }
}

export class StandardInterestStrategy extends InterestStrategy {
    constructor(rate = 0.02) {
        super();
        this.rate = rate;
    }

    calculate(balance) {
        if (balance <= 0) return 0;
        return Math.floor(balance * this.rate);
    }

    getRate() {
        return this.rate;
    }
}

export class HighYieldInterestStrategy extends InterestStrategy {
    constructor(rate = 0.05) {
        super();
        this.rate = rate;
    }

    calculate(balance) {
        if (balance <= 0) return 0;
        // Bonus: High yield requires minimum balance of 1000
        if (balance < 1000) return Math.floor(balance * 0.01); // Penalty rate
        return Math.floor(balance * this.rate);
    }

    getRate() {
        return this.rate;
    }
}

function TimeInfo() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.current = new Date();

    const fullYear = this.current.getFullYear();
    this.next = new Date(fullYear + 1, 0, 1);  // NY date
    // this.next = new Date(fullYear, 11, 21, 17, 26);  // NY date
    this.isNewYear =
        this.current < new Date(fullYear, 0, 16); // Timer start date
        // this.current > new Date(fullYear, 11, 21, 17, 26)
    this.year = this.isNewYear ? fullYear : 1 + fullYear;

    this.diff = Math.ceil((this.next.getTime() - this.current.getTime()) / 1000);

    if (this.diff > 0) {
        this.hours = Math.floor(this.diff / 3600);
        const hours_ms = this.hours * 3600;
        this.minutes = Math.floor((this.diff - hours_ms) / 60);
        const minutes_ms = hours_ms + this.minutes * 60;
        this.seconds = this.diff - minutes_ms;
    }

    this.timeValue = [this.hours, this.minutes, this.seconds].map(function (a) {
        return (a < 10 ? "0" : "") + a;
    }).join(":")
}

function NyTimerProcessor() {

    this.isUpdate = false;

    this.stateFunction = function () {
        return this.switchToCountdownState;
    };

    this.switchToCountdownState = function () {
        $("#greetings-label").hide();
        $(".year-filed").text(this.timeInfo.year);
        $("#time-filed").text(this.timeValue);
        $("#counter-label").fadeIn(600, function () {
            this.stateFunction = this.countdownState
        }.bind(this));

        return function () {
        };
    };

    this.countdownState = function () {
        if (this.isNewYear) {
            return this.switchToGreetingsState;
        }

        if (this.timeInfo.diff >= 0) {
            if (this.isUpdate) {
                $("#time-filed").text(this.timeValue);

                if (this.timeInfo.diff < 60) {
                    $(".blink").hide().fadeIn(600);
                }
            }
        }

        return null;
    };

    this.switchToGreetingsState = function () {
        $("#counter-label").hide();
        $("#greetings-label").fadeIn(600, function () {
            this.stateFunction = this.greetingsState
        }.bind(this));

        return function () {
        };
    };

    this.greetingsState = function () {
        if (!this.isNewYear) {
            return this.switchToCountdownState;
        }

        return null;
    };

    this.prepareState = function () {
        this.timeInfo = new TimeInfo();
        this.isUpdate = this.timeInfo.timeValue !== this.timeValue || this.isNewYear !== this.timeInfo.isNewYear;
        this.timeValue = this.timeInfo.timeValue;
        this.isNewYear = this.timeInfo.isNewYear;
    };

    this.updateState = function () {
        const newState = this.stateFunction();
        if (jQuery.isFunction(newState)) {
            this.stateFunction = newState;
        }
    };

    // var me = this;

    let processTick = function () {
        this.prepareState();
        this.updateState();

        setTimeout(processTick, 100);
    }.bind(this);

    processTick();
}

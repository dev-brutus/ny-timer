function TimeInfo() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.current = new Date();

    var fullYear = this.current.getFullYear();
    this.next = new Date(fullYear + 1, 0, 1);
    this.isNewYear = this.current < new Date(fullYear, 0, 16);
    this.year = this.isNewYear ? fullYear : 1 + fullYear;

    this.toStr = function () {
        return [this.hours, this.minutes, this.seconds].map(toTxt).join(":")
    };

    function toTxt(a) {
        return (a < 10 ? "0" : "") + a;
    }

    this.diff = Math.ceil((this.next.getTime() - this.current.getTime()) / 1000);

    if (this.diff > 0) {
        this.hours = Math.floor(this.diff / 3600);
        var hours_ms = this.hours * 3600;
        this.minutes = Math.floor((this.diff - hours_ms) / 60);
        var minutes_ms = hours_ms + this.minutes * 60;
        this.seconds = this.diff - minutes_ms;
    }
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
            me.stateFunction = me.countdownState
        });

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
                    var blink = $(".blink");
                    blink.hide().fadeIn(600);
                }
            }
        }

        return null;
    };

    this.switchToGreetingsState = function () {
        $("#counter-label").hide();
        $("#greetings-label").fadeIn(600, function () {
            me.stateFunction = me.greetingsState
        });

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
        var timeInfoAsStr = this.timeInfo.toStr();
        this.isUpdate = timeInfoAsStr != this.timeValue || this.isNewYear != this.timeInfo.isNewYear;
        this.timeValue = timeInfoAsStr;
        this.isNewYear = this.timeInfo.isNewYear;
    };

    this.updateState = function () {
        var newState = this.stateFunction();
        if (jQuery.isFunction(newState)) {
            this.stateFunction = newState;
        }
    };

    var me = this;

    function processTick() {
        me.prepareState();
        me.updateState();

        setTimeout(processTick, 100);
    }

    processTick();
}

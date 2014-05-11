function TimeInfo() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.yearInfo = fetchCurrentAndNextYear();

    this.toStr = function () {
        return [this.hours, this.minutes, this.seconds].map(toTxt).join(":")
    };

    function toTxt(a) {
        if (a < 10) return "0" + a;
        return "" + a;
    }

    function fetchCurrentAndNextYear() {
        var current = new Date;
        var fullYear = current.getFullYear();
        var isZero = current.getMonth() == 0;
        return {
            current: current,
            isZero: isZero,
            next: new Date(fullYear + 1, 0, 1),
            newYear: isZero ? fullYear : (fullYear + 1)
        }
    }

    if (!this.yearInfo.isZero) {
        var diff = Math.ceil((this.yearInfo.next.getTime() - this.yearInfo.current.getTime()) / 1000);

        if (diff > 0) {
            this.hours = Math.floor(diff / 3600);
            var hours_ms = this.hours * 3600;
            this.minutes = Math.floor((diff - hours_ms) / 60);
            var minutes_ms = hours_ms + this.minutes * 60;
            this.seconds = diff - minutes_ms;
        }
    }
}

function NyTimerProcessor() {

    this.prepareState = function () {
        this.timeInfo = new TimeInfo();
    };

    this.updateState = function () {
        $("#time-filed").text(this.timeInfo.toStr());
        $(".year-filed").text(this.timeInfo.yearInfo.newYear);

        if (this.timeInfo.yearInfo.isZero) {
            $("#counter-label").hide();
            $("#greetings-label").show();
        } else {
            $("#counter-label").show();
            $("#greetings-label").hide();
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

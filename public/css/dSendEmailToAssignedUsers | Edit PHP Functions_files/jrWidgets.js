(function($) {
    $.fn.jrTimePickerWidget = function(/*options*/) {
        return this.filter("input").each(function(/*index, element*/) {
            var $this = $(this);

            var elementId = $this.attr("id");
            var upId = elementId + "_increase_time";
            var downId = elementId + "_decrease_time";
            var upArrow = $("#" + upId);
            var downArrow = $("#" + downId);
            var currentTime;
            var increaseMode = "hour";

            if (upArrow.length === 0) {
                upArrow = $('<i id="' + upId + '" class="jr-icon-chevron-up jr-form-control-icon"></i>');
                downArrow = $('<i id="' + downId + '" class="jr-icon-chevron-down jr-form-control-icon"></i>');

                $this.after(downArrow).after(upArrow);

                $this.on('click', function() {
                    if ($this.val().length < 8) {
                        return;
                    }
                    increaseMode = (getCursorPosition(elementId, 1) < 3) ? "hour" : "minute";
                });

                upArrow.on('click', function() {
                    increaseTime();
                });

                downArrow.on('click', function() {
                    decreaseTime();
                });
            }

            var increaseTime = function() {
                loadCurrentTime();

                if (increaseMode == 'minute') {
                    currentTime.minutes -= (currentTime.minutes % 15);
                    currentTime.minutes += 15;

                    if (currentTime.minutes > 59) {
                        currentTime.minutes = 0;
                        currentTime.hours++;
                    }
                } else {
                    currentTime.hours++;
                }

                if (currentTime.hours > 23) {
                    currentTime.hours = 0;
                }
                setCurrentTimeValue();
            };

            var loadCurrentTime = function() {
                var currentTimeValue = getCurrentTimeValue();

                var hours = currentTimeValue.substr(0, 2);
                if (hours[0] == "0") {
                    hours = hours[1];
                }

                var minutes = currentTimeValue.substr(3, 2);
                if (minutes[0] == "0") {
                    minutes = minutes[1];
                }

                currentTime = {
                    hours: parseInt(hours),
                    minutes: parseInt(minutes),
                    seconds: 0
                };
            };

            var setCurrentTimeValue = function() {
                for (var key in currentTime) {
                    if (currentTime[key] < 10) {
                        currentTime[key] = "0" + currentTime[key];
                    }
                }

                $this.val(currentTime.hours + ":" + currentTime.minutes + ":" + currentTime.seconds);
            };

            var getCurrentTimeValue = function() {
                if (!$this.val().match(/^([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/)) {
                    return "00:00:00";
                }
                return $this.val();
            };

            var decreaseTime = function() {
                loadCurrentTime();

                if (increaseMode == 'minute') {
                    currentTime.minutes -= 15;
                    var modulo = currentTime.minutes % 15;
                    if (modulo > 0) {
                        currentTime.minutes += 15 - modulo;
                    }

                    if (currentTime.minutes < 0) {
                        currentTime.minutes = 45;
                        currentTime.hours--;
                    }
                } else {
                    currentTime.hours--;
                }

                if (currentTime.hours < 0) {
                    currentTime.hours = 23;
                }

                setCurrentTimeValue();
            };

            var getCursorPosition = function(elementId, defaultValue) {
                el = document.getElementById(elementId);
                if (typeof el.selectionStart == "number") {
                    return el.selectionStart;
                }
                if (document.selection) {
                    el.focus();

                    var r = document.selection.createRange();
                    if (r == null) {
                        return 0;
                    }

                    var re = el.createTextRange(), rc = re.duplicate();
                    re.moveToBookmark(r.getBookmark());
                    rc.setEndPoint("EndToStart", re);

                    return rc.text.length;
                }
                return defaultValue;
            };
        });
    };
}(jQuery));
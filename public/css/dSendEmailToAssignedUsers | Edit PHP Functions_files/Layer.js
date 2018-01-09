var Layer = Class.create({

    initialize: function(layerId, showTransparentOnShow, hideTransparentOnHide) {

        this.layerId = layerId;
        this.showTransparentOnShow = (showTransparentOnShow == null) ? true : showTransparentOnShow;
        this.hideTransparentOnHide = (hideTransparentOnHide == null) ? true : hideTransparentOnHide;

        this.showStepContentContainer = false;
    },

    setShowTransparent: function(bool) {

        this.showTransparentOnShow = bool;
    },

    setHideTransparent: function(bool) {

        this.hideTransparentOnHide = bool;
    },

    show: function() {

        var x, y, width, height, posX, posY;

        var scrollOffsets = document.viewport.getScrollOffsets();

        x = document.viewport.getWidth();
        y = document.viewport.getHeight();

        width = $(this.layerId).getWidth();
        height = $(this.layerId).getHeight();

        posX = Math.round(x / 2) - Math.round(width / 2) + scrollOffsets.left;
        posY = Math.round(y / 2) - Math.round(height / 2) + scrollOffsets.top;
        if (posY < 0) {
            posY = 10;
        }

        $(this.layerId).setStyle({
            top: posY + 'px',
            left: posX + 'px'
        });

        window.onscroll = function(e) {
            $JR_LAYERS.each(function(element) {
                element.value.refreshPosition(e);
            });
        };

        jQuery(window).resize(function(e) {
            $JR_LAYERS.each(function(element) {
                element.value.refreshPosition(e);
                element.value.refreshSize(e);
            })
        });

        var stepContentContainer = $('stepContentContainer');
        if (stepContentContainer != null && !this.showStepContentContainer) {
            stepContentContainer.hide();
        }

        if (!$(this.layerId).visible()) {
            $(this.layerId).show();
        }
    },

    hide: function() {

        if ($(this.layerId).visible()) {
            $(this.layerId).hide();
        }

        if (this.hideTransparentOnHide) {
            $JR.LAYERS.getTransparencyLayer().hide();
        }

        var stepContentContainer = $('stepContentContainer');
        if (stepContentContainer != null) {
            stepContentContainer.show();
        }
    },

    refreshPosition: function(event) {

        var x, y, width, height, posX, posY;
        var currentPosition = document.viewport.getScrollOffsets();

        x = document.viewport.getWidth();
        y = document.viewport.getHeight();

        var layer = $(this.layerId);

        if (layer !== null) {

            width = layer.getWidth();
            height = layer.getHeight();

            posX = Math.round(x / 2) - Math.round(width / 2) + currentPosition.left;
            posY = Math.round(y / 2) - Math.round(height / 2) + currentPosition.top;

            layer.setStyle({
                top: posY + 'px',
                left: posX + 'px'
            });
        }
    },

    refreshSize: function(event) {

        // nichts tun!!!
    }
});

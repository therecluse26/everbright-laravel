var TransparencyLayer = Class.create(Layer, {

    initialize: function($super) {
        this.styles = {
            display: 'none',
            position: 'absolute',
            backgroundColor: '#aaa',
            zIndex: '400'
        };

        $super('transparentLayer', false, false);

        if ($(this.layerId) == null) {
            this.container = new Element('div', { id: this.layerId });
            document.body.appendChild(this.container);
            this.container.setStyle(this.styles);
        }

        this.refreshPosition();

        // Do not remove! Fix for IE <= 11:
        // integration with pdf document rendered from browser overlays popup,
        // so a dummy iframe is needed to prevent this (see Bug 6550, 6756).
        var dummyFrame = jQuery("<iframe>").css({
            width: '100%',
            height: '100%'
        });
        dummyFrame.appendTo(this.container);
    },

    show: function() {
        var x, y;

        x = document.viewport.getWidth();
        y = document.viewport.getHeight();

        $(this.layerId).setStyle({
            width: x + 'px',
            height: y + 'px'
        });
        $(this.layerId).setOpacity(0.8);

        if (!$(this.layerId).visible()) {
            $(this.layerId).show();
        }
    },

    hide: function($super) {

        $super();
    },

    refreshPosition: function(event) {

        var currentPosition = document.viewport.getScrollOffsets();
        $(this.layerId).setStyle({
            top: currentPosition.top + 'px',
            left: currentPosition.left + 'px'
        });
    },

    refreshSize: function(event) {

        var currentSize = document.viewport.getDimensions();
        $(this.layerId).setStyle({
            width: currentSize.width + 'px',
            height: currentSize.height + 'px'
        });
    }
});

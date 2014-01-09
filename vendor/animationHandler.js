define(["jquery"],
	function (jQuery) {
		var AnimationHandler = {
		    initialize: function (contentID) {
		        var self = this;
		        self.contentID = contentID;
		        self.animateObjects();
		    },
		    animateObjects: function () {
		        var self = this;
		        self.el = jQuery(self.contentID);
		
		    },
		    animateIn: function (type, postAnimateIn) {
				var self = this;
		    	var content = jQuery(this.contentID);
				if ( postAnimateIn ) {
					postAnimateOut();
				}
		
		    },
		    animateOut: function (type, postAnimateOut) {
		    	var self = this;
		    	var content = jQuery(this.contentID);
				if ( postAnimateOut ) {
					postAnimateOut();
				}
		
		    }
		};
		return AnimationHandler;
	}
);
define([
  'underscore',
  'handlebars',
  'map/presenters/analysis/AdvancedAnalysisResultsPresenter',
  'text!map/templates/analysis/advancedAnalysisResults.handlebars',
], function(_, Handlebars, Presenter, tpl) {

  'use strict';

  var AdvancedAnalysisView = Backbone.View.extend({

    el: '#advanced-analysis',

    template: Handlebars.compile(tpl),

    events: {
      'click .close' : 'close'
    },

    initialize: function(options) {
      options = options || {};
      this.resource = options.resource;

      this.presenter = new Presenter(this);
      this.presenter.requestAnalysis();

      this.render();
    },

    render: function() {
      this.$el.html(this.template());
    },

    close: function(e) {
      e && e.preventDefault();
      this.remove();
    }

  });

  return AdvancedAnalysisView;

});

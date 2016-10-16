// Generated by CoffeeScript 1.11.1
(function() {
  'use strict';
  var angular, fSlider, jQuery;

  jQuery = require('jquery');

  angular = require('angular');

  fSlider = require('flexslider');

  fSlider(jQuery);

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined' && typeof exports === 'object') {
    module.exports = 'angular-flexslider';
  }

  angular.module('angular-flexslider', []).directive('flexSlider', [
    '$parse', '$timeout', function($parse, $timeout) {
      return {
        restrict: 'AE',
        scope: false,
        replace: true,
        transclude: true,
        template: '<div class="flexslider-container"></div>',
        compile: function(element, attr, linker) {
          return function($scope, $element) {
            var addSlide, collectionString, flexsliderDiv, getTrackFromItem, indexString, match, removeSlide, slidesItems, trackBy;
            match = (attr.slide || attr.flexSlide).match(/^\s*(.+)\s+in\s+(.*?)(?:\s+track\s+by\s+(.+?))?\s*$/);
            indexString = match[1];
            collectionString = match[2];
            trackBy = angular.isDefined(match[3]) ? $parse(match[3]) : $parse("" + indexString);
            flexsliderDiv = null;
            slidesItems = {};
            getTrackFromItem = function(collectionItem, index) {
              var locals;
              locals = {};
              locals[indexString] = collectionItem;
              locals['$index'] = index;
              return trackBy($scope, locals);
            };
            addSlide = function(collectionItem, index, callback) {
              var childScope, track;
              track = getTrackFromItem(collectionItem, index);
              if (slidesItems[track] != null) {
                throw "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys.";
              }
              childScope = $scope.$new();
              childScope[indexString] = collectionItem;
              childScope['$index'] = index;
              return linker(childScope, function(clone) {
                var slideItem;
                slideItem = {
                  collectionItem: collectionItem,
                  childScope: childScope,
                  element: clone
                };
                slidesItems[track] = slideItem;
                return typeof callback === "function" ? callback(slideItem) : void 0;
              });
            };
            removeSlide = function(collectionItem, index) {
              var slideItem, track;
              track = getTrackFromItem(collectionItem, index);
              slideItem = slidesItems[track];
              if (slideItem == null) {
                return;
              }
              delete slidesItems[track];
              slideItem.childScope.$destroy();
              return slideItem;
            };
            return $scope.$watchCollection(collectionString, function(collection, oldCollection) {
              var attrKey, attrVal, c, currentSlidesLength, e, i, idx, j, k, l, len, len1, len2, len3, m, n, options, slider, slides, t, toAdd, toRemove, trackCollection;
              if (!((collection != null ? collection.length : void 0) || (oldCollection != null ? oldCollection.length : void 0))) {
                return;
              }
              if (flexsliderDiv != null) {
                slider = flexsliderDiv.data('flexslider');
                currentSlidesLength = Object.keys(slidesItems).length;
                if (collection == null) {
                  collection = [];
                }
                trackCollection = {};
                for (i = j = 0, len = collection.length; j < len; i = ++j) {
                  c = collection[i];
                  trackCollection[getTrackFromItem(c, i)] = c;
                }
                toAdd = (function() {
                  var k, len1, results;
                  results = [];
                  for (i = k = 0, len1 = collection.length; k < len1; i = ++k) {
                    c = collection[i];
                    if (slidesItems[getTrackFromItem(c, i)] == null) {
                      results.push({
                        value: c,
                        index: i
                      });
                    }
                  }
                  return results;
                })();
                toRemove = (function() {
                  var results;
                  results = [];
                  for (t in slidesItems) {
                    i = slidesItems[t];
                    if (trackCollection[t] == null) {
                      results.push(i.collectionItem);
                    }
                  }
                  return results;
                })();
                if ((toAdd.length === 1 && toRemove.length === 0) || toAdd.length === 0) {
                  for (k = 0, len1 = toRemove.length; k < len1; k++) {
                    e = toRemove[k];
                    e = removeSlide(e, collection.indexOf(e));
                    if (e) {
                      slider.removeSlide(e.element);
                    }
                  }
                  for (l = 0, len2 = toAdd.length; l < len2; l++) {
                    e = toAdd[l];
                    idx = e.index;
                    addSlide(e.value, idx, function(item) {
                      if (idx === currentSlidesLength) {
                        idx = void 0;
                      }
                      return $scope.$evalAsync(function() {
                        return slider.addSlide(item.element, idx);
                      });
                    });
                  }
                  return;
                }
              }
              slidesItems = {};
              if (flexsliderDiv != null) {
                flexsliderDiv.remove();
              }
              slides = jQuery('<ul class="slides"></ul>');
              flexsliderDiv = jQuery('<div class="flexslider"></div>');
              flexsliderDiv.append(slides);
              $element.append(flexsliderDiv);
              for (i = m = 0, len3 = collection.length; m < len3; i = ++m) {
                c = collection[i];
                addSlide(c, i, function(item) {
                  return slides.append(item.element);
                });
              }
              options = {};
              for (attrKey in attr) {
                attrVal = attr[attrKey];
                if (attrKey.indexOf('$') === 0) {
                  continue;
                }
                if (!isNaN(n = parseInt(attrVal))) {
                  options[attrKey] = n;
                  continue;
                }
                if (attrVal === 'false' || attrVal === 'true') {
                  options[attrKey] = attrVal === 'true';
                  continue;
                }
                if (attrKey === 'start' || attrKey === 'before' || attrKey === 'after' || attrKey === 'end' || attrKey === 'added' || attrKey === 'removed') {
                  options[attrKey] = (function(attrVal) {
                    var f;
                    f = $parse(attrVal);
                    return function(slider) {
                      return $scope.$apply(function() {
                        return f($scope, {
                          '$slider': {
                            element: slider
                          }
                        });
                      });
                    };
                  })(attrVal);
                  continue;
                }
                if (attrKey === 'startAt') {
                  options[attrKey] = $parse(attrVal)($scope);
                  continue;
                }
                options[attrKey] = attrVal;
              }
              if (!options.sliderId && attr.id) {
                options.sliderId = attr.id + "-slider";
              }
              if (options.sliderId) {
                flexsliderDiv.attr('id', options.sliderId);
              }
              return $timeout((function() {
                return flexsliderDiv.flexslider(options);
              }), 0);
            });
          };
        }
      };
    }
  ]);

}).call(this);

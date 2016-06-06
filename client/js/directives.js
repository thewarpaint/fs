// Adapted from http://bl.ocks.org/mbostock/3884955, http://bl.ocks.org/d3noob/7030f35b72de721622b8
'use strict';

angular
  .module('falconSocialApp')
  .directive('timeseries', function () {
    return {
      link: function ($scope, element) {
        var margin = { top: 20, right: 80, bottom: 30, left: 70 },
            totalWidth = 960,
            totalHeight = 600,
            width = totalWidth - margin.left - margin.right,
            height = totalHeight - margin.top - margin.bottom,
            parseDate = d3.time.format('%Y-%m-%dT%H:%M:%S.%LZ').parse,
            reachDict = {
              post_impressions: 'Total',
              post_impressions_organic: 'Organic',
              post_impressions_paid: 'Paid',
              post_impressions_viral: 'Viral'
            },
            reachKeys = Object.keys(reachDict),
            color = d3.scale.category10(),
            x = d3.time.scale().range([0, width]),
            y = d3.scale.linear().range([height, 0]),
            xAxis = d3.svg.axis()
              .scale(x)
              .orient('bottom'),
            yAxis = d3.svg.axis()
              .scale(y)
              .orient('left'),
            line = d3.svg.line()
              .interpolate('linear')
              .x(function (d) { return x(d.date); })
              .y(function (d) { return y(d.value); }),
            series,
            svg,
            legend,
            firstTime = true;

        svg = d3.select(element[0])
          .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
          .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        color.domain(reachKeys);

        $scope.$watch('data', function (list) {
          var timeseries;

          if(list.length) {
            list.forEach(function (d) {
              reachKeys.forEach(function (key) {
                d[key][0].timestamp = parseDate(d[key][0].timestamp);
              });
            });

            timeseries = color.domain().map(function (key) {
              return {
                name: key,
                values: list.map(function (d) {
                  return {
                    date: d[key][0].timestamp,
                    value: +d[key][0].value
                  };
                })
              };
            });

            x.domain([
              list[0].post_impressions[0].timestamp,
              list[list.length - 1].post_impressions[0].timestamp
            ]);

            y.domain([
              d3.min(timeseries, function (d) {
                return d3.min(d.values, function (v) {
                  return v.value;
                });
              }),
              d3.max(timeseries, function (d) {
                return d3.max(d.values, function (v) {
                  return v.value;
                });
              })
            ]);

            if(firstTime) {
              timeseries.forEach(function (series) {
                svg
                  .append('path')
                    .attr('class', 'line line-' + series.name)
                    .attr('d', line(series.values))
                    .attr('data-legend', reachDict[series.name])
                    .style('stroke', color(series.name));
              });

              svg
              .append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + height + ')')
              .call(xAxis);

              svg
              .append('g')
              .attr('class', 'y axis')
              .call(yAxis)
              .append('text')
              .attr('transform', 'rotate(-90)')
              .attr('y', 6)
              .attr('dy', '.71em')
              .style('text-anchor', 'end')
              .text('Impressions');

              legend = svg.append('g')
              .attr('class', 'legend')
              .attr('transform', 'translate(50,30)')
              .style('font-size', '12px')
              .call(d3.legend);

              firstTime = false;
            } else {
              svg = d3.select(element[0]).transition();

              svg
                .selectAll('.x.axis')
                  .duration(500)
                  .call(xAxis);

              svg
                .selectAll('.y.axis')
                  .duration(500)
                  .call(yAxis);

              timeseries.forEach(function (series) {
                svg
                  .select('.line-' + series.name)
                    .duration(500)
                    .attr('d', line(series.values));
              });
            }
          }
        }.bind(this));
      },
      restrict: 'A',
      scope: {
        data: '='
      },
      template: ''
    };
  });

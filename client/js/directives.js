// Adapted from http://bl.ocks.org/mbostock/3884955
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
              .interpolate('basis')
              .x(function (d) { return x(d.date); })
              .y(function (d) { return y(d.value); }),
            series,
            svg,
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

            console.log(timeseries, firstTime);

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

            series = svg
              .selectAll('.city')
                .data(timeseries)
              .enter()
              .append('g')
                .attr('class', 'city');

            series
              .append('text')
                .datum(function (d) {
                  return { name: reachDict[d.name], value: d.values[d.values.length - 1] };
                })
                .attr('transform', function (d) {
                  return 'translate(' + x(d.value.date) + ',' + y(d.value.value) + ')';
                })
                .attr('x', 3)
                .attr('dy', '.35em')
                .text(function(d) { return d.name; });

            if(firstTime) {
              series
                .append('path')
                  .attr('class', 'line')
                  .attr('d', function (d) { return line(d.values); })
                  .style('stroke', function(d) { return color(d.name); });

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

              firstTime = false;
            } else {
              svg = d3.select(element[0]).transition();
              // series = series.transition();
              // series.transition();

              // series = svg
              //   .selectAll('.city')
              //     // .data(timeseries)
              //     .transition();

              svg
              // // series
                .selectAll('.line')
                  .duration(750)
                  .attr('d', function (d) { console.log(d); return line(d.values); })
                  .style('stroke', function(d) { return color(d.name); });

              ///

              // series = svg
              //   .selectAll('.city')
              //     .data(timeseries)
              //   .enter()
              //   .append('g')
              //     .attr('class', 'city');
              //
              // series
              //   .append('text')
              //     .datum(function (d) {
              //       return { name: reachDict[d.name], value: d.values[d.values.length - 1] };
              //     })
              //     .attr('transform', function (d) {
              //       return 'translate(' + x(d.value.date) + ',' + y(d.value.value) + ')';
              //     })
              //     .attr('x', 3)
              //     .attr('dy', '.35em')
              //     .text(function(d) { return d.name; });
              //
              // series
              //   .append('path')
              //     .attr('class', 'line')
              //     .attr('d', function (d) { return line(d.values); })
              //     .style('stroke', function(d) { return color(d.name); });

              ///

              // svg
              //   .selectAll('.x.axis')
              //     .duration(750)
              //     .call(xAxis);
              //
              // svg
              //   .selectAll('.y.axis')
              //     .duration(750)
              //     .call(yAxis);
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

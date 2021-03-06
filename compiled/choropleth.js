// Generated by CoffeeScript 1.6.2
(function() {
  var Choropleth, Geomap,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Geomap = require('geomap');

  module.exports = Choropleth = (function(_super) {
    __extends(Choropleth, _super);

    function Choropleth() {
      var add_properties, name, value;

      Choropleth.__super__.constructor.call(this);
      add_properties = {
        column: null,
        domain: null,
        format: d3.format(',.02f'),
        legend: false,
        colors: colorbrewer.OrRd[9]
      };
      for (name in add_properties) {
        value = add_properties[name];
        this.properties[name] = value;
        addAccessor(this, name, value);
      }
      this.data_by_id = {};
    }

    Choropleth.prototype.columnVal = function(id, col) {
      var geomap;

      geomap = this;
      if (geomap.data_by_id[id]) {
        return geomap.data_by_id[id][col];
      } else {
        return 'No data';
      }
    };

    Choropleth.prototype.colorVal = function(id, col) {
      var geomap;

      geomap = this;
      if (geomap.data_by_id[id]) {
        return geomap.colorize(geomap.data_by_id[id][col]);
      } else {
        return '#eeeeee';
      }
    };

    Choropleth.prototype.tooltip = function(d) {
      var col, cols, geomap, text, _i, _len;

      geomap = this;
      text = d.properties.name + '\n\n';
      text += geomap.properties.column + ': ' + geomap.properties.format(geomap.columnVal(d.id, geomap.properties.column)) + '\n\n';
      cols = d3.keys(geomap.data_by_id[d.id]);
      for (_i = 0, _len = cols.length; _i < _len; _i++) {
        col = cols[_i];
        if (col && (col !== geomap.properties.column && col !== geomap.unitId())) {
          text += col + ': ' + geomap.columnVal(d.id, col) + '\n';
        }
      }
      return text;
    };

    Choropleth.prototype.draw = function(selection, geomap) {
      geomap["private"].data = selection.datum();
      return Choropleth.__super__.draw.call(this, selection, geomap);
    };

    Choropleth.prototype.update = function() {
      var d, geomap, max, min, scaleFunc, unitId, val, _i, _len, _ref;

      geomap = this;
      unitId = geomap.properties.unitId;
      d3.selectAll('path.unit').remove();
      min = null;
      max = null;
      _ref = geomap["private"].data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        val = parseFloat(d[geomap.properties.column]);
        if (min === null || val < min) {
          min = val;
        }
        if (max === null || val > max) {
          max = val;
        }
        geomap.data_by_id[d[unitId]] = d;
      }
      geomap["private"].domain = geomap.properties.domain || [min, max];
      if (geomap["private"].domain.length > 2) {
        scaleFunc = d3.scale.threshold;
      } else {
        scaleFunc = d3.scale.quantize;
      }
      geomap.colorize = scaleFunc().domain(geomap["private"].domain).range(geomap.properties.colors);
      geomap.selection.units.enter().append('path').attr('class', 'unit').attr('d', geomap.properties.path).style('fill', function(d) {
        return geomap.colorVal(d.id, geomap.properties.column);
      }).on('click', geomap.clicked.bind(geomap)).append('title').text(function(d) {
        return geomap.tooltip(d);
      });
      if (geomap.properties.legend) {
        geomap.drawLegend(min, max);
      }
      if (geomap.postUpdate()) {
        return geomap.properties.postUpdate();
      }
    };

    Choropleth.prototype.drawLegend = function(min_val, max_val) {
      var box_h, box_w, colorlist, domain_max, domain_min, geomap, l_tr, legend_h, lg, max_text, min_text, min_val_idx, offset_t, offset_y, rect_h, rect_w, sg;

      geomap = this;
      box_w = 120;
      box_h = 240;
      rect_w = 16;
      legend_h = 210;
      offset_t = 4;
      offset_y = geomap.properties.height - box_h;
      colorlist = geomap.properties.colors.slice().reverse();
      rect_h = legend_h / colorlist.length;
      domain_min = geomap["private"].domain[0];
      domain_max = geomap["private"].domain[geomap["private"].domain.length - 1];
      geomap.properties.svg.select('g#legend').remove();
      lg = geomap.properties.svg.append('g').attr('id', 'legend').attr('width', box_w).attr('height', box_h).attr('transform', 'translate(0,' + offset_y + ')');
      lg.append('rect').attr('class', 'legend-bg').attr('width', box_w).attr('height', box_h);
      l_tr = 'translate(' + offset_t + ',' + offset_t * 3 + ')';
      lg.append('rect').attr('class', 'legend-bar').attr('width', rect_w).attr('height', legend_h).attr('transform', l_tr);
      sg = lg.append('g').attr('transform', l_tr);
      sg.selectAll('rect').data(colorlist).enter().append('rect').attr('y', function(d, i) {
        return i * rect_h;
      }).attr('fill', function(d, i) {
        return colorlist[i];
      }).attr('width', rect_w).attr('height', rect_h);
      sg.selectAll('text').data(colorlist).enter().append('text').text(function(d) {
        return geomap.properties.format(geomap.colorize.invertExtent(d)[0]);
      }).attr('class', function(d, i) {
        return 'text-' + i;
      }).attr('x', rect_w + offset_t).attr('y', function(d, i) {
        return i * rect_h + rect_h + offset_t;
      });
      max_text = geomap.properties.format(domain_max);
      if (domain_max < max_val) {
        if (domain_max > domain_min) {
          max_text = '> ' + max_text;
        } else {
          max_text = '< ' + max_text;
        }
      }
      sg.append('text').text(max_text).attr('x', rect_w + offset_t).attr('y', offset_t);
      min_text = geomap.properties.format(domain_min);
      if (min_val < domain_min) {
        if (geomap["private"].domain.length > 2) {
          min_text = geomap.properties.format(min_val);
        } else {
          if (domain_max > domain_min) {
            min_text = '< ' + min_text;
          } else {
            min_text = '> ' + min_text;
          }
        }
      }
      min_val_idx = colorlist.length - 1;
      return sg.selectAll('text.text-' + min_val_idx).text(min_text);
    };

    return Choropleth;

  })(Geomap);

}).call(this);

import {getTheme} from 'config/theme';
import * as d3 from 'd3';
const theme = getTheme();

// public function
const D3CalendarPainter = {};
const painterObj = {};
const dataObj = {};
const initObj = {};

D3CalendarPainter.optionGenerator = (defaultOption) => {
  const tempWidth = defaultOption?.width < 1300 ? 1300: defaultOption?.width;
  const width = tempWidth - tempWidth / 10;
  const cellSize = width / 55.2;
  return {
    width: width,
    cellSize: cellSize,
    height: cellSize * 7
  };
};

D3CalendarPainter.init = ({
  container,
  dataSource,
  defaultOption,
  event
}) => {
  if (!container) return new Error('The Container attribute can not be null');
  D3CalendarPainter.self = {};
  D3CalendarPainter.self.container = container;
  D3CalendarPainter.self.data = initObj.initData(dataSource);
  D3CalendarPainter.self.option =
    initObj.initOption(
        D3CalendarPainter.self.data,
        D3CalendarPainter.optionGenerator(defaultOption)
    );
  D3CalendarPainter.self.func =
    initObj.initFunc(D3CalendarPainter.self.option);
  D3CalendarPainter.self.event = event;
  D3CalendarPainter.self.isLoaded = true;
};

// public function
D3CalendarPainter.painting = () => {
  if (!D3CalendarPainter.self.isLoaded) {
    return new Error('D3Init is not loaded!');
  }
  const svg = painterObj.initContainer();
  painterObj.drawingYear(svg);
  painterObj.drawingMonth();
};

D3CalendarPainter.erasing = () => {
  D3CalendarPainter.self.container.innerHTML = '';
};

// private function
painterObj.initContainer = () => {
  if (!D3CalendarPainter.self.container) {
    return new Error('The Container attribute can not be null');
  }
  const option =
    initObj.initContainerOption(D3CalendarPainter.self);

  return d3.select(D3CalendarPainter.self.container)
      .append('svg')
      .attr('width', option.width)
      .attr('height',
          option.height * D3CalendarPainter.self.data.years.length)
      .attr('viewBox',
          [
            0,
            0,
            option.width,
            option.height * D3CalendarPainter.self.data.years.length])
      .attr('style', option.style);
};
painterObj.drawingYear = (svg) => {
  if (!svg) return new Error('The svg can not be null');

  const {
    data,
    option,
    func
  } = D3CalendarPainter.self;

  const year = svg.selectAll('g')
      .data(data.years)
      .join('g')
      .attr('transform', (d, i) =>
        `translate(40.5, ${option.height * i + option.cellSize * 1.5})`);

  year.append('text')
      .attr('x', -5)
      .attr('y', -5)
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'end')
      .text(([key]) => key);

  year.append('g')
      .attr('text-anchor', 'end')
      .selectAll()
      .data(d3.range(0, 7))
      .join('text')
      .attr('x', -5)
      .attr('y', (i) => (func.countDay(i) + 0.5) * option.cellSize)
      .attr('dy', '0.31em')
      .text(func.format.formatDay);

  painterObj.drawingDayByYear(year, painterObj.drawingDayByYear.type.text)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 500)
      .text((d) => {
        const date = painterObj.convertToDate(d.date);
        return date.getDate();
      });

  painterObj.drawingDayByYear(year, painterObj.drawingDayByYear.type.rect)
      .attr('fill', (d) => {
        if (!d.value) {
          return theme.color.Alabaster;
        } else {
          return option.color(d.value);
        }
      })
      .attr('opacity', '0.75')
      .attr('cursor', 'pointer')
      .on('click', function(e) {
        const clickEvent = D3CalendarPainter?.self?.event?.onClick;
        if (clickEvent) clickEvent(e);
      })
      .append('title')
      .text((d) => {
        if (!d.value) return;
        const date = painterObj.convertToDate(d.date);
        return `일자: ${
          func.format.formatDate(dataObj.dataReturnToYMD(date))
        }
        값: ${
          !d.value ? '' : `${d.value}`}`;
      });
  D3CalendarPainter.self.container.year = year;
  D3CalendarPainter.self.container.year.isLoaded = true;
};

painterObj.drawingDayByYear = (year, type) => {
  const {
    option,
    func
  } = D3CalendarPainter.self;
  return year.append('g')
      .selectAll()
      .data(([, values]) =>values.filter((d) =>
        ![-1, 7].includes(painterObj.convertToDate(d.date).getUTCDay())))
      .join(type)
      .attr('width', option.cellSize - 1)
      .attr('height', option.cellSize - 1)
      .attr('x', (d) => {
        const date = painterObj.convertToDate(d.date);
        let result =
        d3.timeWeek.count(d3.utcYear(date), date) * option.cellSize + 0.5;
        result = (type === painterObj.drawingDayByYear.type.text) ?
        result + (option.cellSize / 2.3) : result;
        return result;
      })
      .attr('y', (d) => {
        const date = painterObj.convertToDate(d.date);
        let result = func.countDay(date.getUTCDay()) * option.cellSize + 0.5;
        result = (type === painterObj.drawingDayByYear.type.text) ?
        result + (option.cellSize / 1.4) : result;
        return result;
      });
};

painterObj.drawingDayByYear.type = {
  rect: 'rect',
  text: 'text'
};

painterObj.convertToDate = (d) => {
  const offset = 9 * 60;
  const kstOffset = offset * 60 * 1000;
  const utcDate = new Date(d);
  const kstDate = new Date(utcDate.getTime() + kstOffset);
  return kstDate;
};

painterObj.drawingMonth = () => {
  const {
    option,
    func,
    container
  } = D3CalendarPainter.self;
  const year = container.year;
  const month = year.append('g')
      .selectAll()
      .data(([, values]) => {
        return d3.utcMonths(d3.utcMonth(new Date(values[0].date)),
            new Date(values.at(-1).date));
      })
      .join('g');

  month.filter((d, i) => i).append('path')
      .attr('fill', 'none')
      .attr('stroke', theme.color.Cranberry)
      .attr('stroke-width', 2)
      .attr('d', (i) => func.pathMonth(i));

  month.append('text')
      .attr('x', (d) => d3.timeWeek.count(d3.utcYear(d),
          d3.timeWeek.ceil(d)) * option.cellSize + 2)
      .attr('y', -5)
      .text((i) => dataObj.getMonthName(func.format.formatMonth(i)));
};

dataObj.getMonthName = (name) => {
  return [
    'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec'
  ].findIndex((month) => name === month) + 1 + '월';
};

dataObj.convertToDateTimeSetZero = (data) => {
  const tempDate = new Date(data);
  tempDate.setHours(0, 0, 0, 0);
  return new Date(tempDate);
};

dataObj.dataReturnToYMD = (d) => {
  return {
    year: d.getFullYear(),
    month: String(d.getMonth() + 1).padStart(2, '0'),
    day: String(d.getDate()).padStart(2, '0')
  };
};

dataObj.compareDates = (d1, d2) => {
  const date1 = new Date(d1).getTime();
  const date2 = new Date(d2).getTime();

  if (date1 < date2 || date1 > date2) {
    return false;
  } else {
    return true;
  }
};

dataObj.formatPakage = () => {
  return {
    formatValue: d3.format('+.2%'),
    formatClose: d3.format('$,.2f'),
    formatDate: (d) => `${d.year}-${d.month}-${d.day}`,
    formatDay: (i) => '일월화수목금토'[i],
    formatMonth: d3.utcFormat('%b')
  };
};

dataObj.convertToDateFormat = (date) => {
  const regex = /^\d{8}$/;
  if (regex.test(date)) {
    const year = date.substr(0, 4);
    const month = date.substr(4, 2);
    const day = date.substr(6, 2);
    return `${year}-${month}-${day}`;
  }
  return date;
};

dataObj.generateDate = ({
  start,
  end,
  fillDataSource
}) => {
  const dataSource = [];
  // sort by
  fillDataSource = fillDataSource.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

  let tempDate = fillDataSource.length !== 0 ? fillDataSource.shift() : '';
  for (let year = start; year <= end; year++) {
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const comparisonDate = dataObj.convertToDateTimeSetZero(tempDate.date);
        if (dataObj.compareDates(date, comparisonDate) &&
        !isNaN(comparisonDate)) {
          dataSource.push({Date: date, value: tempDate.value});
          tempDate = fillDataSource.length !== 0 ? fillDataSource.shift() : '';
        } else {
          dataSource.push({Date: date, value: 0});
        }
      }
    }
  }
  return dataSource;
};

dataObj.getMinMaxYear = (dates) => {
  let minYear = new Date().getUTCFullYear();
  let maxYear = minYear;

  dates.forEach((date) => {
    const tempDate = new Date(date.date);
    const year = tempDate.getUTCFullYear();
    if (minYear > year) {
      minYear = year;
    }
    if (minYear < year) {
      maxYear = year;
    }
  });
  return {
    minYear,
    maxYear
  };
};

initObj.initContainerOption = ({
  option
}) => {
  return {
    width: option?.width,
    height: option?.height,
    viewBox: option?.viewBox,
    style: option?.style
  };
};

initObj.initData = (fillDataSource) => {
  fillDataSource = fillDataSource.map((d) => {
    return {
      date: dataObj.convertToDateFormat(d.date),
      value: d.value
    };
  });
  const {minYear, maxYear} = dataObj.getMinMaxYear(fillDataSource);
  const dataSource = dataObj.generateDate({
    start: minYear,
    end: maxYear,
    fillDataSource: fillDataSource
  });

  const data = dataSource.map((d) => {
    return {
      date: painterObj.convertToDate(d.Date),
      value: d.value
    };
  });
  const years = d3.groups(data, (d) => {
    const date = new Date(d.date);
    const year = date.getUTCFullYear();
    return year;
  }).reverse();
  return {
    pairData: data,
    years: years
  };
};

initObj.initFunc = (option) => {
  const countDay = (i) => (i + 7) % 7;
  const pathMonth = (t) => {
    if (!t.getUTCDay()) {
      t = new Date(t);
    }
    const d = Math.max(0, Math.min(5, countDay(t.getUTCDay())));
    const w = d3.timeWeek.count(d3.utcYear(t), t);
    const cellSize = option.cellSize;
    return `${d === 0 ?
      `M${w * option.cellSize},0` : d === 7 ?
      `M${(w + 1) * cellSize},0` :
      `M${(w + 1) * cellSize},0V ${
        d * cellSize}H${w * cellSize
      }`}V${7 * cellSize}`;
  };
  return {
    countDay,
    pathMonth,
    format: dataObj.formatPakage()
  };
};

initObj.initOption = (data, defaultOption) => {
  const max = d3.quantile(data.pairData, 0.9975, (d) => Math.abs(d.value));
  const color = d3.scaleSequential(d3.interpolatePiYG).domain([-max, +max]);
  const width = defaultOption?.width || '100%';
  const cellSize = defaultOption?.cellSize || 7;
  const height = cellSize * 9;

  return {
    width,
    height,
    max,
    color,
    cellSize
  };
};

export default D3CalendarPainter;

const DUMMY_DATA = [
	{ id: 'd1', value: 10, region: 'USA' },
	{ id: 'd2', value: 20, region: 'India' },
	{ id: 'd3', value: 30, region: 'China' },
	{ id: 'd4', value: 40, region: 'Taiwan' },
];

// chart height and width
const MARGINS = { top: 20, bottom: 10 };
const CHART_WIDTH = 600;
const CHART_HEIGHT = 400 - MARGINS.top - MARGINS.bottom;
let selectedData = DUMMY_DATA;

// set x and y scale
const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
const y = d3.scaleLinear().range([CHART_HEIGHT, 0]);

x.domain(DUMMY_DATA.map(data => data.region));
y.domain([0, d3.max(DUMMY_DATA, data => data.value) + 10]);

// define chart container
const chartContainer = d3
	.select('svg')
	.attr('width', CHART_WIDTH)
	.attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom);

const chart = chartContainer.append('g');

// adding the x-axis region
chart
	.append('g')
	.call(d3.axisBottom(x).tickSizeOuter(0))
	.attr('transform', `translate(0, ${CHART_HEIGHT})`)
	.attr('color', '#4f009e');

function renderChart() {
	// add chart bar width、height, also set the x and y position
	chart
		.selectAll('.bar')
		.data(selectedData, data => data.id)
		.enter()
		.append('rect')
		.classed('bar', true)
		.attr('width', x.bandwidth())
		.attr('height', data => CHART_HEIGHT - y(data.value))
		.attr('x', data => x(data.region))
		.attr('y', data => y(data.value));

	// remove non-selected bar
	chart
		.selectAll('.bar')
		.data(selectedData, data => data.id)
		.exit()
		.remove();

	// adding the value label on top of each bar
	chart
		.selectAll('.label')
		.data(selectedData, data => data.id)
		.enter()
		.append('text')
		.text(data => data.value)
		.attr('x', data => x(data.region) + x.bandwidth() / 2)
		.attr('y', data => y(data.value) - 20)
		.attr('text-anchor', 'middle')
		.classed('label', true);

	// remove non-selected bar label
	chart
		.selectAll('.label')
		.data(selectedData, data => data.id)
		.exit()
		.remove();
}

renderChart();

// add region list
let unselectedIds = [];
const listItems = d3
	.select('#data')
	.select('ul')
	.selectAll('li')
	.data(DUMMY_DATA)
	.enter()
	.append('li');

listItems.append('span').text(data => data.region);

listItems
	.append('input')
	.attr('type', 'checkbox')
	.attr('checked', true)
	.attr('id', data => data.id)
	.on('change', e => {
		if (unselectedIds.indexOf(e.target.id) === -1) {
			unselectedIds.push(e.target.id);
		} else {
			unselectedIds = unselectedIds.filter(id => id !== e.target.id);
		}

		selectedData = DUMMY_DATA.filter(
			data => unselectedIds.indexOf(data.id) === -1
		);

		renderChart();
	});

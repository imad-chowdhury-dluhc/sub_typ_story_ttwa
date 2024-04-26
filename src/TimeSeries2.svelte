<script>

// CORE IMPORTS
	import { setContext, onMount } from "svelte";
	import { getMotion } from "./utils.js";
	import { themes } from "./config.js";
	import Scroller from "./layout/Scroller.svelte";
	import Em from "./ui/Em.svelte";
	//import ColourScaleLegend from "./map_components/ColourScaleLegend.svelte";
	
    // DEMO-SPECIFIC IMPORTS
	//import bbox from "@turf/bbox";
	import { getData, setColors, getTopo, getColor, fitBounds, fitById, fitFeatures} from "./utils.js";
	import { map_variable_lookup, colors, units, mapbounds } from "./config.js";
    import { ScatterChart, LineChart, BarChart } from "@onsvisual/svelte-charts";

	// CONFIG FOR SCROLLER COMPONENTS
	const threshold = 0.65;
	// State
	let animation = getMotion(); // Set animation preference depending on browser preference
	let id = {}; // Object to hold visible section IDs of Scroller components
	let idPrev = {}; // Object to keep track of previous IDs, to compare for changes
	onMount(() => {
		idPrev = {...id};
	});
	let offset;
	let index;


// Data
    let data = {bua: {}};
	let metadata = {bua: {}};
	let LA_opac = 0.7;
	// Element bindings
	// State
	let selected; // Selected area (chart or map)
	
    let hov = ''; 
    let hover_dict = {};
    let hovered_bua; // Hovered bua (chart or map)

    let hovered;
	let xKey = "jitter"; // xKey for scatter chart
	let yKey = "gva"; // yKey for scatter chart
	let zKey = "cluster_name"; // zKey (color) for scatter chart
	let rKey = null; // rKey (radius) for scatter chart
    let explore = false; // Allows chart/map interactivity to be toggled on/off
	

    	// Functions for chart and map on:select and on:hover events
	

export function doHover_chart(e) {
  hovered = e.detail.id;
}

    //Need these to be reactive.
    $: map_variable_lookup;
    $: hovered_bua;
    $: hover_dict;

//For the scatter/jitter plots, let's attempt to do bua and MSOA in the same frame.
getData('./data/data_bua.csv')
	.then(arr => {
		let meta = arr.map(d => ({
				code: d.code,
				name: d.name,
				parent: d.parent ? d.parent : null
			}));
			let lookup = {};
			meta.forEach(d => {
				lookup[d.code] = d;
			});
			metadata.bua.array = meta;
			metadata.bua.lookup = lookup;
			let indicators = arr.map((d, i) => ({
				...meta[i],
                gva: d.gva,
                imd: d.imd,
				jitter: d.cluster2_jitter,
				cluster_name: d["cluster2_name"],
			}));

            ['gva', 'imd'].forEach(key => {
                indicators.forEach((d, i) => indicators[i][key + '_color'] = getColor(d[key], map_variable_lookup[key].scale, map_variable_lookup[key].scale_colours));
				});
			
				data.bua.indicators = indicators;
			});


// FUNCTIONS (INCL. SCROLLER ACTIONS)
      
      
	// Actions for Scroller components
	const actions = {
		chart: { // Actions for <Scroller/> with id="map"
		chart01: () => {
				xKey = "jitter";
				yKey = "gva";
				zKey = "cluster_name";
                rKey = null;
				explore = false;
			},
			chart02: () => {
				xKey = "jitter";
				yKey = "imd";
				zKey = "cluster_name";
                rKey = null;
				explore = false;
			}
		}
	};
	// Code to run Scroller actions when new caption IDs come into view
	function runActions(codes = []) {
		codes.forEach(code => {
			if (id[code] != idPrev[code]) {
				if (actions[code][id[code]]) {
					actions[code][id[code]]();
				}
				idPrev[code] = id[code];
			}
		});
	}
	$: id && runActions(Object.keys(actions)); // Run above code when 'id' object changes

    
</script>

<!-- HTML part -->

{#if data.bua.indicators}
<Scroller {threshold} bind:id={id['chart']} splitscreen={true}>
	<div slot="background">
		<figure>
			
			<div class="col-full height-full">
				
					<div class="chart">
						<ScatterChart
						height="calc(100vh - 150px)"
						data={data.bua.indicators}
						colors={explore ? ['lightgrey'] : colors.cat2}
                        padding.top = 40
						{xKey} {yKey} {zKey} {rKey} idKey="code" labelKey="name"
						r={[5]}
                        yMax = 1000
						xMax = 6
						xMin = 0
						xTicks = []
						ySuffix=" million"
						yFormatTick={d => d.toLocaleString()}
						legend={zKey != null} labels
						select={explore} selected={explore ? selected : null} 
						hover {hovered} on:hover={doHover_chart}
						colorSelect="#206095" colorHighlight="#999" overlayFill
						{animation}/>
						<div class="label label-y outline" style="left: 0%; top: 15%;">GVA (log scale)</div>
						<div class="label label-title" style="top: 90%;">GVA for buas</div>
					</div>
				
			</div>
		</figure>
	</div>
	<div slot="foreground">
		<section data-id="chart01">
			<div class="col-medium">
				<a id="TimeSeries2" style="color: black"><br><br></a>
				<p>
					IMD data (made up).
				</p>
			</div>
		</section>
	</div>
</Scroller>
{/if}

<style>
	.label {
		position: absolute;
		font-size: 14px;
		color: #666;
	}
    .label-title {
    color: #333;
    font-weight: bold;
}
.label-y {
    position: absolute;
    top: 0px;
    text-align: right;
    -webkit-writing-mode: vertical-rl;
    -ms-writing-mode: tb-rl;
    writing-mode: vertical-rl;
    -webkit-transform: rotate(-180deg);
    -ms-transform: rotate(-180deg);
    transform: rotate(-180deg);
}
</style>
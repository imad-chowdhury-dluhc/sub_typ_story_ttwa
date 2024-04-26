<script>

// CORE IMPORTS
	import { setContext, onMount } from "svelte";
	import { getMotion } from "./utils.js";
	import { themes } from "./config.js";
	import Scroller from "./layout/Scroller.svelte";
	import Em from "./ui/Em.svelte";
	import ColourScaleLegend from "./map_components/ColourScaleLegend_copy.svelte";
	
    // DEMO-SPECIFIC IMPORTS
	//import bbox from "@turf/bbox";
	import { getData, setColors, getTopo, getColor, fitBounds, fitById, fitFeatures} from "./utils.js";
	import { map_variable_lookup, colors, units, mapbounds } from "./config.js";
	import { Map, MapSource, MapLayer, MapTooltip } from "@onsvisual/svelte-maps";
	// CORE CONFIG (COLOUR THEMES)
	// Set theme globally (options are 'light', 'dark' or 'lightblue')
	let theme = "light";
	setContext("theme", theme);
	setColors(themes, theme);
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

    // Constants
	const topojson = "./data/BUA22.json";
	const mapstyle = "https://bothness.github.io/ons-basemaps/data/style-omt.json";

// Data
    let data = {bua: {}};
	let metadata = {bua: {}};
	let geojson;
	let LA_opac = 0.7;
	// Element bindings
	let map; // Bound to mapbox 'map' instance once initialised
	// State
	let selected; // Selected area (chart or map)
	let mapHighlighted = []; // Highlighted area (map only)
	let mapKey = "cluster1"; // Key for data to be displayed on map
	let explore = false; // Allows chart/map interactivity to be toggled on/off

    let hov = ''; 
    let hover_dict = {};
    let hovered_bua; // Hovered bua (chart or map)

    	// Functions for chart and map on:select and on:hover events
	export function doSelect(e, map_id, geo) {
		selected = e.detail.id;
		if (e.detail.feature) fitById(selected, map_id, geo); // Fit map if select event comes from map
	}
	
	export function doHover(e) {
		hovered_bua = '';
		if (e.detail.id !== null){
			let feature_id =  e.detail.id;
      if (e.detail.feature.source == 'bua'){
				hovered_bua = feature_id; 
			}
			else{
				hovered = feature_id;
			}
		}
		hover_dict = {"bua": hovered_bua};	
	}

export function doHover_chart(e) {
  hovered = e.detail.id;
}

export let hover_data_finder = function(mapKey){
  let geography_key = map_variable_lookup[mapKey].geography;
  hov = hover_dict[geography_key]
  if (hov){
    let hover_data = data[geography_key].indicators?.find(d => d.code == hov)['cluster1_name']
	console.log(data[geography_key].indicators?.find(d => d.code == hov))
    if (hover_data == ''){
      return "Data unavailable";
    }
    else{
      return hover_data;
    }
  }
  return "";
}
export let hover_name_finder = function(mapKey){
  let geography_key = map_variable_lookup[mapKey].geography;
  hov = hover_dict[geography_key]
  if (hov) {
    return metadata[geography_key].lookup[hov].name
  } else {
    return "";
  }
}

    //Need these to be reactive.
    $: hover_name_finder(mapKey);
	$: hover_data_finder(mapKey);
    $: map_variable_lookup;
    $: hovered_bua;
    $: hover_dict;

//For the scatter/jitter plots, let's attempt to do LAD and MSOA in the same frame.
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
				cluster1: d.cluster1,
				cluster1_name: d.cluster1_name,
                // The following are for highlighting each individual cluster
				cluster1_umh: d.cluster1,
				cluster1_hscaa: d.cluster1,
				cluster1_h: d.cluster1,
				cluster1_dca: d.cluster1,
				cluster1_utac: d.cluster1,
			}));

            ['cluster1','cluster1_umh', 'cluster1_hscaa', 'cluster1_h', 'cluster1_dca', 'cluster1_utac'].forEach(key => {
					indicators.forEach((d, i) => indicators[i][key + '_color'] = getColor(d[key], map_variable_lookup[key].scale, map_variable_lookup[key].scale_colours));
				});
			
				data.bua.indicators = indicators;
			});

//DATA inputs
getTopo(topojson, 'data').then(geo => {
		geojson = geo;
	}); 

// FUNCTIONS (INCL. SCROLLER ACTIONS)
      
      
	// Actions for Scroller components
	const actions = {
		map: { // Actions for <Scroller/> with id="map"
		map01: () => {
				fitBounds(mapbounds.england, map);
				mapKey = "cluster1";
				mapHighlighted = [];
				explore = false;
			},
			map02: () => {
				fitBounds(mapbounds.england, map);
				mapKey = "cluster1_umh";
				mapHighlighted = [];
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


{#if geojson && data.bua.indicators}
<Scroller {threshold} bind:index bind:offset bind:id={id['map']} splitscreen={true}>
	<div slot="background">
		<figure>
			<div class="col-full height-full">
			<Map style={mapstyle} bind:map interactive={false} location={{bounds: mapbounds.uk}}>
				<MapSource
					id="bua"
					type="geojson"
					data={geojson}
					promoteId="GeoCode"
					maxzoom={13}>
					<MapLayer
						id="bua-fill"
						idKey="code"
						colorKey={mapKey + "_color"}
						data={data.bua.indicators}
						type="fill"
						select {selected} on:select={(e) => doSelect(e, map, geojson)} clickIgnore={!explore}
						hover {hovered_bua} on:hover={doHover}
						highlight highlighted={mapHighlighted}
						paint={{
						'fill-color': ['case',
							['!=', ['feature-state', 'color'], null], ['feature-state', 'color'],
							'rgba(255, 255, 255, 0)'
						],
						'fill-opacity': 0.8
						}}
					>
					<MapTooltip content = {
								hovered_bua ? `${metadata.bua.lookup[hovered_bua].name}<br/><strong>${data.bua.indicators.find(d => d.code == hovered_bua)['cluster1_name'].toLocaleString()} ${units[mapKey]}</strong>` : ''
							}
					/>
					</MapLayer>
					<MapLayer
						id="bua-line"
						type="line"
						paint={{
							'line-color': ['case',
								['==', ['feature-state', 'hovered'], true], 'orange',
								['==', ['feature-state', 'selected'], true], 'black',
								['==', ['feature-state', 'highlighted'], true], 'red',
								'rgba(105,105,105,0.3)'
							],
							'line-width': ['case',
								['==', ['feature-state', 'highlighted'], true], 2.5,
								0.8
						]
						}}
					/>
				/>
				</MapSource>
	
			</Map>
			</div>
			<ColourScaleLegend 
				map_key = {mapKey}
				hov = {hover_dict[map_variable_lookup[mapKey].geography]}
				highlighted_val = {(hover_dict[map_variable_lookup[mapKey].geography])? ((hover_data_finder(mapKey) == 'Data unavailable')? '-' : hover_data_finder(mapKey)): ''}
				scale_text =  {(hover_dict[map_variable_lookup[mapKey].geography])? map_variable_lookup[mapKey]['full_name'] + ' for ' + hover_name_finder(mapKey) + ': ': '\n'}
				
			/>
		</figure>
	</div>
	<div slot="foreground">
		<section data-id="map01">
			<div class="col-medium">
				<a id="MoveMap" style="color: black"><br><br></a>
				<p>
					This is a zoomed out map of Local Authority Districts in Great Britain. They are shaded by cluster per job filled.
				</p>
			</div>
		</section>
		<section data-id="map02">
			<div class="col-medium">
				<p>
					This is Powys, which is the Local Authority with the lowest cluster.
				</p>
			</div>
		</section>
	</div>
</Scroller>
{/if}


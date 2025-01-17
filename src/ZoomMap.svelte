<script>

// CORE IMPORTS
	import { setContext, onMount } from "svelte";
	import { getMotion } from "./utils.js";
	import { themes } from "./config.js";
	import Scroller from "./layout/Scroller.svelte";
	import Em from "./ui/Em.svelte";
	import ColourScaleLegend from "./map_components/ColourScaleLegend.svelte";
	
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
	const topojson = "./data/jsons/LAD.json";
    const bua_topojson = "./data/jsons/BUA22.json"
	const mapstyle = "https://bothness.github.io/ons-basemaps/data/style-omt.json";

// Data
    let data = {lad: {}, bua: {}};
	let metadata = {lad: {}, bua: {}};
	let geojson;
    let buajson;
	let LA_opac = 0.7;
	// Element bindings
	let map; // Bound to mapbox 'map' instance once initialised
	// State
	let selected; // Selected area (chart or map)
	let mapHighlighted = []; // Highlighted area (map only)
	let mapKey = "GVA"; // Key for data to be displayed on map
	let explore = false; // Allows chart/map interactivity to be toggled on/off

    let hov = ''; 
    let hover_dict = {};
    let hovered_lad; // Hovered lad (chart or map)
    let hovered_bua; 

    	// Functions for chart and map on:select and on:hover events
	export function doSelect(e, map_id, geo) {
		selected = e.detail.id;
		if (e.detail.feature) fitById(selected, map_id, geo); // Fit map if select event comes from map
	}
	
	export function doHover(e) {
		hovered_lad = '';
		if (e.detail.id !== null){
			let feature_id =  e.detail.id;
            if (e.detail.feature.source == 'lad'){
				hovered_lad = feature_id; 
			}
            else if (e.detail.feature.source == 'bua'){
				hovered_bua = feature_id; 
			}
			else{
				hovered = feature_id;
			}
		}
		hover_dict = {"lad": hovered_lad, "bua": hovered_bua};	
	}

export function doHover_chart(e) {
  hovered = e.detail.id;
}

export let hover_data_finder = function(mapKey){
  let geography_key = map_variable_lookup[mapKey].geography;
  hov = hover_dict[geography_key]
  if (hov){
    let hover_data = data[geography_key].indicators?.find(d => d.code == hov)[mapKey]
    if (hover_data == '0'){
      return "Data unavailable";
    }
    else{
      return Number(hover_data);
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
    $: hovered_lad;
    $: hovered_bua
    $: hover_dict;

//For the scatter/jitter plots, let's attempt to do LAD and MSOA in the same frame.
getData('./data/data_lad.csv')
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
			metadata.lad.array = meta;
			metadata.lad.lookup = lookup;
			let indicators = arr.map((d, i) => ({
				...meta[i],
				cluster: d.cluster,
                //These are dummy data so that when we zoom to BUA, there is something in the cluster part.
				cluster1: d.cluster,
				cluster3: d.cluster,
                //These are dummy data so that when we zoom to bua, there is something in the GVA part.
			}));

            ['cluster'].forEach(key => {
					indicators.forEach((d, i) => indicators[i][key + '_color'] = getColor(d[key], map_variable_lookup[key].scale, map_variable_lookup[key].scale_colours));
				});
            ['cluster1', 'cluster2', 'cluster3'].forEach(key => {
                indicators.forEach((d, i) => indicators[i][key + '_color'] = getColor(d[key], map_variable_lookup['cluster'].scale, colors.seq_tr_20));
				});

			
				data.lad.indicators = indicators;
			});
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
				cluster1: d.cluster1,
				cluster2: d.cluster2,
				cluster3: d.cluster3,
			}));

            ['cluster1','cluster2','cluster3'].forEach(key => {
                indicators.forEach((d, i) => indicators[i][key + '_color'] = getColor(d[key], map_variable_lookup['cluster'].scale, map_variable_lookup['cluster'].scale_colours));
				});
			
				data.bua.indicators = indicators;
			});

//DATA inputs
getTopo(topojson, 'data').then(geo => {
		geojson = geo;
	}); 
    getTopo(bua_topojson, 'data').then(geo => {
		buajson = geo;
	}); 

// FUNCTIONS (INCL. SCROLLER ACTIONS)
      
      
	// Actions for Scroller components
	const actions = {
		map: { // Actions for <Scroller/> with id="map"
		map01: () => {
				fitBounds(mapbounds.uk, map);
				mapKey = "cluster";
				mapHighlighted = [];
				explore = false;
			},
			map02: () => {
				fitFeatures(["E06000019","E06000020","E06000021","E06000025","E06000026","E06000027","E06000028","E06000029","E06000030","E06000031"], map, geojson);
				mapKey = "cluster1";
				mapHighlighted = [];
				explore = false;
			},
			map03: () => {
				fitFeatures(["E06000019","E06000020","E06000021","E06000025","E06000026","E06000027","E06000028","E06000029","E06000030","E06000031"], map, geojson);
				mapKey = "cluster3";
				mapHighlighted = [];
				explore = false;
			},
			map04: () => {
				fitFeatures(["E08000001","E08000002","E08000003","E08000004","E08000005","E08000006","E08000007","E08000008","E08000009","E08000010"], map, geojson);
				mapKey = "cluster1";
				mapHighlighted = [];
				explore = false;
			},
			map05: () => {
				fitFeatures(["E08000001","E08000002","E08000003","E08000004","E08000005","E08000006","E08000007","E08000008","E08000009","E08000010"], map, geojson);
				mapKey = "cluster3";
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


{#if geojson && data.lad.indicators}
<Scroller {threshold} bind:index bind:offset bind:id={id['map']} splitscreen={true}>
	<div slot="background">
		<figure>
			<div class="col-full height-full">
			<Map style={mapstyle} bind:map interactive={false} location={{bounds: mapbounds.uk}}>
				<MapSource
					id="lad"
					type="geojson"
					data={geojson}
					promoteId="GeoCode"
					maxzoom={13}>
					<MapLayer
						id="lad-fill"
						idKey="code"
						colorKey={mapKey + "_color"}
						data={data.lad.indicators}
						type="fill"
						select {selected} on:select={(e) => doSelect(e, map, geojson)} clickIgnore={!explore}
						hover {hovered_lad} on:hover={doHover}
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
								hovered_lad ? `${metadata.lad.lookup[hovered_lad].name}<br/><strong>${data.lad.indicators.find(d => d.code == hovered_lad)[mapKey].toLocaleString()} ${units[mapKey]}</strong>` : ''
							}
					/>
					</MapLayer>
					<MapLayer
						id="lad-line"
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
                <MapSource
					id="bua"
					type="geojson"
					data={buajson}
					promoteId="GeoCode"
					maxzoom={13}>
						{#if offset > 0.1 && index > 0 && map.getLayer('lad-fill')} 
							<MapLayer
								id="bua-fill"
									idKey="code"
									colorKey={mapKey + "_color"}
									data={data.bua.indicators}
									type="fill"
									select {selected} on:select={(e) => doSelect(e, map, buajson)} clickIgnore={!explore}
									hover {hovered_bua} on:hover={doHover}
									highlight highlighted={mapHighlighted}
									paint={{
									'fill-color': ['case',
										['!=', ['feature-state', 'color'], null], ['feature-state', 'color'],
										'rgba(255, 255, 255, 0)'
									],
									'fill-opacity': LA_opac
									}}
								>
							<MapTooltip content={
										hovered_bua ? `${metadata.bua.lookup[hovered_bua].name}<br/><strong>${data.bua.indicators.find(d => d.code == hovered_bua)[mapKey].toLocaleString()} ${units[mapKey]}</strong>` : ''
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
										['==', ['feature-state', 'highlighted'], true], 'black',
										'rgba(105,105,105,0.3)'
									],
									'line-width': 0.8
								}}
							/>
						{:else if id['map'] == 'map01' && index == 0 && map.getLayer('bua-fill')}
							{map.removeLayer('bua-fill')}
							{map.removeLayer('bua-line')}	
						{/if}
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
                <a id="ZoomMap" style="color: black"><br><br></a>
				<p>
					This GVA at Local Authority District level.
				</p>
			</div>
		</section>
		<section data-id="map02">
			<div class="col-medium">
				<p>
					West Midlands - Model 1
				</p>
			</div>
		</section>
		<section data-id="map03">
			<div class="col-medium">
				<p>
					West Midlands - Model 2
				</p>
			</div>
		</section>
		<section data-id="map04">
			<div class="col-medium">
				<p>
					Greater Manchester - Model 1
				</p>
			</div>
		</section>
		<section data-id="map05">
			<div class="col-medium">
				<p>
					Greater Manchester - Model 3
				</p>
			</div>
		</section>
	</div>
</Scroller>
{/if}


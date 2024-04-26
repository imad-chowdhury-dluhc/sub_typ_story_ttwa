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
	const topojson = "./data/jsons/BUA22.json";
    const umh_topojson = "./data/jsons/BUA22_umh.json"
    const hscaa_topojson = "./data/jsons/BUA22_hscaa.json"
    const h_topojson = "./data/jsons/BUA22_h.json"
    const dca_topojson = "./data/jsons/BUA22_dca.json"
    const utac_topojson = "./data/jsons/BUA22_utac.json"
	const mapstyle = "https://bothness.github.io/ons-basemaps/data/style-omt.json";

// Data
    let data = {bua: {}, bua_umh: {}, bua_hscaa: {}, bua_h: {}, bua_dca: {}, bua_utac: {}};
	let metadata = {bua: {}, bua_umh: {}, bua_hscaa: {}, bua_h: {}, bua_dca: {}, bua_utac: {}};
	let geojson;
    let umhjson;
    let hscaajson;
    let hjson;
    let dcajson;
    let utacjson;
	let LA_opac = 0.7;
	// Element bindings
	let map; // Bound to mapbox 'map' instance once initialised
	// State
	let selected; // Selected area (chart or map)
	let mapHighlighted = []; // Highlighted area (map only)
	let mapKey = "cluster2_umh"; // Key for data to be displayed on map
	let explore = false; // Allows chart/map interactivity to be toggled on/off

    let hov = ''; 
    let hover_dict = {};
    let hovered_bua; // Hovered bua (chart or map)
    let hovered_bua_umh;
    let hovered_bua_hscaa;
    let hovered_bua_h;
    let hovered_bua_dca;
    let hovered_bua_utac;

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
            else if (e.detail.feature.source == 'bua_umh'){
				hovered_bua_umh = feature_id; 
			}
            else if (e.detail.feature.source == 'bua_hscaa'){
				hovered_bua_hscaa = feature_id; 
			}
            else if (e.detail.feature.source == 'bua_h'){
				hovered_bua_h = feature_id; 
			}
            else if (e.detail.feature.source == 'bua_dca'){
				hovered_bua_dca = feature_id;
			}
            else if (e.detail.feature.source == 'bua_utac'){
				hovered_bua_utac = feature_id; 
			}
			else{
				hovered = feature_id;
			}
		}
		hover_dict = {"bua": hovered_bua, "bua_umh": hovered_bua_umh, "bua_hscaa": hovered_bua_hscaa, "bua_h": hovered_bua_h, "bua_dca": hovered_bua_dca, "bua_utac": hovered_bua_utac};	
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
    $: hovered_bua;
    $: hovered_bua_umh;
    $: hovered_bua_hscaa;
    $: hovered_bua_h;
    $: hovered_bua_dca;
    $: hovered_bua_utac;
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

			// All Clusters
			let indicators = arr.map((d, i) => ({
				...meta[i],
				cluster: d.cluster2,
			}));

            ['cluster'].forEach(key => {
					indicators.forEach((d, i) => indicators[i][key + '_color'] = getColor(d[key], map_variable_lookup[key].scale, map_variable_lookup[key].scale_colours));
				});

				data.bua.indicators = indicators;

			// Cluster 1
			let indicators1 = arr.map((d, i) => ({
				...meta[i],
				cluster2_umh: d.cluster2,
			}));

            ['cluster2_umh'].forEach(key => {
                indicators1.forEach((d, i) => indicators1[i][key + '_color'] = getColor(d[key], map_variable_lookup['cluster'].scale, map_variable_lookup['cluster'].scale_colours));
				});
			
				data.bua_umh.indicators = indicators1;

			// Cluster 2
			let indicators2 = arr.map((d, i) => ({
				...meta[i],
				cluster2_hscaa: d.cluster2,
			}));

            ['cluster2_hscaa'].forEach(key => {
                indicators2.forEach((d, i) => indicators2[i][key + '_color'] = getColor(d[key], map_variable_lookup['cluster'].scale, map_variable_lookup['cluster'].scale_colours));
				});
			
				data.bua_hscaa.indicators = indicators2;

			// Cluster 3
			let indicators3 = arr.map((d, i) => ({
				...meta[i],
				cluster2_h: d.cluster2,
			}));

            ['cluster2_h'].forEach(key => {
                indicators3.forEach((d, i) => indicators3[i][key + '_color'] = getColor(d[key], map_variable_lookup['cluster'].scale, map_variable_lookup['cluster'].scale_colours));
				});
			
				data.bua_h.indicators = indicators3;

			// Cluster 4
			let indicators4 = arr.map((d, i) => ({
				...meta[i],
				cluster2_dca: d.cluster2,
			}));

            ['cluster2_dca'].forEach(key => {
                indicators4.forEach((d, i) => indicators4[i][key + '_color'] = getColor(d[key], map_variable_lookup['cluster'].scale, map_variable_lookup['cluster'].scale_colours));
				});
			
				data.bua_dca.indicators = indicators4;

			// Cluster 5
			let indicators5 = arr.map((d, i) => ({
				...meta[i],
				cluster2_utac: d.cluster2,
			}));

            ['cluster2_utac'].forEach(key => {
                indicators5.forEach((d, i) => indicators5[i][key + '_color'] = getColor(d[key], map_variable_lookup['cluster'].scale, map_variable_lookup['cluster'].scale_colours));
				});
			
				data.bua_utac.indicators = indicators5;
			});

//DATA inputs
getTopo(topojson, 'data').then(geo => {
		geojson = geo;
	}); 
    getTopo(umh_topojson, 'data').then(geo => {
		umhjson = geo;
	});
    getTopo(hscaa_topojson, 'data').then(geo => {
		hscaajson = geo;
	});
    getTopo(h_topojson, 'data').then(geo => {
		hjson = geo;
	});
    getTopo(dca_topojson, 'data').then(geo => {
		dcajson = geo;
	});
    getTopo(utac_topojson, 'data').then(geo => {
		utacjson = geo;
	});

// FUNCTIONS (INCL. SCROLLER ACTIONS)
      
      
	// Actions for Scroller components
	const actions = {
		map: { // Actions for <Scroller/> with id="map"
		map01: () => {
				fitBounds(mapbounds.england, map);
				mapKey = "cluster";
				mapHighlighted = [];
				explore = false;
			},
			map02: () => {
				fitBounds(mapbounds.england, map);
				mapKey = "cluster2_umh";
				mapHighlighted = [];
				explore = false;
			},
			map03: () => {
				fitBounds(mapbounds.england, map);
				mapKey = "cluster2_hscaa";
				mapHighlighted = [];
				explore = false;
			},
			map04: () => {
				fitBounds(mapbounds.england, map);
				mapKey = "cluster2_h";
				mapHighlighted = [];
				explore = false;
			},
			map05: () => {
				fitBounds(mapbounds.england, map);
				mapKey = "cluster2_dca";
				mapHighlighted = [];
				explore = false;
			},
			map06: () => {
				fitBounds(mapbounds.england, map);
				mapKey = "cluster2_utac";
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
			<Map style={mapstyle} bind:map interactive={false} location={{bounds: mapbounds.england}}>
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
					id="bua_umh"
					type="geojson"
					data={umhjson}
					promoteId="GeoCode"
					maxzoom={13}>
						{#if offset > 0.1 && index > 0 && map.getLayer('bua-fill')} 
							<MapLayer
								id="bua_umh-fill"
									idKey="code"
									colorKey={mapKey + "_color"}
									data={data.bua_umh.indicators}
									type="fill"
									select {selected} on:select={(e) => doSelect(e, map, umhjson)} clickIgnore={!explore}
									hover {hovered_bua_umh} on:hover={doHover}
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
										hovered_bua_umh ? `${metadata.bua_umh.lookup[hovered_bua_umh].name}<br/><strong>${data.bua_umh.indicators.find(d => d.code == hovered_bua_umh)[mapKey].toLocaleString()} ${units[mapKey]}</strong>` : ''
									}
							/>
							</MapLayer>
							<MapLayer
								id="bua_umh-line"
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
						{:else if id['map'] == 'map01' && index == 0 && map.getLayer('bua_umh-fill')}
							{map.removeLayer('bua_umh-fill')}
							{map.removeLayer('bua_umh-line')}
						{:else if id['map'] == 'map03' && index == 0 && map.getLayer('bua_umh-fill')}
							{map.removeLayer('bua_umh-fill')}
							{map.removeLayer('bua_umh-line')}
						{/if}
				/>
				</MapSource>
                <MapSource
					id="bua_hscaa"
					type="geojson"
					data={hscaajson}
					promoteId="GeoCode"
					maxzoom={13}>
						{#if offset > 0.1 && index > 0 && map.getLayer('bua-fill')} 
							<MapLayer
								id="bua_hscaa-fill"
									idKey="code"
									colorKey={mapKey + "_color"}
									data={data.bua_hscaa.indicators}
									type="fill"
									select {selected} on:select={(e) => doSelect(e, map, hscaajson)} clickIgnore={!explore}
									hover {hovered_bua_hscaa} on:hover={doHover}
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
										hovered_bua_hscaa ? `${metadata.bua_hscaa.lookup[hovered_bua_hscaa].name}<br/><strong>${data.bua_hscaa.indicators.find(d => d.code == hovered_bua_hscaa)[mapKey].toLocaleString()} ${units[mapKey]}</strong>` : ''
									}
							/>
							</MapLayer>
							<MapLayer
								id="bua_hscaa-line"
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
						{:else if id['map'] == 'map01' && index == 0 && map.getLayer('bua_hscaa-fill')}
							{map.removeLayer('bua_hscaa-fill')}
							{map.removeLayer('bua_hscaa-line')}
						{:else if id['map'] == 'map02' && index == 0 && map.getLayer('bua_hscaa-fill')}
							{map.removeLayer('bua_hscaa-fill')}
							{map.removeLayer('bua_hscaa-line')}
						{/if}
				/>
				</MapSource>
                <MapSource
					id="bua_h"
					type="geojson"
					data={hjson}
					promoteId="GeoCode"
					maxzoom={13}>
						{#if offset > 0.1 && index > 0 && map.getLayer('bua-fill')} 
							<MapLayer
								id="bua_h-fill"
									idKey="code"
									colorKey={mapKey + "_color"}
									data={data.bua_h.indicators}
									type="fill"
									select {selected} on:select={(e) => doSelect(e, map, hjson)} clickIgnore={!explore}
									hover {hovered_bua_h} on:hover={doHover}
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
										hovered_bua_h ? `${metadata.bua_h.lookup[hovered_bua_h].name}<br/><strong>${data.bua_h.indicators.find(d => d.code == hovered_bua_h)[mapKey].toLocaleString()} ${units[mapKey]}</strong>` : ''
									}
							/>
							</MapLayer>
							<MapLayer
								id="bua_h-line"
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
						{:else if id['map'] == 'map01' && index == 0 && map.getLayer('bua_h-fill')}
							{map.removeLayer('bua_h-fill')}
							{map.removeLayer('bua_h-line')}
						{:else if id['map'] == 'map02' && index == 0 && map.getLayer('bua_h-fill')}
							{map.removeLayer('bua_h-fill')}
							{map.removeLayer('bua_h-line')}
						{/if}
				/>
				</MapSource>
                <MapSource
					id="bua_dca"
					type="geojson"
					data={dcajson}
					promoteId="GeoCode"
					maxzoom={13}>
						{#if offset > 0.1 && index > 0 && map.getLayer('bua-fill')} 
							<MapLayer
								id="bua_dca-fill"
									idKey="code"
									colorKey={mapKey + "_color"}
									data={data.bua_dca.indicators}
									type="fill"
									select {selected} on:select={(e) => doSelect(e, map, dcajson)} clickIgnore={!explore}
									hover {hovered_bua_dca} on:hover={doHover}
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
										hovered_bua_dca ? `${metadata.bua_dca.lookup[hovered_bua_dca].name}<br/><strong>${data.bua_dca.indicators.find(d => d.code == hovered_bua_dca)[mapKey].toLocaleString()} ${units[mapKey]}</strong>` : ''
									}
							/>
							</MapLayer>
							<MapLayer
								id="bua_dca-line"
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
						{:else if id['map'] == 'map01' && index == 0 && map.getLayer('bua_dca-fill')}
							{map.removeLayer('bua_dca-fill')}
							{map.removeLayer('bua_dca-line')}
						{:else if id['map'] == 'map02' && index == 0 && map.getLayer('bua_dca-fill')}
							{map.removeLayer('bua_dca-fill')}
							{map.removeLayer('bua_dca-line')}
						{/if}
				/>
				</MapSource>
                <MapSource
					id="bua_utac"
					type="geojson"
					data={utacjson}
					promoteId="GeoCode"
					maxzoom={13}>
						{#if offset > 0.1 && index > 0 && map.getLayer('bua-fill')} 
							<MapLayer
								id="bua_utac-fill"
									idKey="code"
									colorKey={mapKey + "_color"}
									data={data.bua_utac.indicators}
									type="fill"
									select {selected} on:select={(e) => doSelect(e, map, utacjson)} clickIgnore={!explore}
									hover {hovered_bua_utac} on:hover={doHover}
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
										hovered_bua_utac ? `${metadata.bua_utac.lookup[hovered_bua_utac].name}<br/><strong>${data.bua_utac.indicators.find(d => d.code == hovered_bua_utac)[mapKey].toLocaleString()} ${units[mapKey]}</strong>` : ''
									}
							/>
							</MapLayer>
							<MapLayer
								id="bua_utac-line"
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
						{:else if id['map'] == 'map01' && index == 0 && map.getLayer('bua_utac-fill')}
							{map.removeLayer('bua_utac-fill')}
							{map.removeLayer('bua_utac-line')}
						{:else if id['map'] == 'map02' && index == 0 && map.getLayer('bua_utac-fill')}
							{map.removeLayer('bua_utac-fill')}
							{map.removeLayer('bua_utac-line')}
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
                <a id="ClusterMap" style="color: black"><br><br></a>
				<p>
					This GVA at Local Authority District level.
				</p>
			</div>
		</section>
		<section data-id="map02">
			<div class="col-medium">
				<p>
					Cluster 1
				</p>
			</div>
		</section>
		<section data-id="map03">
			<div class="col-medium">
				<p>
					Cluster 2
				</p>
			</div>
		</section>
		<section data-id="map04">
			<div class="col-medium">
				<p>
					Cluster 3
				</p>
			</div>
		</section>
		<section data-id="map05">
			<div class="col-medium">
				<p>
					Cluster 4
				</p>
			</div>
		</section>
		<section data-id="map06">
			<div class="col-medium">
				<p>
					Cluster 5
				</p>
			</div>
		</section>
	</div>
</Scroller>
{/if}


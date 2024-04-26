<script>

// CORE IMPORTS
	import { setContext, onMount } from "svelte";
	import { getMotion } from "./utils.js";
	import { themes } from "./config.js";
	import Scroller from "./layout/Scroller.svelte";
	import Em from "./ui/Em.svelte";
	import ColourScaleLegend_10 from "./map_components/ColourScaleLegend_10.svelte";
	
    // DEMO-SPECIFIC IMPORTS
	//import bbox from "@turf/bbox";
	import { getData, setColors, getTopo, getPoint, getColor, fitBounds, fitById, fitFeatures} from "./utils.js";
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
	const topojson = "./data/jsons/BUA22_KNN.json";
    const point_json = "./data/jsons/BUA22_towns.json"
	const mapstyle = "https://bothness.github.io/ons-basemaps/data/style-omt.json";

// Data
    let data = {bua: {}, point: {}};
	let metadata = {bua: {}, point: {}};
	let geojson;
    let point_geo;
	let LA_opac = 0.7;
	// Element bindings
	let map; // Bound to mapbox 'map' instance once initialised
	// State
	let selected; // Selected area (chart or map)
	let mapHighlighted = []; // Highlighted area (map only)
	let mapKey = "KNN"; // Key for data to be displayed on map
	let explore = false; // Allows chart/map interactivity to be toggled on/off

    let hov = ''; 
    let hover_dict = {};
    let hovered_bua; // Hovered bua (chart or map)
    let hovered_point;

    	// Functions for chart and map on:select and on:hover events
	export function doSelect(e, map_id, geo) {
		selected = e.detail.id;
		if (e.detail.feature) fitById(selected, map_id, geo); // Fit map if select event comes from map
	}
	
	export function doHover(e) {
		hovered_bua = '';
        hovered_point = '';
		if (e.detail.id !== null){
			let feature_id =  e.detail.id;
      if (e.detail.feature.source == 'bua'){
				hovered_bua = feature_id; 
			}
            else if (e.detail.feature.source == 'point'){
                hovered_point = feature_id;
            }
			else{
				hovered = feature_id;
			}
		}
		hover_dict = {"bua": hovered_bua, "point": hovered_point};	
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
    $: hover_dict;

//For the scatter/jitter plots, let's attempt to do bua and MSOA in the same frame.
getData('./data/data_KNN.csv')
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
                KNN: d.KNN,
			}));

            ['KNN'].forEach(key => {
                indicators.forEach((d, i) => indicators[i][key + '_color'] = getColor(d[key], map_variable_lookup[key].scale, map_variable_lookup[key].scale_colours));
				});
			
				data.bua.indicators = indicators;
			});

            getData(`./data/data_points.csv`)
		.then(arr => {
			let meta = arr.map(d => ({
				code: d.code,
				name: d.name,
			}));
			let lookup = {};
			meta.forEach(d => {
				lookup[d.code] = d;
			});
			metadata.point.array = meta;
			metadata.point.lookup = lookup;
		});

//DATA inputs
    getTopo(topojson, 'data').then(geo => {
		geojson = geo;
	}); 
    getPoint(point_json).then(geo => {
		point_geo = geo;
	});

// FUNCTIONS (INCL. SCROLLER ACTIONS)
      
      
	// Actions for Scroller components
	const actions = {
		map: { // Actions for <Scroller/> with id="map"
		map01: () => {
				fitBounds(mapbounds.england, map);
				mapKey = "KNN";
				mapHighlighted = [];
				explore = false;
			},
            map02: () => {
				fitBounds(mapbounds.england, map);
				mapKey = "KNN";
				mapHighlighted = [];
				explore = false;
			},
            map03: () => {
				fitBounds(mapbounds.blackpool, map);
				mapKey = "KNN";
				mapHighlighted = [];
				explore = false;
			}		}
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
            <div id="points-legend" class="legend" style="display: none; left: 60%, width: 35%; position: absolute">
				<h4>Funds</h4>
				<div><span style="background-color: #206095"></span>55 Towns</div>
			</div>
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
                id="point"
                type="geojson"
                data={point_geo}
                promoteId="GeoCode"
                maxzoom={13}>
                    {#if offset > 0.1 && index > 0} 
                        {document.getElementById('points-legend').style = 'display: block; left: 60%, width: 35%; position: absolute'}
                        <MapLayer
                            id="point-circle"
                            idKey="GeoCode"
                            type="circle"
                            hover {hovered_point} on:hover={doHover}
                            paint={{
                                'circle-color': ['match', ['get', 'BUA22NM'],        
                                'Workington', '#206095',
								'Harrogate', '#206095',
								'Nelson (Pendle)', '#206095',
								'Pudsey', '#206095',
								'Rothwell (Leeds)', '#206095',
								'Accrington', '#206095',
								'Blackburn (Blackburn with Darwen)', '#206095',
								'Leyland', '#206095',
								'Scunthorpe', '#206095',
								'Formby', '#206095',
								'Barnsley', '#206095',
								'Whitefield', '#206095',
								'Wigan', '#206095',
								'Urmston', '#206095',
								'St Helens (St. Helens)', '#206095',
								'Altrincham', '#206095',
								'Ilkeston', '#206095',
								'Grantham', '#206095',
								'Burton upon Trent', '#206095',
								'Rugeley', '#206095',
								'Coalville', '#206095',
								'Norwich', '#206095',
								'Lichfield', '#206095',
								'Burntwood', '#206095',
								'Tamworth', '#206095',
								'March', '#206095',
								'Wednesbury', '#206095',
								'Rowley Regis', '#206095',
								'Smethwick', '#206095',
								'Daventry', '#206095',
								'St Neots', '#206095',
								'Bedford', '#206095',
								'Felixstowe', '#206095',
								"Bishop's Stortford", '#206095',
								'Aylesbury', '#206095',
								'Berkhamsted', '#206095',
								'Chelmsford', '#206095',
								'Cheshunt', '#206095',
								'Didcot', '#206095',
								'Stanford-le-Hope', '#206095',
								'Sittingbourne', '#206095',
								'Sandhurst (Bracknell Forest)', '#206095',
								'Shoreham-by-Sea', '#206095',
								'Ryde', '#206095',
								'St Austell', '#206095',
                                '#206095'], 
                                'circle-radius':8
                                }}
                            >
                            <MapTooltip content = {
								hovered_point ? `${metadata.point.lookup[hovered_point].name}` : ''
							}
					/>
                </MapLayer>
                    {/if}
                    {#if index==0 && map.getLayer('point-circle')}
                    {document.getElementById('points-legend').style = 'display: none; left: 60%, width: 35%; position: absolute'}
                    {map.removeLayer('point-circle')}
                    {/if}					
            </MapSource>
			</Map>
			</div>
            <ColourScaleLegend_10 
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
                <a id="AddPoints" style="color: black"><br><br></a>
				<p>
					Blackpool's top 9 Nearest Neighbours
				</p>
			</div>
		</section>
		<section data-id="map02">
			<div class="col-medium">
				<p>
                    Add the 55 town deals
				</p>
			</div>
		</section>
		<section data-id="map03">
			<div class="col-medium">
				<p>
                    Zoom into Blackpool
				</p>
			</div>
		</section>
	</div>
</Scroller>
{/if}

<style>
.legend {
	background-color: #fff;
	border-radius: 3px;
	top: 30px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
	padding: 10px;
	position: absolute;
	left: 10px;
	z-index: 1;	
}	 
	.legend h4 {
	margin: 0 0 10px;
	} 
	.legend div span {
	border-radius: 50%;
	display: inline-block;
	height: 10px;
	margin-right: 5px;
	width: 10px;
	}

</style>
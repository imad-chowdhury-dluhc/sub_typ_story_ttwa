<script>
    import { setContext, onMount } from "svelte";
    import { themes } from "./config.js";
    import { setColors } from "./utils.js";
	import ONSHeader from "./layout/ONSHeader.svelte";
	import ONSFooter from "./layout/ONSFooter.svelte";
	import Header from "./layout/Header.svelte";
	import Section from "./layout/Section.svelte";
	import Media from "./layout/Media.svelte";
	import Scroller from "./layout/Scroller.svelte";
	import Filler from "./layout/Filler.svelte";
	import Divider from "./layout/Divider.svelte";
	import Toggle from "./ui/Toggle.svelte";
	import Arrow from "./ui/Arrow.svelte";
	import Em from "./ui/Em.svelte";

    let theme = "light";
	setContext("theme", theme);
	setColors(themes, theme);

	import MapBUA from "./MapBUA.svelte";
	// import MapBUA_test from "./MapBUA_test.svelte";
	// import MapBUA_edits from "./MapBUA_edits.svelte";
	import Mapttwa2 from "./Mapttwa2.svelte";
	import ClusterMap from "./ClusterMap.svelte";
	import ZoomMap from "./ZoomMap.svelte";
	import TimeSeries from "./TimeSeries.svelte";
	import TimeSeries2 from "./TimeSeries2.svelte";
	import AddPoints from "./AddPoints.svelte";	

</script>

<ONSHeader filled={true} center={false} />

<Header bgcolor="#206095" bgfixed={true} theme="dark" center={false} short={true}>
	<h1>Subnational Typologies</h1>
	<p class="text-big" style="margin-top: 5px">
		Interactive data story.		
	</p>
	<p style="margin-top: 20px">
		April 2024
	</p>
</Header>

<div id="navpanel" class="floater">
	<p class="initial"> <strong>Page navigation </strong></p>
	<p class="hovered">
	<b style="color: black"> Map elements </b> <br>
	<a href="#ClusterMap"> Cluster map in </a> <br>
	<a href="#ZoomMap"> Zoom map in </a> <br>
	<a href="#TimeSeries"> TimeSeries </a> <br>
	<a href="#TimeSeries2"> TimeSeries2 </a> <br>
	<a href="#AddPoints"> Add points </a> <br>
	<b style="color: black"> Scatter plots </b> <br>
	<a href="#ScatterTransition"> Fancy transitions </a> <br>
</p>
</div> 

<Section>
	<h2>Big Picture</h2>
	<p class="mb">
		Here we'll discuss the details of the project. Map showing how we filtered BUAs and what they are: MoveBUA
	</p>
	
</Section>

<!-- <MapBUA_edits/> -->
<!-- <MapBUA/> -->
<!-- <MapBUA_test/> -->
<Mapttwa2/>

<Section>
	<h2>Model 2 Clustersss</h2>
	<p class="mb">
		We'll first look into the different cluster names and explore each one.
	</p>
	
</Section>



<Section>
	<h2>Model 1 vs Model 3 Comparisons</h2>
	<p class="mb">
		Compare Model 1 and 3 for the West Midlands, Greater Manchester, North West & North East. 
	</p>
	
</Section>



<Section>
	<h2>Characteristic differences</h2>
	<p class="mb">
		Jitter plots for GVA
	</p>
	<p>And a bit about model 2.</p>
	
</Section>

<TimeSeries2/>

<Section>
	<h2>Some KNN Clusters</h2>
	<p class="mb">
		Think it's worth adding one here. Need to look into an appropriate option.
	</p>
</Section>



<Divider/>

<ONSFooter />
<style>

	:global(svelte-scroller-foreground) {
		pointer-events: none !important;
		max-width: 100% !important;
    	overflow-x: hidden !important;
	}
	:global(svelte-scroller-foreground section div) {
		pointer-events: all !important;
	}
	:global(svelte-scroller-background) {
		overflow-x: hidden !important;
	}
	button {
		cursor: pointer;
		font-size: 14px;
		font-weight: bold;
		margin-top: 5px;
	}
	select {
		max-width: 350px;
	}
	.chart {
		margin-top: 45px;
		width: calc(100% - 5px);
	}
	.chart-full {
		margin: 0 20px;
	}
	.chart-sml {
		font-size: 0.85em;
	}
	.media {
		background-color: #f0f0f0;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-ms-flex-flow: column;
		flex-flow: column;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		justify-content: center;
		text-align: center;
		color: #aaa;
	}
	.img {
		float:right;
		height:auto;
	} 
	.legend {
	background-color: #fff;
	border-radius: 3px;
	top: 30px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
	padding: 10px;
	position: absolute;
	right: 10px;
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
		top: 0px;
		text-align: right;
		-webkit-writing-mode: vertical-rl;
		-ms-writing-mode: tb-rl;
		writing-mode: vertical-rl;
		-webkit-transform: rotate(-180deg);
		-ms-transform: rotate(-180deg);
		transform: rotate(-180deg);
	}
	.floater{
  position:fixed;
  top: 3px;
  left: 3px;
  z-index: 100;
  background-color: #fff;
  border: 2px solid #253494;
  font-size: 12px;
  padding: 5px;
-webkit-transition: all 0.3s ease-out;
-moz-transition: all 0.3s ease-out;
-ms-transition: all 0.3s ease-out;
-o-transition: all 0.3s ease-out;
transition: all 0.3s ease-out;
}
.floater .hovered { display:none }
.floater:hover .hovered { display: block; }
.floater p { display: inline }
.floater:hover p { display: inline }
.floater:hover {
  position:fixed;
  top: 3px;
  left: 3px;
  z-index: 100;
  background-color: #fff;
  border: 2px solid #253494;
  font-size: 16px;
  padding: 5px;
}
.floater:active p { display: inline }
.floater:active{
		
		position:fixed;
		top: 3px;
		left: 3px;
		z-index: 100;
		background-color: #fff;
		border: 2px solid #253494;
		font-size: 16px;
		padding: 5px;
	  }
	  
body {
    overflow-x: hidden !important;
}
.container {
    max-width: 100% !important;
    overflow-x: hidden !important;
}
:global() {
    scroll-behavior: smooth;
}
</style>

<!---

/* 
Note this syntax is what I want to use for this, from svelte REPL testing.
<script>
	import Component2 from "./Component2.svelte";
	import C3 from "./Component3.svelte";
	let name = 'World'
</script>

<h1>Hello {name}!</h1>

<h2>
	This now does what I have in Component 2
</h2>
<Component2/>

<h2>
	This now does what I have in Component 3
</h2>
<C3/>
*/


-->
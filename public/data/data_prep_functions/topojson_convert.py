# -*- coding: utf-8 -*-
"""
Created on Thu Apr 13 14:36:02 2023

@author: gordon.donald
"""

# Import packages
import geopandas
import topojson as tp

# Define useful objects
path = 'public/data/'
path_geojsons = path + 'geojsons/'
path_jsons = path + 'jsons/'

#Use Regex to find the column with the ONS area codes. 
#This means we can change it to 'GeoCode' for all geographies and use the same svelte function to look at boundaries.
def get_code_column(dataset):
    col = dataset.columns[dataset.stack().str.match('[ESWN][0-9]{8}').groupby(level=1, sort=False).any()]
    if len(col)==0:
        print("ERROR: No columns that look like the contain geography codes found. Checking if the flag entered matches the expected pattern")
        return(0)
    return(col[0])

#Convert files to topojson format and ensure we using CRS svelte code expects
def convert_json(filename, rename=None, topo=True):
    # Import file
    shape = geopandas.read_file(f"{path_geojsons}{filename}.geojson")

    # Convert geo type and clean columns
    shape = shape.to_crs('EPSG:4326')
    code_col = get_code_column(shape)
    shape.columns = shape.columns.str.replace(code_col, "GeoCode")

    # Save to file
    savefile = f"{path_jsons}{filename}.json" if rename == None else f"{path_jsons}{rename}.json"
    if topo:
        tp.Topology(shape).to_json(savefile)
    else:
        shape.to_file(savefile, driver="GeoJSON") 

# Save files
convert_json("Local_Authority_Districts_December_2021_GB_BUC_2022_1023427260691650215", rename="LAD")
convert_json("BUA_2022_GB_-8042218937152150708", rename="BUA22_full")
convert_json("BUA22_towns", topo=False)
convert_json("BUA22_KNN")
convert_json("BUA22")
convert_json("BUA22_umh")
convert_json("BUA22_hscaa")
convert_json("BUA22_h")
convert_json("BUA22_dca")
convert_json("BUA22_utac")

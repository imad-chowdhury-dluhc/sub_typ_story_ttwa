''' Initiate script '''
# Import packages
import pandas as pd
import geopandas

# Define useful objects
path = 'public/data/'
path2 = path + 'data_prep_functions/'


''' Create new geojson files '''
# Download data
shp = geopandas.read_file(f'{path2}BUA22.geojson')
df = pd.read_csv(f'{path}data_bua.csv')

# Loop through  
cluster_names = ['umh','hscaa','h','dca','utac']
for cluster, name in zip(range(5),cluster_names):
    filter_list = df[df.cluster2 == cluster].code.tolist()
    shp_out = shp[[True if filter_list.count(x) == 1 else False for x in shp.BUA22CD]].reset_index(drop=True)
    shp_out.to_file(f'{path2}BUA22_{name}.geojson', driver="GeoJSON")

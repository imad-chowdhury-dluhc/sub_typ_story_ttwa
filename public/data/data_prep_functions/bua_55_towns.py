''' Initiate script '''
# Import packages
import pandas as pd
import geopandas
import random

# Define useful objects
path = 'public/data/'
path2 = path + 'geojsons/'
q_drive = 'Q:/SDU/Jac/subnational_typologies/resources/'


''' Create new geojson files '''
# Download data
shp = geopandas.read_file(f'{path2}BUA22.geojson')
df = pd.read_excel(f'{q_drive}55 Towns to BUA22 and populations.xlsx',sheet_name='55 Places')

# Convert shapefile to centroids
shp.geometry = shp.centroid

# Filter shape file to the 55 towns
towns = df[df['BUA code'].notnull()]['BUA code'].tolist()
towns = random.sample(shp.BUA22CD.tolist(),45)
shp = shp[[True if towns.count(x) > 0 else False for x in shp.BUA22CD]].reset_index(drop=True)

# Save to file
shp[['BUA22CD','BUA22NM']].to_csv(f'{path}data_towns.csv')
shp.to_file(f'{path2}BUA22_towns.geojson', driver="GeoJSON")